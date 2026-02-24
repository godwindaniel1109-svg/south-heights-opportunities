# 🔧 Telegram Webhook Setup - Fix Approve/Reject Buttons

## 🐛 Problem
Approve/Reject buttons in Telegram bot are not working because the webhook is not configured.

## ✅ Solution

### **Step 1: Set Up Webhook**

You need to tell Telegram where to send button clicks. There are 2 ways:

#### **Option A: Use the Setup Endpoint (Recommended)**

1. **Make sure your backend is running** on a public URL (or use ngrok for local testing)

2. **Call the setup endpoint:**
   ```bash
   # If backend is on localhost, use ngrok first (see below)
   # If backend is deployed, use your deployed URL
   
   POST http://your-backend-url/api/telegram/setup-webhook
   ```

3. **Or use curl:**
   ```bash
   curl -X POST http://localhost:4000/api/telegram/setup-webhook \
     -H "Content-Type: application/json" \
     -d '{"webhookUrl": "https://your-deployed-backend.com/api/telegram/webhook"}'
   ```

#### **Option B: Manual Setup (Using Telegram API)**

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-backend-url.com/api/telegram/webhook"}'
```

---

## 🧪 For Local Testing (Using ngrok)

### **Step 1: Install ngrok**
Download from: https://ngrok.com/download

### **Step 2: Start ngrok**
```bash
ngrok http 4000
```

This will give you a URL like: `https://abc123.ngrok.io`

### **Step 3: Set Webhook**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://abc123.ngrok.io/api/telegram/webhook"}'
```

### **Step 4: Verify**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

---

## ✅ Verify Webhook is Working

### **Check Webhook Info:**
```bash
GET http://localhost:4000/api/telegram/webhook-info
```

You should see:
```json
{
  "ok": true,
  "webhookInfo": {
    "url": "https://your-url.com/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

---

## 🔍 Test the Buttons

1. **Submit a DWT purchase** from the app
2. **Check Telegram bot** - you should see:
   - Message with user info
   - Image (payment proof)
   - **Approve** and **Reject** buttons

3. **Click a button** - it should:
   - Show a confirmation
   - Update the submission status
   - Send a confirmation message

---

## 🚨 Troubleshooting

### **Buttons Not Showing?**
- Check if `sendTelegramWithButtons` is being called
- Check backend logs for errors
- Verify BOT_TOKEN and CHAT_ID are set

### **Buttons Not Working?**
- Webhook not configured - set it up using steps above
- Check webhook URL is accessible
- Check backend logs for webhook requests

### **Webhook Not Receiving Requests?**
- Make sure webhook URL is publicly accessible
- Use ngrok for local testing
- Check firewall/security settings

---

## 📝 Quick Setup Script

Create a file `setup-webhook.js`:

```javascript
const axios = require('axios')
require('dotenv').config()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-backend.com/api/telegram/webhook'

async function setupWebhook() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL
    })
    console.log('✅ Webhook set:', response.data)
    
    const info = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`)
    console.log('📋 Webhook info:', info.data.result)
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

setupWebhook()
```

Run: `node setup-webhook.js`

---

## ✅ After Setup

Once webhook is configured:
- ✅ Buttons will work
- ✅ Approve/Reject will update status
- ✅ You'll see confirmations in Telegram
- ✅ Backend will log all button clicks
