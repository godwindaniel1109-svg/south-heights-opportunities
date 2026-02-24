const { verifyAccessToken } = require('../utils/helpers');
const { query } = require('../database/connection');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    
    // Fetch user from database
    const result = await query(
      'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

async function apiKeyAuth(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    // Fetch API key from database
    const result = await query(
      `SELECT ak.*, u.email, u.role 
       FROM api_keys ak 
       JOIN users u ON ak.user_id = u.id 
       WHERE ak.api_key = $1 AND ak.is_active = true AND u.is_active = true`,
      [apiKey]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const keyData = result.rows[0];
    
    // Update last used timestamp
    await query(
      'UPDATE api_keys SET last_used_at = NOW() WHERE id = $1',
      [keyData.id]
    );

    req.apiKey = keyData;
    req.user = {
      id: keyData.user_id,
      email: keyData.email,
      role: keyData.role
    };
    
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = {
  authenticate,
  requireAdmin,
  apiKeyAuth
};
