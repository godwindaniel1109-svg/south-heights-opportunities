import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { 
  UsersIcon, 
  SearchIcon, 
  PlusIcon,
  FilterIcon,
  MoreVerticalIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon
} from 'lucide-react';
import type { Customer } from '../types';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const customers: Customer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+234 802 345 6789',
      email: 'sarah.j@email.com',
      totalOrders: 12,
      totalSpent: 45000,
      lastOrderDate: '2024-02-15',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Mike Chen',
      phone: '+234 803 456 7890',
      totalOrders: 8,
      totalSpent: 32000,
      lastOrderDate: '2024-02-14',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Amina Bello',
      phone: '+234 804 567 8901',
      totalOrders: 15,
      totalSpent: 67000,
      lastOrderDate: '2024-02-16',
      createdAt: '2024-01-05'
    },
    {
      id: '4',
      name: 'David Okafor',
      phone: '+234 805 678 9012',
      totalOrders: 6,
      totalSpent: 18000,
      lastOrderDate: '2024-02-10',
      createdAt: '2024-01-20'
    }
  ];

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="container pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage your customer database</p>
          </div>
          
          <button className="btn-primary mt-4 sm:mt-0">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₦162K</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Customers</option>
              <option value="recent">Recent Orders</option>
              <option value="high-value">High Value</option>
              <option value="new">New Customers</option>
            </select>
            
            <button className="btn-secondary">
              <FilterIcon className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 text-sm">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Contact</th>
                  <th className="px-6 py-3 font-medium">Orders</th>
                  <th className="px-6 py-3 font-medium">Total Spent</th>
                  <th className="px-6 py-3 font-medium">Last Order</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">ID: {customer.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 mr-1" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MailIcon className="w-4 h-4 mr-1" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">{customer.totalOrders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 font-medium">₦{customer.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{customer.lastOrderDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVerticalIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
