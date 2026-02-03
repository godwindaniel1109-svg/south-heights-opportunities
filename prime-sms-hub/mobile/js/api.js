// ========================================
// Mobile App - Backend API Integration
// Fetches real data from Django backend
// Falls back to mock data if offline/error
// ========================================

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000'
  : 'https://your-backend-domain.com';

class MobileAPI {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.baseURL = API_BASE;
  }

  // Helper to make authenticated requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed (${endpoint}):`, error);
      return null; // Return null for fallback to mock data
    }
  }

  // ==================== USER API ====================

  async getCurrentUser() {
    return await this.request('/api/users/me/');
  }

  async getWallet() {
    return await this.request('/api/wallet/');
  }

  async addFunds(amount, method = 'paystack') {
    return await this.request('/api/transactions/', {
      method: 'POST',
      body: JSON.stringify({
        transaction_type: 'fund',
        amount: amount,
        description: `Add funds via ${method}`
      })
    });
  }

  async getPhoneNumbers() {
    return await this.request('/api/phone-numbers/');
  }

  async buyPhoneNumber(country, service) {
    return await this.request('/api/phone-numbers/', {
      method: 'POST',
      body: JSON.stringify({
        country: country,
        service: service
      })
    });
  }

  async getTransactions(limit = 50) {
    return await this.request(`/api/transactions/?limit=${limit}`);
  }

  async getSMSMessages(numberId) {
    return await this.request(`/api/phone-numbers/${numberId}/messages/`);
  }

  // ==================== SUPPORT API ====================

  async getSupport() {
    return await this.request('/api/support/');
  }

  async createSupportMessage(content) {
    return await this.request('/api/support/', {
      method: 'POST',
      body: JSON.stringify({
        content: content,
        page: 'mobile'
      })
    });
  }

  // ==================== ADMIN API ====================

  async adminLogin(email, password) {
    const response = await this.request('/api/auth/admin/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response && response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('adminRole', 'admin');
    }
    
    return response;
  }

  async getUsers(search = '', limit = 50) {
    let url = `/api/users/?limit=${limit}`;
    if (search) url += `&search=${search}`;
    return await this.request(url);
  }

  async updateUser(userId, data) {
    return await this.request(`/api/users/${userId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async getTransactionsPending() {
    return await this.request('/api/transactions/?status=pending&limit=50');
  }

  async approveTransaction(transactionId) {
    const result = await this.request(`/api/transactions/${transactionId}/approve/`, {
      method: 'POST'
    });
    return !!result;
  }

  async rejectTransaction(transactionId) {
    const result = await this.request(`/api/transactions/${transactionId}/reject/`, {
      method: 'POST'
    });
    return !!result;
  }

  async deleteUser(userId) {
    const result = await this.request(`/api/users/${userId}/`, {
      method: 'DELETE'
    });
    return result === null || !!result;
  }

  async getSupportConversations(limit = 50) {
    return await this.request(`/api/support/?limit=${limit}`);
  }

  async getSupportMessages(conversationId) {
    return await this.request(`/api/support/${conversationId}/messages/`);
  }

  async replySupportMessage(conversationId, content) {
    return await this.request(`/api/support/${conversationId}/messages/`, {
      method: 'POST',
      body: JSON.stringify({
        content: content,
        sender: 'admin'
      })
    });
  }

  async getAdminStats() {
    return await this.request('/api/admin/stats/');
  }

  // ==================== AUTH ====================

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminRole');
    this.token = null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  isAdmin() {
    return localStorage.getItem('adminRole') === 'admin';
  }
}

// Create global API instance
window.api = new MobileAPI();
