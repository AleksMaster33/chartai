import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChartAI — AI Crypto Chart Analyzer',
  description: 'Upload any crypto chart and get instant AI trading signals with entry, stop-loss, and take-profit levels. Powered by Osiris methodology.',
  keywords: 'AI crypto analysis, trading signals, chart analyzer, bitcoin analysis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-[#f0ede8] antialiased">
        {children}
      </body>
    </html>
  )
}
