/**
 * ChartAI — Osiris Discovery Engine
 * Scans Binance for top setups using F1–F4 filters.
 */

const BINANCE_BASE          = 'https://api.binance.com'
const MIN_VOLUME_30M        = 30_000_000
const MIN_VOLUME_F1_50M     = 50_000_000
const TOP_PAIRS             = 30
const KLINES_LIMIT          = 48      // 48 × 1h = 48 h
const CORR_WINDOW           = 24      // last 24 candles for BTC correlation
const ATR_PERIOD            = 14
const MIN_NATR              = 0.8     // %
const MAX_BTC_CORR          = 0.70
const VOLUME_SPIKE_MULT     = 1.3
const RESULT_TOP_N          = 5
const BATCH_SIZE            = 5       // parallel kline fetches

// ── Stable-coins to skip ────────────────────────────────────────────────────
const STABLES = new Set([
  'USDC','BUSD','TUSD','USDP','DAI','FDUSD','SUSD','GUSD',
  'EUR','GBP','PAXG',
])

// ── Binance raw types ────────────────────────────────────────────────────────
interface BinanceTicker {
  symbol:             string
  lastPrice:          string
  priceChangePercent: string
  quoteVolume:        string   // 24-h volume in USDT
}
// [openTime, open, high, low, close, baseVol, closeTime, quoteVol, ...]
type BinanceKline = [number, string, string, string, string, string, number, string, ...unknown[]]

// ── Public result types ──────────────────────────────────────────────────────
export interface FilterResult {
  passed: boolean
  reason: string
}

export interface OsirisFilters {
  f1: FilterResult   // Volume 24h > $50M  AND  hourly spike > 1.3×
  f2: FilterResult   // NATR > 0.8%
  f3: FilterResult   // EMA20 vs EMA50
  f4: FilterResult   // |Pearson(coin, BTC)| < 0.70
  passedCount: number
  direction: 'LONG' | 'SHORT' | 'NEUTRAL'
}

export interface DiscoveredCoin {
  symbol:        string   // "LINKUSDT"
  baseAsset:     string   // "LINK"
  volume24h:     number   // USD
  lastPrice:     number
  priceChange24h: number  // %
  filters:       OsirisFilters
}

// ── Math helpers ─────────────────────────────────────────────────────────────

function calcEMA(values: number[], period: number): number[] {
  if (values.length < period) return []
  const k = 2 / (period + 1)
  const result: number[] = new Array(values.length).fill(NaN)
  let seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period
  result[period - 1] = seed
  for (let i = period; i < values.length; i++) {
    seed = values[i] * k + seed * (1 - k)
    result[i] = seed
  }
  return result
}

function calcATR(highs: number[], lows: number[], closes: number[], period: number): number {
  const trs: number[] = []
  for (let i = 1; i < closes.length; i++) {
    trs.push(Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1]),
    ))
  }
  const slice = trs.slice(-period)
  return slice.length ? slice.reduce((a, b) => a + b, 0) / slice.length : 0
}

function pearsonCorrelation(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length)
  if (n < 3) return 0
  const mx = xs.slice(0, n).reduce((a, b) => a + b, 0) / n
  const my = ys.slice(0, n).reduce((a, b) => a + b, 0) / n
  let num = 0, sx = 0, sy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my
    num += dx * dy; sx += dx * dx; sy += dy * dy
  }
  return sx === 0 || sy === 0 ? 0 : num / Math.sqrt(sx * sy)
}

// ── Binance fetch helpers ────────────────────────────────────────────────────

