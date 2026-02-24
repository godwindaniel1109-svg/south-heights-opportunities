export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin';
  balance: number;
  currency: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Campaign {
  id: string;
  senderId: string;
  message: string;
  totalRecipients: number;
  scheduledAt?: string;
  status: 'draft' | 'queued' | 'sending' | 'completed' | 'failed' | 'cancelled';
  costPerSms: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  statistics?: {
    [key: string]: number;
  };
}

export interface SingleSmsData {
  senderId: string;
  recipient: string;
  message: string;
  scheduledAt?: string;
}

export interface CampaignData {
  senderId: string;
  message: string;
  recipients: string[] | string; // array of numbers or contact list ID
  scheduledAt?: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
  createdAt: string;
}

export interface PaymentData {
  amount: number;
  paymentMethod: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  data?: T;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
