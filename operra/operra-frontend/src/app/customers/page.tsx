'use client'

import { useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  outstanding_balance: number
  total_purchases: number
  is_vip: boolean
  created_at: string
  updated_at: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    is_vip: false
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${API_URL}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setCustomers(data.data)
      } else {
        setError(data.message || 'Failed to fetch customers')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('accessToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const url = editingCustomer 
        ? `${API_URL}/api/customers/${editingCustomer.id}`
        : `${API_URL}/api/customers`
      
      const method = editingCustomer ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateModal(false)
        setEditingCustomer(null)
        setFormData({ name: '', email: '', phone: '', address: '', notes: '', is_vip: false })
        fetchCustomers()
      } else {
        setError(data.message || 'Failed to save customer')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      notes: customer.notes || '',
      is_vip: customer.is_vip
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    
    try {
      const token = localStorage.getItem('accessToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        fetchCustomers()
      } else {
        setError(data.message || 'Failed to delete customer')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGR', '₦')
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-text">Customers</h2>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          + Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Customers</div>
          <div className="text-2xl font-bold">{customers.length}</div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">VIP Customers</div>
          <div className="text-2xl font-bold">{customers.filter(c => c.is_vip).length}</div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold">{formatCurrency(customers.reduce((sum, c) => sum + c.total_purchases, 0))}</div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Outstanding</div>
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(customers.reduce((sum, c) => sum + c.outstanding_balance, 0))}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Customers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Total Purchases</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Outstanding</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      {customer.is_vip && (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-1">
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {customer.email && <div>{customer.email}</div>}
                      {customer.phone && <div className="text-gray-600">{customer.phone}</div>}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatCurrency(customer.total_purchases)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${customer.outstanding_balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatCurrency(customer.outstanding_balance)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      customer.outstanding_balance > 0 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.outstanding_balance > 0 ? 'Owes' : 'Clear'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer to get started.'}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  placeholder="+2348012345678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-field"
                  rows={2}
                  placeholder="123 Main Street, Lagos"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows={2}
                  placeholder="Additional notes about this customer..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_vip"
                  checked={formData.is_vip}
                  onChange={(e) => setFormData({...formData, is_vip: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="is_vip" className="text-sm font-medium text-gray-700">
                  Mark as VIP Customer
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingCustomer(null)
                    setFormData({ name: '', email: '', phone: '', address: '', notes: '', is_vip: false })
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
