'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface Company {
  id: string
  name: string
  email: string
  currency: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')
    const companyData = localStorage.getItem('company')

    if (!token || !userData || !companyData) {
      router.push('/login')
      return
    }

    try {
      setUser(JSON.parse(userData))
      setCompany(JSON.parse(companyData))
    } catch (error) {
      console.error('Error parsing stored data:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (!user || !company) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        companyName={company.name} 
        userRole={user.role}
      />
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text">
                Welcome back, {user.first_name}!
              </h1>
              <p className="text-gray-600">
                {company.name} • {company.currency}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-text">
                  {user.first_name} {user.last_name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user.role}
                </div>
              </div>
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                {user.first_name[0]}{user.last_name[0]}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
