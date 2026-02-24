import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ChatHome from './ChatHome'
import ChatConversation from './ChatConversation'
import './PageContent.css'

export default function Chat(){
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState(null)

  if (!user) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h2>💬 Messages</h2>
          <p>Please login to use chat</p>
        </div>
      </div>
    )
  }

  if (selectedUser) {
    return (
      <ChatConversation 
        selectedUser={selectedUser} 
        onBack={() => setSelectedUser(null)} 
      />
    )
  }

  return <ChatHome onSelectUser={setSelectedUser} />
}