async function fetchTickers(): Promise<BinanceTicker[]> {
  const res = await fetch(`${BINANCE_BASE}/api/v3/ticker/24hr`, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Binance /ticker/24hr ${res.status}`)
  return res.json()
}

async function fetchKlines(symbol: string): Promise<BinanceKline[]> {
  const url = `${BINANCE_BASE}/api/v3/klines?symbol=${symbol}&interval=1h&limit=${KLINES_LIMIT}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Binance /klines ${symbol} ${res.status}`)
  return res.json()
}

// ── Filter a single coin ─────────────────────────────────────────────────────

function applyFilters(
  ticker: BinanceTicker,
  klines: BinanceKline[],
  btcCloses: number[],
): OsirisFilters {
  const highs    = klines.map(k => parseFloat(k[2]))
  const lows     = klines.map(k => parseFloat(k[3]))
  const closes   = klines.map(k => parseFloat(k[4]))
  const qvols    = klines.map(k => parseFloat(k[7]))  // USDT volume per candle
  const lastClose = closes[closes.length - 1]
  const vol24h    = parseFloat(ticker.quoteVolume)

  // F1 — volume 24h > $50M  AND  current-hour spike > 1.3× avg
  const prevVols     = qvols.slice(0, -1)
  const avgHourlyVol = prevVols.length
    ? prevVols.reduce((a, b) => a + b, 0) / prevVols.length
    : 0
  const lastHourVol  = qvols[qvols.length - 1]
  const spikeRatio   = avgHourlyVol > 0 ? lastHourVol / avgHourlyVol : 0
  const f1Passed     = vol24h >= MIN_VOLUME_F1_50M && spikeRatio >= VOLUME_SPIKE_MULT
  const f1: FilterResult = {
    passed: f1Passed,
    reason: f1Passed
      ? `Vol $${(vol24h / 1e6).toFixed(0)}M · spike ${spikeRatio.toFixed(1)}×`
      : vol24h < MIN_VOLUME_F1_50M
        ? `Vol $${(vol24h / 1e6).toFixed(0)}M < $50M`
        : `Spike ${spikeRatio.toFixed(1)}× < 1.3× required`,
  }

  // F2 — NATR > 0.8%
  const atrVal  = calcATR(highs, lows, closes, ATR_PERIOD)
  const natr    = lastClose > 0 ? (atrVal / lastClose) * 100 : 0
  const f2: FilterResult = {
    passed: natr > MIN_NATR,
    reason: `NATR ${natr.toFixed(2)}% (min ${MIN_NATR}%)`,
  }

  // F3 — EMA20 vs EMA50
  const ema20arr = calcEMA(closes, 20)
  const ema50arr = calcEMA(closes, 50)
  const ema20    = ema20arr[ema20arr.length - 1]
  const ema50    = ema50arr[ema50arr.length - 1]
  const emaOk    = !isNaN(ema20) && !isNaN(ema50)
  const isBull   = emaOk && ema20 > ema50
  const isBear   = emaOk && ema20 < ema50
  const f3: FilterResult = {
    passed: emaOk,
    reason: emaOk
      ? isBull
        ? `EMA20 > EMA50 — bullish (+${((ema20 / ema50 - 1) * 100).toFixed(2)}%)`
        : `EMA20 < EMA50 — bearish (${((ema20 / ema50 - 1) * 100).toFixed(2)}%)`
      : 'Insufficient candles for EMA50',
  }

  // F4 — |Pearson(coin, BTC)| < 0.70
  const coinSlice = closes.slice(-CORR_WINDOW)
  const btcSlice  = btcCloses.slice(-CORR_WINDOW)
  const corr      = Math.abs(pearsonCorrelation(coinSlice, btcSlice))
  const f4: FilterResult = {
    passed: corr < MAX_BTC_CORR,
    reason: `BTC corr ${corr.toFixed(2)} (max ${MAX_BTC_CORR})`,
  }

  const passedCount = [f1, f2, f3, f4].filter(f => f.passed).length
  const direction: 'LONG' | 'SHORT' | 'NEUTRAL' =
    isBull ? 'LONG' : isBear ? 'SHORT' : 'NEUTRAL'

  return { f1, f2, f3, f4, passedCount, direction }
}

// ── Main export ──────────────────────────────────────────────────────────────

export async function scanMarket(): Promise<DiscoveredCoin[]> {
  // 1. Top 100 by volume
  const allTickers = await fetchTickers()

  // 2. Filter USDT pairs, exclude stables, volume > $30M, take top 30
  const candidates = allTickers
    .filter(t => {
      const base = t.symbol.replace(/USDT$/, '')
      return (
        t.symbol.endsWith('USDT') &&
        !STABLES.has(base) &&
        parseFloat(t.quoteVolume) >= MIN_VOLUME_30M
      )
    })
    .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, TOP_PAIRS)

  // 3. BTC 1h klines for correlation baseline
  const btcKlines = await fetchKlines('BTCUSDT')
  const btcCloses = btcKlines.map(k => parseFloat(k[4]))

  // 4. Fetch klines in batches of BATCH_SIZE, apply filters
  const results: DiscoveredCoin[] = []

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE)
    const settled = await Promise.allSettled(
      batch.map(async (ticker): Promise<DiscoveredCoin> => {
        const klines  = await fetchKlines(ticker.symbol)
        const filters = applyFilters(ticker, klines, btcCloses)
        return {
          symbol:         ticker.symbol,
          baseAsset:      ticker.symbol.replace(/USDT$/, ''),
          volume24h:      parseFloat(ticker.quoteVolume),
          lastPrice:      parseFloat(ticker.lastPrice),
          priceChange24h: parseFloat(ticker.priceChangePercent),
          filters,
        }
      }),
    )
    for (const s of settled) {
      if (s.status === 'fulfilled') results.push(s.value)
      else console.warn('Discovery batch error:', s.reason)
    }
  }

  // 5. Sort: most filters passed → highest volume; return top 5
  return results
    .sort((a, b) =>
      b.filters.passedCount - a.filters.passedCount ||
      b.volume24h - a.volume24h
    )
    .slice(0, RESULT_TOP_N)
}
