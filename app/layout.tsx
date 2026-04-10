import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChartAI — AI Crypto Chart Analyzer',
  description: 'Upload any crypto chart and get instant AI trading signals powered by the Osiris 7-filter methodology.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#080B10] text-[#E8EDF5]"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
