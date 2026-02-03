# 🤖 Telegram Bot Setup Guide - Complete

## 📋 **What the Telegram Bot Does**

Your Telegram bot:
- ✅ **Receives support messages** from users (via web app)
- ✅ **Sends notifications** to admin on Telegram
- ✅ **Allows admin to reply** directly from Telegram
- ✅ **Auto-acknowledges** user messages
- ✅ **Syncs with web app** support chat

---

## 🚀 **Step-by-Step Setup**

### **Step 1: Create Telegram Bot**

1. **Open Telegram app** (mobile or desktop)
2. **Search for**: `@BotFather`
3. **Start a chat** with BotFather
4. **Send command**: `/newbot`
5. **Follow prompts**:
   - Bot name: `Prime SMS Hub Support Bot` (or any name)
   - Bot username: `primesmshub_support_bot` (must end with `_bot`)
6. **BotFather will give you a token** like:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
7. **Copy this token** → This is your `TELEGRAM_BOT_TOKEN`

---

### **Step 2: Get Admin Chat ID**

You need your Telegram chat ID to receive notifications:

#### **Method 1: Using @userinfobot** (Easiest)
1. Search for `@userinfobot` on Telegram
2. Start a chat with it
3. It will show your **Chat ID** (a number like `123456789`)
4. Copy this number → This is your `TELEGRAM_ADMIN_CHAT_ID`

#### **Method 2: Using API** (Alternative)
1. Send a message to your bot
2. Visit this URL (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Look for `"chat":{"id":123456789}` in the response
4. Copy the ID number

---

### **Step 3: Generate Webhook Secret**

Generate a secure random string for webhook validation:

**Using Python:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**OR** use any secure random string (minimum 32 characters)

Copy the result → This is your `TELEGRAM_WEBHOOK_SECRET`

---

### **Step 4: Add Environment Variables to Vercel**

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these 3 variables:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789
TELEGRAM_WEBHOOK_SECRET=your-generated-secret-here
```

---

### **Step 5: Set Telegram Webhook**

After deploying your backend to Vercel, set the webhook URL:

#### **Option A: Using the Helper Script**

1. **Get your Vercel backend URL**: `https://your-backend.vercel.app`
2. **Run the script**:
   ```bash
   cd backend/tools
   python set_telegram_webhook.py YOUR_BOT_TOKEN https://your-backend.vercel.app/api/support/telegram/webhook/ YOUR_WEBHOOK_SECRET
   ```

#### **Option B: Using Browser/curl**

Visit this URL (replace values):
```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://your-backend.vercel.app/api/support/telegram/webhook/&secret_token=YOUR_WEBHOOK_SECRET
```

**Example:**
```
https://api.telegram.org/bot1234567890:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://prime-sms-hub-backend.vercel.app/api/support/telegram/webhook/&secret_token=your-secret-here
```

**Expected Response:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

---

### **Step 6: Test the Bot**

1. **Send a test message** from your web app support page
2. **Check your Telegram** - You should receive a notification
3. **Reply to the message** in Telegram
4. **Check web app** - Your reply should appear in the support chat

---

## 🔧 **How It Works**

### **User Sends Message (Web App → Telegram)**
1. User types message in `support.html`
2. Frontend sends to: `/api/support/` (POST)
3. Backend receives message
4. Backend calls `TelegramService.send_to_admin()`
5. Message appears in your Telegram chat

### **Admin Replies (Telegram → Web App)**
1. You reply to the message in Telegram
2. Telegram sends webhook to: `/api/support/telegram/webhook/`
3. Backend processes the reply
4. Backend saves message to database
5. Backend broadcasts via WebSocket
6. User sees reply in web app support chat

---

## 📋 **Environment Variables Summary**

Add these to **Vercel**:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789
TELEGRAM_WEBHOOK_SECRET=your-secure-random-string-here
```

---

## 🔗 **Webhook URL Format**

After deploying to Vercel, your webhook URL will be:
```
https://your-backend.vercel.app/api/support/telegram/webhook/
```

**Important:**
- Must be **HTTPS** (not HTTP)
- Must be **publicly accessible**
- Must include the **secret token** when setting webhook

---

## ✅ **Verification Checklist**

- [ ] Bot created with BotFather
- [ ] Bot token copied (`TELEGRAM_BOT_TOKEN`)
- [ ] Admin chat ID obtained (`TELEGRAM_ADMIN_CHAT_ID`)
- [ ] Webhook secret generated (`TELEGRAM_WEBHOOK_SECRET`)
- [ ] Environment variables added to Vercel
- [ ] Backend deployed to Vercel
- [ ] Webhook URL set in Telegram
- [ ] Test message sent from web app
- [ ] Message received in Telegram
- [ ] Reply sent from Telegram
- [ ] Reply appears in web app

---

## 🆘 **Troubleshooting**

### Bot not receiving messages?
- ✅ Check `TELEGRAM_BOT_TOKEN` is correct
- ✅ Check `TELEGRAM_ADMIN_CHAT_ID` is correct
- ✅ Verify webhook is set: `https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo`
- ✅ Check backend logs in Vercel

### Webhook not working?
- ✅ Verify webhook URL is HTTPS
- ✅ Check `TELEGRAM_WEBHOOK_SECRET` matches
- ✅ Verify backend is deployed and running
- ✅ Check Vercel function logs

### Messages not syncing?
- ✅ Check WebSocket connection in browser console
- ✅ Verify database is working
- ✅ Check backend logs for errors

---

## 📱 **Quick Test**

1. **Send test message** from web app support page
2. **Check Telegram** - Should receive notification like:
   ```
   🟢 Ticket #1
   👤 User: user@example.com (ID:123)
   📍 Page: support
   
   Hello, I need help!
   ```

3. **Reply in Telegram** - Type your response
4. **Check web app** - Reply should appear in support chat

---

## 🎯 **After Domain Setup (primesmshub.com)**

When you set up `primesmshub.com`:

1. **Update webhook URL**:
   ```
   https://api.primesmshub.com/api/support/telegram/webhook/
   ```

2. **Re-run webhook setup**:
   ```bash
   python backend/tools/set_telegram_webhook.py YOUR_BOT_TOKEN https://api.primesmshub.com/api/support/telegram/webhook/ YOUR_WEBHOOK_SECRET
   ```

---

## 📝 **Code Location**

- **Telegram Service**: `backend/api/services.py` (class `TelegramService`)
- **Webhook Handler**: `backend/api/views.py` (function `telegram_webhook`)
- **Webhook Setup Tool**: `backend/tools/set_telegram_webhook.py`

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
