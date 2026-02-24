'use client'

import { useState, useEffect } from 'react'

interface Invoice {
  id: string
  invoice_number: string
  customer_name?: string
  customer_email?: string
  issue_date: string
  due_date?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  tax_amount: number
  total_amount: number
  paid_amount: number
  balance: number
  notes?: string
  created_at: string
}

interface Customer {
  id: string
  name: string
  email?: string
}

export default function SalesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [formData, setFormData] = useState({
    customer_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    items: [
      { description: '', quantity: 1, unit_price: 0 }
    ],
    notes: '',
    tax_percentage: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      // Fetch invoices
      const invoicesResponse = await fetch(`${API_URL}/api/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Fetch customers
      const customersResponse = await fetch(`${API_URL}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const invoicesData = await invoicesResponse.json()
      const customersData = await customersResponse.json()

      if (invoicesData.success) {
        setInvoices(invoicesData.data)
      } else {
        setError(invoicesData.message || 'Failed to fetch invoices')
      }

      if (customersData.success) {
        setCustomers(customersData.data)
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
      
      const response = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setShowCreateModal(false)
        setFormData({
          customer_id: '',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: '',
          items: [{ description: '', quantity: 1, unit_price: 0 }],
          notes: '',
          tax_percentage: 0
        })
        fetchData()
      } else {
        setError(data.message || 'Failed to create invoice')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      const data = await response.json()

      if (data.success) {
        fetchData()
      } else {
        setError(data.message || 'Failed to update invoice status')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const deleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    
    try {
      const token = localStorage.getItem('accessToken')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        fetchData()
      } else {
        setError(data.message || 'Failed to delete invoice')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }]
    })
  }

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setFormData({ ...formData, items: updatedItems })
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    const taxAmount = subtotal * (formData.tax_percentage / 100)
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGR', '₦')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-text">Sales & Invoices</h2>
          <p className="text-gray-600 mt-1">Create and manage your invoices</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          + Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Invoices</div>
          <div className="text-2xl font-bold">{invoices.length}</div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Paid Invoices</div>
          <div className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Outstanding</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(invoices.reduce((sum, i) => sum + i.balance, 0))}
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold">
            {formatCurrency(invoices.reduce((sum, i) => sum + i.paid_amount, 0))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices by number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Invoices Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text">Invoice #</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Issue Date</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Total Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Balance</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{invoice.invoice_number}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">{invoice.customer_name || 'Walk-in Customer'}</div>
                      {invoice.customer_email && (
                        <div className="text-sm text-gray-600">{invoice.customer_email}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatCurrency(invoice.total_amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${invoice.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatCurrency(invoice.balance)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => deleteInvoice(invoice.id)}
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
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'No invoices found matching your criteria.' 
                : 'No invoices yet. Create your first invoice to get started.'
              }
            </div>
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Invoice</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select Customer (Optional)</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.email && `(${customer.email})`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.tax_percentage}
                    onChange={(e) => setFormData({...formData, tax_percentage: parseFloat(e.target.value) || 0})}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Items
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="input-field"
                          min="1"
                          required
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="input-field"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="w-32 pt-2">
                        <div className="text-sm font-medium">
                          {formatCurrency(item.quantity * item.unit_price)}
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 mt-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({formData.tax_percentage}%):</span>
                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows={3}
                  placeholder="Payment terms or additional notes..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Create Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
