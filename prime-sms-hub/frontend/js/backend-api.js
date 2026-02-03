/**
 * Backend API Service
 * Handles all API calls to Django backend
 */

// API base determination: meta tag > global var > same origin
const metaApi = document.querySelector('meta[name="api-base"]')?.getAttribute('content') || '';
const API_BASE_URL = (window.API_BASE_URL && window.API_BASE_URL.length) ? window.API_BASE_URL : (metaApi.length ? metaApi.replace(/\/$/, '') : (window.location.origin)) + '/api';

class BackendAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Get headers with auth token
    getHeaders(includeAuth = true, isFormData = false) {
        const headers = {
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        if (includeAuth && this.token) {
            headers['Authorization'] = `Token ${this.token}`;
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: options.headers || this.getHeaders()
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized - redirect to login
                    localStorage.removeItem('authToken');
                    window.location.href = '/login.html';
                }
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Health check
    async health() {
        return this.request('/health/');
    }

    // Get Firebase config
    async getFirebaseConfig() {
        return this.request('/firebase-config/', { headers: this.getHeaders(false) });
    }

    // === USER ENDPOINTS ===

    async getCurrentUser() {
        return this.request('/users/me/');
    }

    async logout() {
        return this.request('/users/logout/', { method: 'POST' });
    }

    // === TRANSACTION ENDPOINTS ===

    async getTransactions() {
        return this.request('/transactions/');
    }

    async verifyPayment(reference) {
        return this.request('/transactions/verify_payment/', {
            method: 'POST',
            body: JSON.stringify({ reference })
        });
    }

    // === PHONE NUMBER ENDPOINTS ===

    async getPhoneNumbers() {
        return this.request('/phone-numbers/');
    }

    async getAvailableNumbers() {
        return this.request('/phone-numbers/available_numbers/');
    }

    async buyPhoneNumber(country, service, amount) {
        return this.request('/phone-numbers/buy_number/', {
            method: 'POST',
            body: JSON.stringify({ country, service, amount })
        });
    }

    // === WALLET ENDPOINTS ===

    async getWalletBalance() {
        return this.request('/wallet/balance/');
    }

    async addFunds(amount) {
        return this.request('/wallet/add_funds/', {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
    }

    async uploadProof(amount, file, reference) {
        const url = `${this.baseURL}/wallet/upload_proof/`;
        const formData = new FormData();
        formData.append('amount', amount);
        if (file) {
            formData.append('proof', file);
        }
        if (reference) {
            formData.append('reference', reference);
        }

        const config = {
            method: 'POST',
            headers: this.getHeaders(true, true),
            body: formData
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // === NOTIFICATIONS ===

    async getNotifications(params = {}) {
        const q = new URLSearchParams(params).toString();
        return this.request(`/notifications/${q ? ('?' + q) : ''}`);
    }

    // === SUPPORT CHAT ===

    async getConversations(params = {}) {
        const q = new URLSearchParams(params).toString();
        return this.request(`/support/${q ? ('?' + q) : ''}`);
    }

    async exportConversations(params = {}) {
        const q = new URLSearchParams(params).toString();
        const url = `${this.baseURL}/support/export/${q ? ('?' + q) : ''}`;
        const res = await fetch(url, { headers: this.getHeaders() });
        if (!res.ok) throw new Error(`Export failed: ${res.status}`);
        const blob = await res.blob();
        return blob;
    }

    async createConversation(message, page = 'support') {
        return this.request('/support/', { method: 'POST', body: JSON.stringify({ message, page }) });
    }

    async getConversationMessages(conversationId) { return this.request(`/support/${conversationId}/messages/`); }

    async postConversationMessage(conversationId, content) { return this.request(`/support/${conversationId}/post_message/`, { method: 'POST', body: JSON.stringify({ content }) }); }

    async getUnreadCount() {
        return this.request('/notifications/unread_count/');
    }

    async markNotificationRead(id) {
        return this.request(`/notifications/${id}/mark_read/`, { method: 'POST' });
    }

    async markAllNotificationsRead() {
        return this.request('/notifications/mark_all_read/', { method: 'POST' });
    }

    async sendNotification(payload) {
        return this.request('/notifications/', { method: 'POST', body: JSON.stringify(payload) });
    }
}

// Export API instance
const api = new BackendAPI();

// Check if backend is available
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await api.health();
        console.log('%c✅ Backend connected', 'color: green; font-weight: bold;');
    } catch (error) {
        console.warn('%c⚠️ Backend not available', 'color: orange;');
    }
});
