import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sales & Invoices - Operra',
  description: 'Create and manage your invoices and track sales performance',
}

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
