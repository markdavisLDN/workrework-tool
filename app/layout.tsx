import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Job Automation Assessment — Work/reWork',
  description: 'Find out which parts of your role could be automated — now and in the future.',
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
