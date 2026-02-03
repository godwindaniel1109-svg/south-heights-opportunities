// ========================================
// Mock Data - Used as fallback when offline
// ========================================

const MOCK_DATA = {
  user: {
    id: 1,
    email: 'user@example.com',
    username: 'user',
    created_at: new Date().toISOString()
  },
  
  wallet: {
    balance: 5000, // in kobo = ₦50.00
    currency: 'NGN',
    user: 1
  },

  numbers: [
    {
      id: 1,
      phone_number: '+1234567890',
      country: 'USA',
      service: '5sim',
      status: 'active',
      expires_at: new Date(Date.now() + 20*60000).toISOString(),
      price: 100,
      created_at: new Date().toISOString(),
      messages: [
        { id: 1, sender: 'Instagram', content: 'Your code is 123456', received_at: new Date().toISOString() },
        { id: 2, sender: 'Google', content: 'Your verification code is 789012', received_at: new Date().toISOString() }
      ]
    },
    {
      id: 2,
      phone_number: '+447123456789',
      country: 'UK',
      service: '5sim',
      status: 'active',
      expires_at: new Date(Date.now() + 45*60000).toISOString(),
      price: 150,
      created_at: new Date().toISOString(),
      messages: [
        { id: 3, sender: 'WhatsApp', content: 'Your code is 345678', received_at: new Date().toISOString() }
      ]
    }
  ],

  transactions: [
    {
      id: 1,
      transaction_type: 'purchase',
      amount: 15000,
      status: 'completed',
      description: 'Buy USA number',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 2,
      transaction_type: 'fund',
      amount: 50000,
      status: 'completed',
      description: 'Add funds via Paystack',
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 3,
      transaction_type: 'purchase',
      amount: 10000,
      status: 'completed',
      description: 'Buy UK number',
      created_at: new Date(Date.now() - 259200000).toISOString()
    }
  ],

  support: {
    conversations: [
      {
        id: 1,
        user: 'user@example.com',
        page: 'mobile',
        status: 'open',
        last_message_time: new Date().toISOString(),
        created_at: new Date().toISOString(),
        messages: [
          { id: 1, sender: 'user', content: 'How do I buy a number?', created_at: new Date().toISOString() },
          { id: 2, sender: 'admin', content: 'Click the "Buy Number" button and select your country', created_at: new Date().toISOString() }
        ]
      }
    ]
  },

  admin: {
    stats: {
      total_users: 42,
      active_users_30d: 28,
      total_transactions: 156,
      total_revenue: 2500000, // in kobo
      pending_payments: 5,
      failed_transactions: 2
    },
    users: [
      { id: 1, email: 'user1@example.com', username: 'user1', status: 'active', balance: 50000, created_at: new Date().toISOString() },
      { id: 2, email: 'user2@example.com', username: 'user2', status: 'active', balance: 125000, created_at: new Date().toISOString() },
      { id: 3, email: 'user3@example.com', username: 'user3', status: 'suspended', balance: 0, created_at: new Date().toISOString() }
    ],
    pending_payments: [
      { id: 1, user_email: 'user1@example.com', amount: 50000, status: 'pending', created_at: new Date().toISOString() }
    ],
    support_conversations: [
      {
        id: 1,
        user: 'user@example.com',
        status: 'open',
        messages: [
          { id: 1, sender: 'user', content: 'Issue with number expiry', created_at: new Date().toISOString() }
        ]
      }
    ]
  }
};

// Helper to get mock data with fallback
function getMockData(key) {
  const keys = key.split('.');
  let data = MOCK_DATA;
  for (const k of keys) {
    data = data[k];
    if (!data) return null;
  }
  return data;
}
