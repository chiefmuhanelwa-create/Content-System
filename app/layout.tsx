import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NOCHILL Content Governance System',
  description: 'For children\'s children - Building Africa\'s Largest School of Influence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
