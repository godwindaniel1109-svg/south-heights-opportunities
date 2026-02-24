import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './AdminPage.css'

const AdminPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [submissions, setSubmissions] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Load data from localStorage and API
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Try to fetch from API first
      try {
        const [subsRes, usersRes] = await Promise.all([
          fetch('/api/admin/submissions').catch(() => null),
          fetch('/api/admin/users').catch(() => null)
        ])
        
        if (subsRes?.ok) {
          const subsData = await subsRes.json()
          setSubmissions(subsData.submissions || [])
        } else {
          // Fallback to localStorage
          loadFromLocalStorage()
        }
        
        if (usersRes?.ok) {
          const usersData = await usersRes.json()
          setAllUsers(usersData.users || [])
        } else {
          loadUsersFromLocalStorage()
        }
      } catch (err) {
        loadFromLocalStorage()
        loadUsersFromLocalStorage()
      }
    } catch (err) {
      console.error('Error loading data:', err)
      loadFromLocalStorage()
      loadUsersFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  const loadFromLocalStorage = () => {
    // Load submissions from all users' localStorage
    const allSubmissions = []
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    users.forEach(u => {
      // DWT purchases
      if (u.dwtPurchases && Array.isArray(u.dwtPurchases)) {
        u.dwtPurchases.forEach(purchase => {
          allSubmissions.push({
            ...purchase,
            type: 'dwt-purchase',
            userId: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || 'N/A'
          })
        })
      }
    })
    
    setSubmissions(allSubmissions)
  }

  const loadUsersFromLocalStorage = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    setAllUsers(users)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Try API first
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(() => null)

      if (res?.ok) {
        const data = await res.json()
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
      } else {
        // Update in localStorage
        updateSubmissionInLocalStorage(id, newStatus)
      }
    } catch (err) {
      updateSubmissionInLocalStorage(id, newStatus)
    }
  }

  const updateSubmissionInLocalStorage = (id, newStatus) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    users.forEach(u => {
      if (u.dwtPurchases) {
        const purchase = u.dwtPurchases.find(p => p.id === id)
        if (purchase) {
          purchase.status = newStatus
          if (newStatus === 'approved') {
            u.dwtTokens = (u.dwtTokens || 0) + purchase.amount
          }
        }
      }
    })
    localStorage.setItem('users', JSON.stringify(users))
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
  }

  const handleUserAction = async (userId, action, value) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [action]: value })
      }).catch(() => null)

      if (!res?.ok) {
        // Update in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const userIndex = users.findIndex(u => u.id === userId)
        if (userIndex !== -1) {
          users[userIndex][action] = value
          localStorage.setItem('users', JSON.stringify(users))
          setAllUsers([...users])
        }
      } else {
        loadData()
      }
    } catch (err) {
      console.error('Error updating user:', err)
    }
  }

  // Calculate statistics
  const stats = {
    totalSubmissions: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    totalUsers: allUsers.length,
    activeUsers: allUsers.filter(u => !u.banned).length,
    totalRevenue: submissions
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + (s.price || 0), 0),
    dwtPurchases: submissions.filter(s => s.type === 'dwt-purchase').length,
    giftCards: submissions.filter(s => s.type === 'giftcard').length
  }

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = !searchTerm || 
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id?.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    const matchesType = typeFilter === 'all' || sub.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🛡️ Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.name || 'Admin'}</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          📝 Submissions ({stats.pending > 0 && <span className="badge">{stats.pending}</span>})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({stats.totalUsers})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
        <button 
          className={`admin-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat Moderation
        </button>
        <button 
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{stats.totalSubmissions}</h3>
                  <p>Total Submissions</p>
                </div>
              </div>
              <div className="stat-card warning">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.pending}</h3>
                  <p>Pending Review</p>
                </div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.approved}</h3>
                  <p>Approved</p>
                </div>
              </div>
              <div className="stat-card danger">
                <div className="stat-icon">❌</div>
                <div className="stat-info">
                  <h3>{stats.rejected}</h3>
                  <p>Rejected</p>
                </div>
              </div>
              <div className="stat-card info">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card success">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Submissions</h2>
              <div className="activity-list">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="activity-item">
                    <div className="activity-icon">
                      {sub.type === 'dwt-purchase' ? '🪙' : '🎁'}
                    </div>
                    <div className="activity-details">
                      <p><strong>{sub.name}</strong> - {sub.type === 'dwt-purchase' ? `${sub.amount} DWT` : `$${sub.amount}`}</p>
                      <span className="activity-time">{new Date(sub.timestamp || sub.createdAt).toLocaleString()}</span>
                    </div>
                    <div className={`activity-status ${sub.status}`}>
                      {sub.status}
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <p className="no-data">No submissions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="admin-submissions">
            {selectedSubmission ? (
              <div className="submission-detail-view">
                <button className="btn-back" onClick={() => setSelectedSubmission(null)}>
                  ← Back to List
                </button>
                
                <div className="detail-card">
                  <h2>
                    {selectedSubmission.type === 'dwt-purchase' ? '🪙 DWT Purchase Details' : '🎁 Gift Card Submission'}
                  </h2>
                  
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedSubmission.name || selectedSubmission.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedSubmission.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedSubmission.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>User ID:</label>
                      <span>{selectedSubmission.userId || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <label>{selectedSubmission.type === 'dwt-purchase' ? 'DWT Amount:' : 'Amount ($):'}</label>
                      <span>{selectedSubmission.amount}</span>
                    </div>
                    {selectedSubmission.type === 'dwt-purchase' && (
                      <div className="detail-item">
                        <label>Price:</label>
                        <span>${selectedSubmission.price?.toFixed(2) || '0.00'}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <label>Status:</label>
                      <select 
                        value={selectedSubmission.status || 'pending'}
                        onChange={(e) => {
                          const newStatus = e.target.value
                          handleStatusChange(selectedSubmission.id, newStatus)
                          setSelectedSubmission({ ...selectedSubmission, status: newStatus })
                        }}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="detail-item">
                      <label>Submitted:</label>
                      <span>{new Date(selectedSubmission.timestamp || selectedSubmission.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="image-section">
                    <h3>📷 Payment Proof Image</h3>
                    {selectedSubmission.image ? (
                      <div className="image-preview-large">
                        <img 
                          src={selectedSubmission.image.startsWith('http') 
                            ? selectedSubmission.image 
                            : selectedSubmission.image.startsWith('/uploads')
                            ? `http://localhost:4000${selectedSubmission.image}`
                            : selectedSubmission.image
                          } 
                          alt="Payment proof" 
                          onError={(e) => {
                            // Try base64 if URL fails
                            if (selectedSubmission.image && selectedSubmission.image.startsWith('data:')) {
                              e.target.src = selectedSubmission.image
                            }
                          }}
                        />
                        <a 
                          href={selectedSubmission.image.startsWith('http') 
                            ? selectedSubmission.image 
                            : selectedSubmission.image.startsWith('/uploads')
                            ? `http://localhost:4000${selectedSubmission.image}`
                            : selectedSubmission.image
                          } 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="view-full-btn"
                        >
                          🔍 View Full Size
                        </a>
                      </div>
                    ) : selectedSubmission.images && Array.isArray(selectedSubmission.images) ? (
                      <div className="image-grid">
                        {selectedSubmission.images.map((img, idx) => (
                          <div key={idx} className="image-container">
                            <img 
                              src={img.startsWith('http') ? img : img.startsWith('/uploads') ? `http://localhost:4000${img}` : img}
                              alt={`Proof ${idx + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-image">No image available</p>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button 
                      className="btn-approve"
                      onClick={() => {
                        handleStatusChange(selectedSubmission.id, 'approved')
                        setSelectedSubmission({ ...selectedSubmission, status: 'approved' })
                      }}
                      disabled={selectedSubmission.status === 'approved'}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => {
                        handleStatusChange(selectedSubmission.id, 'rejected')
                        setSelectedSubmission({ ...selectedSubmission, status: 'rejected' })
                      }}
                      disabled={selectedSubmission.status === 'rejected'}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="submissions-filters">
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select 
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Types</option>
                    <option value="dwt-purchase">DWT Purchase</option>
                    <option value="giftcard">Gift Card</option>
                  </select>
                </div>

                <div className="submissions-table-wrapper">
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="no-data">No submissions found</td>
                        </tr>
                      ) : (
                        filteredSubmissions.map(sub => (
                          <tr key={sub.id}>
                            <td>
                              <span className={`type-badge ${sub.type === 'dwt-purchase' ? 'dwt' : 'gift'}`}>
                                {sub.type === 'dwt-purchase' ? '🪙 DWT' : '🎁 Gift'}
                              </span>
                            </td>
                            <td>{sub.name || sub.fullName}</td>
                            <td>{sub.email}</td>
                            <td>
                              {sub.type === 'dwt-purchase' 
                                ? `${sub.amount} DWT ($${sub.price?.toFixed(2) || '0.00'})`
                                : `$${sub.amount}`
                              }
                            </td>
                            <td>
                              <span className={`status-badge ${sub.status}`}>
                                {sub.status || 'pending'}
                              </span>
                            </td>
                            <td>{new Date(sub.timestamp || sub.createdAt).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="btn-view"
                                onClick={() => setSelectedSubmission(sub)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users">
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Wallet</th>
                    <th>DWT Tokens</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">No users found</td>
                    </tr>
                  ) : (
                    allUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>${(u.walletBalance || 0).toFixed(2)}</td>
                        <td>{u.dwtTokens || 0}</td>
                        <td>
                          <span className={`status-badge ${u.banned ? 'rejected' : 'approved'}`}>
                            {u.banned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <span className={`role-badge ${u.email === 'admin@pennysavia.com' ? 'admin' : 'user'}`}>
                            {u.email === 'admin@pennysavia.com' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>
                          <div className="user-actions">
                            {!u.banned ? (
                              <button 
                                className="btn-ban"
                                onClick={() => handleUserAction(u.id, 'banned', true)}
                              >
                                🚫 Ban
                              </button>
                            ) : (
                              <button 
                                className="btn-unban"
                                onClick={() => handleUserAction(u.id, 'banned', false)}
                              >
                                ✅ Unban
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="admin-analytics">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Revenue Overview</h3>
                <div className="revenue-chart">
                  <div className="revenue-bar">
                    <div className="bar-label">Total Revenue</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${Math.min(100, (stats.totalRevenue / 10000) * 100)}%` }}
                      >
                        ${stats.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Submission Types</h3>
                <div className="type-stats">
                  <div className="type-stat-item">
                    <span className="type-icon">🪙</span>
                    <span className="type-label">DWT Purchases</span>
                    <span className="type-value">{stats.dwtPurchases}</span>
                  </div>
                  <div className="type-stat-item">
                    <span className="type-icon">🎁</span>
                    <span className="type-label">Gift Cards</span>
                    <span className="type-value">{stats.giftCards}</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Status Distribution</h3>
                <div className="status-stats">
                  <div className="status-stat-item">
                    <div className="status-color pending"></div>
                    <span>Pending: {stats.pending}</span>
                  </div>
                  <div className="status-stat-item">
                    <div className="status-color approved"></div>
                    <span>Approved: {stats.approved}</span>
                  </div>
                  <div className="status-stat-item">
                    <div className="status-color rejected"></div>
                    <span>Rejected: {stats.rejected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="admin-chat-moderation">
            <div className="chat-moderation-header">
              <h2>💬 Chat Moderation</h2>
              <p>Monitor and moderate community chat in real-time</p>
            </div>
            <div className="chat-moderation-content">
              <div className="moderation-info">
                <p>💡 <strong>Admin Chat Controls:</strong></p>
                <ul className="moderation-features">
                  <li>✅ Delete any message by clicking 🗑️ button</li>
                  <li>✅ Ban users from chat by clicking 🚫 button</li>
                  <li>✅ Monitor all conversations in real-time</li>
                  <li>✅ See admin badge on your messages</li>
                  <li>✅ Banned users cannot send messages</li>
                </ul>
                <a href="/dashboard/chat" className="go-to-chat-btn" target="_blank" rel="noopener noreferrer">
                  Open Chat Dashboard →
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-settings">
            <div className="settings-card">
              <h2>⚙️ Admin Settings</h2>
              <div className="settings-list">
                <div className="setting-item">
                  <label>Telegram Bot Token</label>
                  <input type="password" placeholder="Set in backend .env file" disabled />
                  <p className="setting-hint">Configure in backend environment variables</p>
                </div>
                <div className="setting-item">
                  <label>Admin Email</label>
                  <input type="email" value={user?.email || ''} disabled />
                  <p className="setting-hint">Admin email for authentication</p>
                </div>
                <div className="setting-item">
                  <label>Backend URL</label>
                  <input type="text" placeholder="http://localhost:4000" />
                  <p className="setting-hint">Backend API endpoint URL</p>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h2>🛡️ Admin Powers</h2>
              <div className="admin-powers-list">
                <div className="power-item">
                  <span className="power-icon">✅</span>
                  <div className="power-info">
                    <h3>Approve/Reject Submissions</h3>
                    <p>Full control over DWT purchases and gift card submissions</p>
                  </div>
                </div>
                <div className="power-item">
                  <span className="power-icon">👥</span>
                  <div className="power-info">
                    <h3>User Management</h3>
                    <p>Ban/unban users, view all user data, manage accounts</p>
                  </div>
                </div>
                <div className="power-item">
                  <span className="power-icon">💬</span>
                  <div className="power-info">
                    <h3>Chat Moderation</h3>
                    <p>Delete messages, ban users from chat, monitor conversations</p>
                  </div>
                </div>
                <div className="power-item">
                  <span className="power-icon">📊</span>
                  <div className="power-info">
                    <h3>Analytics & Reports</h3>
                    <p>View revenue, user statistics, submission analytics</p>
                  </div>
                </div>
                <div className="power-item">
                  <span className="power-icon">🖼️</span>
                  <div className="power-info">
                    <h3>View All Images</h3>
                    <p>Access payment proof images, verify submissions</p>
                  </div>
                </div>
                <div className="power-item">
                  <span className="power-icon">🚫</span>
                  <div className="power-info">
                    <h3>Prevent Crime</h3>
                    <p>Ban suspicious users, delete inappropriate content, monitor activity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
