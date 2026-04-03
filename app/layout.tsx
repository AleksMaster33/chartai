import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChartAI — AI Crypto Chart Analyzer',
  description: 'Upload any crypto chart and get instant AI trading signals with entry, stop-loss, and take-profit levels.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }} className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
