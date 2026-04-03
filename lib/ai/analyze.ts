import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface AnalysisResult {
  ticker: string
  timeframe: string
  trend: string
  pattern: string
  signal: 'LONG' | 'SHORT' | 'NEUTRAL'
  entry_price: number
  stop_loss: number
  take_profit_1: number
  take_profit_2: number
  take_profit_3: number
  risk_reward: number
  support_level: number
  resistance_level: number
  confidence: number
  rationale: string
  key_levels: { label: string; price: number; type: string }[]
  indicators: { name: string; value: string; signal: string }[]
}

// STEP 1: Gemini Flash Vision - extract raw chart data
async function extractChartData(imageBase64: string, mimeType: string): Promise<string> {
  const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `You are an expert technical analyst. Analyze this cryptocurrency/trading chart and extract ALL visible information.

Return a detailed technical description including:
1. PRICE ACTION: Current price, recent high/low, candlestick patterns visible
2. TREND: Overall trend direction (uptrend/downtrend/sideways), strength
3. PATTERNS: Chart patterns (head & shoulders, double top/bottom, wedge, triangle, flag, etc.)
4. SUPPORT & RESISTANCE: All visible S/R levels with approximate prices
5. INDICATORS: Any visible indicators (RSI, MACD, MA, Bollinger Bands, Volume) and their values/signals
6. VOLUME: Volume trend (increasing/decreasing, above/below average)
7. TIMEFRAME: Visible timeframe if shown (1m, 5m, 15m, 1h, 4h, 1D, 1W)
8. TICKER: Any visible ticker symbol
9. KEY OBSERVATIONS: Any other technically significant observations

Be precise with price levels. Extract exact numbers where visible.`

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    },
  ])

  return result.response.text()
}

// STEP 2: Claude Sonnet - reasoning + signal generation using Osiris methodology
async function generateSignal(chartData: string): Promise<AnalysisResult> {
  const systemPrompt = `You are ChartAI, an expert algorithmic trading signal generator with 10+ years of experience.
You use the Osiris Methodology — a 7-filter system for high-probability trade signals:

1. FUEL Filter: Is there enough momentum/volume to sustain the move?
2. TENSION Filter: Is there price tension (compression, squeeze) ready to release?
3. TREND SYNC: Does the signal align with the higher timeframe trend?
4. BTC CORRELATION: For alt-coins, is BTC supporting or opposing this move?
5. MARKET STRUCTURE: Are key S/R levels, order blocks, or FVGs confirming the setup?
6. ENTRY ZONE: Is price in an optimal entry zone (not overextended)?
7. ENTRY TRIGGER: Is there a clear trigger candle/pattern to enter on?

Apply these filters to generate a precise, actionable trading signal.
Always respond in valid JSON only — no markdown, no explanation outside the JSON.`

  const userPrompt = `Based on this chart analysis, generate a precise trading signal:

CHART DATA:
${chartData}

Generate a complete analysis in this exact JSON format:
{
  "ticker": "BTC/USDT or detected ticker",
  "timeframe": "detected or estimated timeframe",
  "trend": "BULLISH | BEARISH | SIDEWAYS",
  "pattern": "primary chart pattern detected",
  "signal": "LONG | SHORT | NEUTRAL",
  "entry_price": 0.00,
  "stop_loss": 0.00,
  "take_profit_1": 0.00,
  "take_profit_2": 0.00,
  "take_profit_3": 0.00,
  "risk_reward": 0.0,
  "support_level": 0.00,
  "resistance_level": 0.00,
  "confidence": 75,
  "rationale": "2-3 sentence explanation of the signal based on Osiris filters",
  "key_levels": [
    {"label": "Key Support", "price": 0.00, "type": "support"},
    {"label": "Key Resistance", "price": 0.00, "type": "resistance"},
    {"label": "Entry Zone", "price": 0.00, "type": "entry"}
  ],
  "indicators": [
    {"name": "RSI", "value": "65", "signal": "bullish"},
    {"name": "MACD", "value": "crossing up", "signal": "bullish"},
    {"name": "Volume", "value": "above average", "signal": "bullish"}
  ]
}

Rules:
- If price data isn't clear, use relative values (1.000 = current price)
- Confidence: 0-100 based on how many Osiris filters align
- Risk/Reward: (TP1-Entry)/(Entry-SL) ratio
- Only set LONG/SHORT if confidence > 50, otherwise NEUTRAL`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonText = content.text.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(jsonText) as AnalysisResult
}

// Main export: full pipeline
export async function analyzeChart(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<AnalysisResult> {
  // Step 1: Gemini extracts visual data
  const chartData = await extractChartData(imageBase64, mimeType)

  // Step 2: Claude generates signal using Osiris methodology
  const signal = await generateSignal(chartData)

  return signal
}
