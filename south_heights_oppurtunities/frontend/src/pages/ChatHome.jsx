import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { io } from 'socket.io-client'
import './ChatHome.css'

let socket = null

export default function ChatHome({ onSelectUser }) {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!user) return

    // Connect to Socket.IO
    socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
      reconnection: true
    })

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('userOnline', { 
        userId: user.id, 
        userName: user.name || user.email,
        email: user.email
      })
    })

    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users)
    })

    socket.on('usersList', (users) => {
      setAllUsers(users)
    })

    socket.on('conversationUpdate', (conv) => {
      setConversations(prev => {
        const existing = prev.find(c => c.id === conv.id)
        if (existing) {
          return prev.map(c => c.id === conv.id ? conv : c)
        }
        return [...prev, conv]
      })
    })

    // Fetch all users
    fetch('http://localhost:4000/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) setAllUsers(data.users)
      })
      .catch(console.error)

    // Fetch conversations
    fetch(`http://localhost:4000/api/conversations?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.conversations) setConversations(data.conversations)
      })
      .catch(console.error)

    return () => {
      if (socket) {
        socket.emit('userOffline', { userId: user.id })
        socket.disconnect()
      }
    }
  }, [user])

  const isUserOnline = (userId) => {
    return onlineUsers.some(u => u.id === userId)
  }

  const getLastMessage = (userId) => {
    const conv = conversations.find(c => 
      (c.user1 === user.id && c.user2 === userId) || 
      (c.user2 === user.id && c.user1 === userId)
    )
    return conv?.lastMessage || null
  }

  const getUnreadCount = (userId) => {
    const conv = conversations.find(c => 
      (c.user1 === user.id && c.user2 === userId) || 
      (c.user2 === user.id && c.user1 === userId)
    )
    return conv?.unreadCount || 0
  }

  const filteredUsers = allUsers.filter(u => {
    if (u.id === user.id) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (u.userName?.toLowerCase().includes(query) || 
              u.email?.toLowerCase().includes(query))
    }
    return true
  })

  // Sort: online users first, then by last message time
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aOnline = isUserOnline(a.id)
    const bOnline = isUserOnline(b.id)
    if (aOnline && !bOnline) return -1
    if (!aOnline && bOnline) return 1
    
    const aLastMsg = getLastMessage(a.id)
    const bLastMsg = getLastMessage(b.id)
    if (aLastMsg && !bLastMsg) return -1
    if (!aLastMsg && bLastMsg) return 1
    if (aLastMsg && bLastMsg) {
      return new Date(bLastMsg.timestamp) - new Date(aLastMsg.timestamp)
    }
    return 0
  })

  return (
    <div className="chat-home">
      <div className="chat-home-header">
        <h2>💬 Messages</h2>
        {isConnected && <span className="online-indicator">🟢 Online</span>}
      </div>

      <div className="chat-search">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-list">
        {sortedUsers.length === 0 ? (
          <div className="empty-state">
            <p>No users found</p>
          </div>
        ) : (
          sortedUsers.map(u => {
            const lastMsg = getLastMessage(u.id)
            const unread = getUnreadCount(u.id)
            const online = isUserOnline(u.id)

            return (
              <div
                key={u.id}
                className="user-item"
                onClick={() => onSelectUser(u)}
              >
                <div className="user-avatar-container">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.userName} className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {u.userName?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {online && <span className="online-dot"></span>}
                </div>
                
                <div className="user-info">
                  <div className="user-name-row">
                    <span className="user-name">{u.userName || u.email}</span>
                    {lastMsg && (
                      <span className="last-message-time">
                        {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div className="user-preview-row">
                    {lastMsg ? (
                      <span className="last-message-preview">
                        {lastMsg.type === 'image' ? '📷 Image' : 
                         lastMsg.type === 'file' ? '📎 File' : 
                         lastMsg.text}
                      </span>
                    ) : (
                      <span className="no-messages">No messages yet</span>
                    )}
                    {unread > 0 && (
                      <span className="unread-badge">{unread}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
