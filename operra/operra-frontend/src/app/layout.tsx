import './styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Operra - Operating System for Modern African Businesses',
  description: 'Run your entire business from one intelligent workspace. Manage sales, finance, staff performance, and daily operations.',
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
