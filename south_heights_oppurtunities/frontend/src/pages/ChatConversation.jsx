import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { io } from 'socket.io-client'
import './ChatConversation.css'

let socket = null
let typingTimeout = null

export default function ChatConversation({ selectedUser, onBack }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const conversationId = useRef(null)

  useEffect(() => {
    if (!user || !selectedUser) return

    // Connect to Socket.IO
    socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
      reconnection: true
    })

    socket.on('connect', () => {
      // Create or get conversation ID
      const convId = `conv_${[user.id, selectedUser.id].sort().join('_')}`
      conversationId.current = convId
      
      socket.emit('joinConversation', {
        conversationId: convId,
        userId: user.id,
        otherUserId: selectedUser.id
      })
    })

    socket.on('conversationMessages', (data) => {
      if (data.conversationId === conversationId.current) {
        setMessages(data.messages || [])
        scrollToBottom()
      }
    })

    socket.on('newMessage', (msg) => {
      if (msg.conversationId === conversationId.current) {
        setMessages(prev => [...prev, msg])
        scrollToBottom()
        
        // Mark as read
        socket.emit('markAsRead', {
          conversationId: conversationId.current,
          messageId: msg.id,
          userId: user.id
        })
      }
    })

    socket.on('messageRead', (data) => {
      if (data.conversationId === conversationId.current) {
        setMessages(prev => prev.map(m => 
          m.id === data.messageId ? { ...m, read: true, readAt: data.readAt } : m
        ))
      }
    })

    socket.on('typing', (data) => {
      if (data.userId === selectedUser.id && data.conversationId === conversationId.current) {
        setOtherUserTyping(true)
        setTimeout(() => setOtherUserTyping(false), 3000)
      }
    })

    socket.on('stopTyping', (data) => {
      if (data.userId === selectedUser.id && data.conversationId === conversationId.current) {
        setOtherUserTyping(false)
      }
    })

    // Load conversation messages
    const convId = `conv_${[user.id, selectedUser.id].sort().join('_')}`
    fetch(`http://localhost:4000/api/conversations/${convId}/messages`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages)
          scrollToBottom()
        }
      })
      .catch(console.error)

    return () => {
      if (socket && conversationId.current) {
        socket.emit('leaveConversation', {
          conversationId: conversationId.current,
          userId: user.id
        })
        socket.disconnect()
      }
    }
  }, [user, selectedUser])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTyping = () => {
    if (!socket || !conversationId.current) return

    socket.emit('typing', {
      conversationId: conversationId.current,
      userId: user.id
    })

    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', {
        conversationId: conversationId.current,
        userId: user.id
      })
    }, 1000)
  }

  const sendMessage = async () => {
    if (!text.trim() || !socket || !conversationId.current || sending) return

    const messageText = text.trim()
    setText('')
    setSending(true)

    const tempId = `temp_${Date.now()}`
    const newMessage = {
      id: tempId,
      conversationId: conversationId.current,
      senderId: user.id,
      receiverId: selectedUser.id,
      text: messageText,
      type: 'text',
      status: 'sending',
      timestamp: new Date().toISOString()
    }

    // Optimistic update
    setMessages(prev => [...prev, newMessage])
    scrollToBottom()

    try {
      socket.emit('sendMessage', {
        conversationId: conversationId.current,
        senderId: user.id,
        receiverId: selectedUser.id,
        text: messageText,
        type: 'text'
      })

      // Update status to sent
      setMessages(prev => prev.map(m => 
        m.id === tempId ? { ...m, status: 'sent', id: Date.now().toString() } : m
      ))
    } catch (err) {
      console.error('Error sending message:', err)
      setMessages(prev => prev.filter(m => m.id !== tempId))
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const sendFile = async (file) => {
    if (!socket || !conversationId.current || sending) return

    setSending(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadRes.json()
      if (!uploadData.url) throw new Error('Upload failed')

      const tempId = `temp_${Date.now()}`
      const newMessage = {
        id: tempId,
        conversationId: conversationId.current,
        senderId: user.id,
        receiverId: selectedUser.id,
        url: uploadData.url,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileName: file.name,
        status: 'sending',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, newMessage])
      scrollToBottom()

      socket.emit('sendMessage', {
        conversationId: conversationId.current,
        senderId: user.id,
        receiverId: selectedUser.id,
        url: uploadData.url,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileName: file.name
      })

      setMessages(prev => prev.map(m => 
        m.id === tempId ? { ...m, status: 'sent', id: Date.now().toString() } : m
      ))
    } catch (err) {
      console.error('Error sending file:', err)
      alert('Failed to send file. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    } else {
      handleTyping()
    }
  }

  const getMessageStatus = (msg) => {
    if (msg.status === 'sending') return '⏳'
    if (msg.read) return '✓✓'
    if (msg.status === 'sent') return '✓'
    return ''
  }

  return (
    <div className="chat-conversation">
      <div className="conversation-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <div className="conversation-user-info">
          {selectedUser.avatar ? (
            <img src={selectedUser.avatar} alt={selectedUser.userName} className="conversation-avatar" />
          ) : (
            <div className="conversation-avatar-placeholder">
              {selectedUser.userName?.[0]?.toUpperCase() || selectedUser.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <div className="conversation-user-name">{selectedUser.userName || selectedUser.email}</div>
            <div className="conversation-user-status">
              {otherUserTyping ? 'typing...' : 'online'}
            </div>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-conversation">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map(msg => {
              const isOwn = msg.senderId === user.id
              return (
                <div key={msg.id} className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
                  {msg.type === 'image' ? (
                    <img src={msg.url} alt="Shared" className="message-image" />
                  ) : msg.type === 'file' ? (
                    <div className="message-file">
                      <span>📎 {msg.fileName}</span>
                      <a href={msg.url} download>Download</a>
                    </div>
                  ) : (
                    <div className="message-text">{msg.text}</div>
                  )}
                  <div className="message-footer">
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isOwn && (
                      <span className="message-status">{getMessageStatus(msg)}</span>
                    )}
                  </div>
                </div>
              )
            })}
            {otherUserTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="message-input-container">
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files[0]) sendFile(e.target.files[0])
          }}
        />
        <button 
          className="attach-button"
          onClick={() => document.getElementById('file-input').click()}
          disabled={sending}
        >
          📎
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            handleTyping()
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="message-input"
          disabled={sending}
        />
        <button 
          onClick={sendMessage}
          className="send-button"
          disabled={!text.trim() || sending}
        >
          {sending ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}
