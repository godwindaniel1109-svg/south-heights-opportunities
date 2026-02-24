'use client'

import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    outstandingPayments: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Invoice created', entity: 'INV-001', time: '2 hours ago', user: 'John Doe' },
    { id: 2, action: 'Payment received', entity: 'Customer A', time: '4 hours ago', user: 'Jane Smith' },
    { id: 3, action: 'New customer added', entity: 'Customer B', time: '1 day ago', user: 'John Doe' },
    { id: 4, action: 'Expense recorded', entity: 'Office Rent', time: '2 days ago', user: 'Jane Smith' },
  ])

  const [topProducts, setTopProducts] = useState([
    { name: 'Professional Service', revenue: 45000, units: 3 },
    { name: 'Consulting Package', revenue: 30000, units: 2 },
    { name: 'Support Plan', revenue: 15000, units: 5 },
  ])

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      // In real app, this would fetch from API
      setTimeout(() => {
        setDashboardData({
          revenue: 2450000,
          expenses: 1600000,
          profit: 850000,
          outstandingPayments: 125000,
          totalCustomers: 142,
          totalInvoices: 89,
          paidInvoices: 67,
          pendingInvoices: 22
        })
        setLoading(false)
      }, 1000)
    }

    loadDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGR', '₦')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold text-text">Executive Dashboard</h2>
        <p className="text-gray-600 mt-1">Real-time overview of your business performance</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Revenue</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-2xl font-bold text-text">
            {formatCurrency(dashboardData.revenue)}
          </div>
          <div className="text-sm text-green-600 mt-1">+12% from last month</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Expenses</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-2xl font-bold text-text">
            {formatCurrency(dashboardData.expenses)}
          </div>
          <div className="text-sm text-red-600 mt-1">+5% from last month</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Net Profit</span>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(dashboardData.profit)}
          </div>
          <div className="text-sm text-green-600 mt-1">+18% from last month</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Outstanding</span>
            <span className="text-2xl">⏰</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(dashboardData.outstandingPayments)}
          </div>
          <div className="text-sm text-gray-600 mt-1">{dashboardData.pendingInvoices} pending invoices</div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Revenue chart will be displayed here</p>
              <p className="text-sm">Last 6 months performance</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.units} units sold</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.entity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{activity.time}</div>
                    <div className="text-xs text-gray-400">{activity.user}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Customer Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Customers</span>
                <span className="font-semibold">{dashboardData.totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active This Month</span>
                <span className="font-semibold text-green-600">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New This Month</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Invoice Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Invoices</span>
                <span className="font-semibold">{dashboardData.totalInvoices}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Paid</span>
                <span className="font-semibold text-green-600">{dashboardData.paidInvoices}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-orange-600">{dashboardData.pendingInvoices}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
