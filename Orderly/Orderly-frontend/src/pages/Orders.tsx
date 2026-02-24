import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { 
  ShoppingCartIcon, 
  SearchIcon, 
  PlusIcon,
  FilterIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  TrashIcon
} from 'lucide-react';
import type { Order } from '../types';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders: Order[] = [
    {
      id: '001',
      customerId: '1',
      customerName: 'Sarah Johnson',
      customerPhone: '+234 802 345 6789',
      items: [
        { id: '1', name: 'Designer Bag', quantity: 1, price: 15000, total: 15000 },
        { id: '2', name: 'Wallet', quantity: 2, price: 2500, total: 5000 }
      ],
      totalAmount: 20000,
      status: 'paid',
      paymentStatus: 'paid',
      orderDate: '2024-02-15',
      deliveryDate: '2024-02-17',
      notes: 'Customer requested express delivery',
      createdAt: '2024-02-15T10:30:00Z',
      updatedAt: '2024-02-15T14:20:00Z'
    },
    {
      id: '002',
      customerId: '2',
      customerName: 'Mike Chen',
      customerPhone: '+234 803 456 7890',
      items: [
        { id: '3', name: 'Running Shoes', quantity: 1, price: 12000, total: 12000 }
      ],
      totalAmount: 12000,
      status: 'pending',
      paymentStatus: 'pending',
      orderDate: '2024-02-16',
      notes: 'Payment expected tomorrow',
      createdAt: '2024-02-16T09:15:00Z',
      updatedAt: '2024-02-16T09:15:00Z'
    },
    {
      id: '003',
      customerId: '3',
      customerName: 'Amina Bello',
      customerPhone: '+234 804 567 8901',
      items: [
        { id: '4', name: 'Makeup Kit', quantity: 1, price: 8000, total: 8000 },
        { id: '5', name: 'Perfume', quantity: 1, price: 5000, total: 5000 }
      ],
      totalAmount: 13000,
      status: 'delivered',
      paymentStatus: 'paid',
      orderDate: '2024-02-14',
      deliveryDate: '2024-02-15',
      createdAt: '2024-02-14T16:45:00Z',
      updatedAt: '2024-02-15T11:30:00Z'
    }
  ];

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm) ||
    (selectedStatus !== 'all' && order.status === selectedStatus)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="container pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all orders</p>
          </div>
          
          <button className="btn-primary mt-4 sm:mt-0">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Order
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <FilterIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.paymentStatus === 'paid').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <EyeIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-6 h-6" />
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button className="btn-secondary">
              <FilterIcon className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 text-sm">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        <p className="text-gray-500">{order.items[0]?.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">₦{order.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.orderDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-blue-600">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
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
