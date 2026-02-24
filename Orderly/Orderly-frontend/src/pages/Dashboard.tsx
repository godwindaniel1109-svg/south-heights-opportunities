import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { 
  UsersIcon, 
  ShoppingCartIcon, 
  CreditCardIcon, 
  PlusIcon,
  BellIcon
} from 'lucide-react';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const stats = [
    {
      label: 'Total Orders',
      value: '24',
      change: '+12%',
      icon: ShoppingCartIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Revenue',
      value: '₦45,600',
      change: '+8%',
      icon: CreditCardIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Customers',
      value: '156',
      change: '+5%',
      icon: UsersIcon,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Pending',
      value: '8',
      change: '-2%',
      icon: BellIcon,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentOrders = [
    { id: '001', customer: 'Sarah Johnson', amount: '₦3,500', status: 'paid', date: '2 hours ago' },
    { id: '002', customer: 'Mike Chen', amount: '₦2,800', status: 'pending', date: '3 hours ago' },
    { id: '003', customer: 'Amina Bello', amount: '₦5,200', status: 'delivered', date: '5 hours ago' },
    { id: '004', customer: 'David Okafor', amount: '₦1,900', status: 'pending', date: '6 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="container pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <button className="btn-primary">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Order
            </button>
          </div>
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
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-gray-100">
                        <td className="py-3 text-gray-900 font-medium">#{order.id}</td>
                        <td className="py-3 text-gray-700">{order.customer}</td>
                        <td className="py-3 text-gray-900 font-medium">{order.amount}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full btn-secondary justify-start">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Customer
                </button>
                <button className="w-full btn-secondary justify-start">
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Create Order
                </button>
                <button className="w-full btn-secondary justify-start">
                  <BellIcon className="w-4 h-4 mr-2" />
                  Set Reminder
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Tips</h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Follow up with pending payments within 24 hours for better conversion rates.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Great job!</strong> Your sales are up 15% this week compared to last week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
