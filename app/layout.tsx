import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Discord Webhook Vezérlő',
  description: 'Egy erős fejlesztői eszköz Discord webhookok kezelésére és végrehajtására.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hu">
      <body suppressHydrationWarning className={`${jetbrainsMono.variable} font-mono antialiased`}>{children}</body>
    </html>
  )
}
