# 🔧 Troubleshoot: "Failed to submit purchase request"

## ✅ Quick Checks

### 1. **Backend Server Running?**
Make sure backend is running on port 4000:
```powershell
cd backend
npm run dev
```
Look for: `Server running on port 4000`

---

### 2. **Check Browser Console**
Open browser DevTools (F12) → Console tab
Look for any red error messages

---

### 3. **Check Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Try submitting again
4. Look for `/api/submit-dwt-purchase` request
5. Check:
   - Status code (should be 200)
   - Response (should show `{ok: true}`)
   - Request payload (should have all fields)

---

## 🔍 Common Issues & Fixes

### **Issue 1: Backend Not Running**
**Error:** Network error, connection refused
**Fix:** Start backend server
```powershell
cd backend
npm run dev
```

---

### **Issue 2: Image Upload Failing**
**Error:** "Image upload failed - no URL returned"
**Fix:** 
- Check backend/uploads folder exists
- Check file size (max 25MB)
- Check image format (jpg, png, etc.)

---

### **Issue 3: Missing Required Fields**
**Error:** "Missing required fields"
**Fix:** Make sure all fields are filled:
- Name ✅
- Email ✅
- Phone ✅
- Amount ✅
- Image uploaded ✅

---

### **Issue 4: CORS Error**
**Error:** CORS policy blocked
**Fix:** Backend should have CORS enabled (already configured)

---

### **Issue 5: User Not Logged In**
**Error:** userId is undefined
**Fix:** Make sure you're logged in before submitting

---

## 🧪 Test Steps

1. **Open Browser Console (F12)**
2. **Fill the form:**
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Amount: 1
   - Upload image
3. **Click Submit**
4. **Watch Console:**
   - Should see: "Image uploaded: http://..."
   - Should see: "Submitting purchase: {...}"
   - Should see success or error message

---

## 📝 What to Check

### **In Browser Console:**
- Any red errors?
- Network requests failing?
- Image upload successful?

### **In Backend Terminal:**
- Any error messages?
- "Submit DWT purchase error" messages?
- Image file path issues?

---

## 🚨 Still Not Working?

1. **Check backend terminal** for error messages
2. **Check browser console** for detailed errors
3. **Try with a smaller image** (under 5MB)
4. **Make sure all fields are filled**
5. **Restart backend server**

---

## ✅ Expected Behavior

When working correctly:
1. Image uploads → Returns URL
2. Purchase data sent → Backend receives it
3. Submission saved → Returns `{ok: true}`
4. Success message shown → Form resets
5. Telegram bot receives notification (if configured)
