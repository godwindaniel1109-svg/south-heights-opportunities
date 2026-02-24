export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Reminder {
  id: string;
  orderId: string;
  customerId: string;
  type: 'payment' | 'delivery' | 'followup';
  message: string;
  scheduledDate: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  paidOrders: number;
  deliveredOrders: number;
  averageOrderValue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  topCustomers: Customer[];
  recentOrders: Order[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  plan: 'starter' | 'pro' | 'business';
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month';
  features: string[];
  popular?: boolean;
}
