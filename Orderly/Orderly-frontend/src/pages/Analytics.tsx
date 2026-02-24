import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  UsersIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import type { Analytics } from '../types';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analytics: Analytics = {
    totalOrders: 156,
    totalRevenue: 2450000,
    pendingOrders: 12,
    paidOrders: 132,
    deliveredOrders: 120,
    averageOrderValue: 15705,
    todayRevenue: 85000,
    weekRevenue: 450000,
    monthRevenue: 2450000,
    topCustomers: [
      { id: '1', name: 'Sarah Johnson', phone: '+234 802 345 6789', totalOrders: 12, totalSpent: 45000, lastOrderDate: '2024-02-15', createdAt: '2024-01-10' },
      { id: '2', name: 'Amina Bello', phone: '+234 804 567 8901', totalOrders: 15, totalSpent: 67000, lastOrderDate: '2024-02-16', createdAt: '2024-01-05' },
      { id: '3', name: 'Mike Chen', phone: '+234 803 456 7890', totalOrders: 8, totalSpent: 32000, lastOrderDate: '2024-02-14', createdAt: '2024-01-15' }
    ],
    recentOrders: []
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: `₦${(analytics.totalRevenue / 1000).toFixed(0)}K`,
      change: '+12.5%',
      trend: 'up',
      icon: CreditCardIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCartIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Average Order Value',
      value: `₦${analytics.averageOrderValue.toLocaleString()}`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUpIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Customers',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: UsersIcon,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="container pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track your business performance</p>
          </div>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUpIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Revenue chart will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Orders Chart Placeholder */}
            <div className="card p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Orders Trend</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ShoppingCartIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Orders chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="space-y-8">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Customers</h2>
              <div className="space-y-4">
                {analytics.topCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.totalOrders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₦{customer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold text-yellow-600">{analytics.pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid Orders</span>
                  <span className="font-semibold text-green-600">{analytics.paidOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivered Orders</span>
                  <span className="font-semibold text-blue-600">{analytics.deliveredOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's Revenue</span>
                  <span className="font-semibold text-gray-900">₦{analytics.todayRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Week Revenue</span>
                  <span className="font-semibold text-gray-900">₦{analytics.weekRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
