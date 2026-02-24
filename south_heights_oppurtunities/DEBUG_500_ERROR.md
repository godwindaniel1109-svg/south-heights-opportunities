# 🔍 Debug 500 Error - Step by Step

## ✅ What I Fixed

1. **Price/Amount Type Conversion**
   - Ensured `price` and `amount` are converted to numbers
   - Added validation to check if they're valid numbers
   - Prevents `toFixed()` errors on strings

2. **Better Error Logging**
   - Logs full error details
   - Logs request body
   - Logs stack trace

---

## 🔍 How to Debug

### **Step 1: Check Backend Terminal**

Look at your backend terminal (where you ran `npm run dev`) and look for:

```
Received DWT purchase request: { ... }
```

Then look for any of these errors:
- `Missing required fields: ...`
- `Invalid price or amount: ...`
- `Submit DWT purchase error: ...`
- `Error details: ...`
- `Request body: ...`

### **Step 2: Check What Error You See**

The backend should now log:
- What data it received
- Where it's failing
- Full error message and stack trace

---

## 🚨 Common Causes

### **1. Price/Amount Not a Number**
**Error:** `price.toFixed is not a function`
**Fix:** ✅ Now converts to number first

### **2. Missing Fields**
**Error:** `Missing required fields`
**Fix:** Check all fields are filled

### **3. Image Upload Failed**
**Error:** `Image upload failed`
**Fix:** Check file size and format

### **4. Telegram API Error**
**Error:** `Telegram notification error`
**Fix:** Submission still works, Telegram is optional

---

## 📝 What to Do

1. **Restart Backend:**
   ```powershell
   # Stop backend (Ctrl+C)
   cd backend
   npm run dev
   ```

2. **Try Submitting Again**

3. **Check Backend Terminal** for the exact error:
   - Copy the error message
   - Look for "Error details:" line
   - Look for "Request body:" line

4. **Share the Error:**
   - Copy the error from backend terminal
   - Share it so I can fix the exact issue

---

## 🎯 Expected Logs

When working correctly, you should see:
```
Received DWT purchase request: { name: '...', email: '...', ... }
File uploaded: filename.jpg Size: 12345
File URL: http://localhost:4000/uploads/filename.jpg
✅ Image sent to Telegram successfully (if Telegram configured)
```

If there's an error, you'll see:
```
Submit DWT purchase error: [error message]
Error details: [details]
Request body: { ... }
```

---

## ✅ Next Steps

1. **Restart backend**
2. **Try submitting again**
3. **Check backend terminal for the exact error**
4. **Share the error message** so I can fix it

The improved error logging will show exactly what's wrong!
