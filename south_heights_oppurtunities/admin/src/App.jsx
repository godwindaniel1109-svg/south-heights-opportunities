import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import ChatPage from './pages/Chat'
import AdminPage from './pages/AdminPage'
import { AuthProvider } from './context/AuthContext'

export default function App(){
  return (
    <AuthProvider>
      <Router>
        <AdminLayout />
      </Router>
    </AuthProvider>
  )
}

function AdminLayout() {
  const location = useLocation()
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar Navigation */}
      <nav style={{
        width: '250px',
        backgroundColor: '#1e3a5f',
        color: 'white',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '30px', textAlign: 'center' }}>
          🛡️ Admin
        </h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '15px' }}>
            <Link 
              to="/admin/users"
              style={{
                color: location.pathname === '/admin/users' ? '#ffd700' : 'white',
                textDecoration: 'none',
                display: 'block',
                padding: '10px 15px',
                borderRadius: '5px',
                backgroundColor: location.pathname === '/admin/users' ? 'rgba(255,215,0,0.2)' : 'transparent',
                fontWeight: location.pathname === '/admin/users' ? 'bold' : 'normal'
              }}
            >
              👥 Users
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link 
              to="/admin/submissions"
              style={{
                color: location.pathname === '/admin/submissions' ? '#ffd700' : 'white',
                textDecoration: 'none',
                display: 'block',
                padding: '10px 15px',
                borderRadius: '5px',
                backgroundColor: location.pathname === '/admin/submissions' ? 'rgba(255,215,0,0.2)' : 'transparent',
                fontWeight: location.pathname === '/admin/submissions' ? 'bold' : 'normal'
              }}
            >
              📋 Submissions
            </Link>
          </li>
          <li style={{ marginBottom: '15px' }}>
            <Link 
              to="/admin/chat"
              style={{
                color: location.pathname === '/admin/chat' ? '#ffd700' : 'white',
                textDecoration: 'none',
                display: 'block',
                padding: '10px 15px',
                borderRadius: '5px',
                backgroundColor: location.pathname === '/admin/chat' ? 'rgba(255,215,0,0.2)' : 'transparent',
                fontWeight: location.pathname === '/admin/chat' ? 'bold' : 'normal'
              }}
            >
              💬 Chat
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/users" replace />} />
          <Route path="/admin/users" element={<UsersPage/>} />
          <Route path="/admin/chat" element={<ChatPage/>} />
          <Route path="/admin/submissions" element={<AdminPage/>} />
        </Routes>
      </main>
    </div>
  )
}

