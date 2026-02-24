export interface User {
  id: string
  company_id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  role: 'admin' | 'manager' | 'staff'
  is_active: boolean
  last_login?: Date
  created_at: Date
  updated_at: Date
}

export interface Company {
  id: string
  name: string
  email: string
  phone?: string
  currency: string
  timezone: string
  subscription_plan: 'starter' | 'growth' | 'enterprise'
  subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
  subscription_expires_at?: Date
  created_at: Date
  updated_at: Date
}

export interface Customer {
  id: string
  company_id: string
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  outstanding_balance: number
  total_purchases: number
  is_vip: boolean
  created_at: Date
  updated_at: Date
}

export interface Invoice {
  id: string
  company_id: string
  customer_id?: string
  invoice_number: string
  issue_date: Date
  due_date?: Date
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  subtotal: number
  tax_amount: number
  tax_percentage: number
  total_amount: number
  paid_amount: number
  balance: number
  notes?: string
  created_by?: string
  created_at: Date
  updated_at: Date
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id?: string
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

export interface Payment {
  id: string
  company_id: string
  invoice_id?: string
  customer_id?: string
  amount: number
  payment_method: 'cash' | 'transfer' | 'pos' | 'card'
  payment_date: Date
  reference_number?: string
  notes?: string
  created_by?: string
  created_at: Date
}

export interface Expense {
  id: string
  company_id: string
  description: string
  amount: number
  category: string
  expense_date: Date
  receipt_number?: string
  notes?: string
  created_by?: string
  created_at: Date
  updated_at: Date
}

export interface Task {
  id: string
  company_id: string
  title: string
  description?: string
  assigned_to?: string
  created_by?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: Date
  completed_at?: Date
  created_at: Date
  updated_at: Date
}

export interface ActivityLog {
  id: string
  company_id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id?: string
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  created_at: Date
}

export interface AuthPayload {
  userId: string
  companyId: string
  email: string
  role: string
}

export interface CreateCompanyRequest {
  name: string
  email: string
  phone?: string
  currency?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  role?: 'admin' | 'manager' | 'staff'
}

export interface LoginRequest {
  email: string
  password: string
}
