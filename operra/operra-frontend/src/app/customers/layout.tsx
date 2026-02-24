import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customers - Operra',
  description: 'Manage your customer relationships and track purchase history',
}

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
