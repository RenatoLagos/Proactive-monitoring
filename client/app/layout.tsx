import type { Metadata } from 'next'
import "@/app/globals.css"

export const metadata: Metadata = {
  title: 'Robot Monitoring System',
  description: 'Robot Monitoring System',
  generator: 'v0.dev',
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
