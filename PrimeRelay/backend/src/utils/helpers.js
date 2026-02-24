const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN = '15m';
const JWT_REFRESH_EXPIRES_IN = '7d';

function generateTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  
  return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'pk_';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateReference(prefix = 'TXN') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  // Nigerian phone number validation
  const phoneRegex = /^(?:\+234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function sanitizePhoneNumber(phone) {
  // Convert to international format
  const cleaned = phone.replace(/\s/g, '').replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.substring(1);
  }
  if (cleaned.startsWith('234') && !cleaned.startsWith('+')) {
    return '+' + cleaned;
  }
  return cleaned;
}

function formatCurrency(amount, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

function paginate(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return { limit: parseInt(limit), offset: parseInt(offset) };
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  generateApiKey,
  generateReference,
  validateEmail,
  validatePhone,
  sanitizePhoneNumber,
  formatCurrency,
  paginate
};
