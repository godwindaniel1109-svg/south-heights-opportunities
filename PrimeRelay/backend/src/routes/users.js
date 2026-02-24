const express = require('express');
const { query } = require('../database/connection');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at,
              w.balance, w.currency
       FROM users u
       LEFT JOIN wallets w ON u.id = w.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      balance: parseFloat(user.balance),
      currency: user.currency,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get wallet balance
router.get('/wallet', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT balance, currency, updated_at FROM wallets WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const wallet = result.rows[0];
    
    res.json({
      balance: parseFloat(wallet.balance),
      currency: wallet.currency,
      lastUpdated: wallet.updated_at
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

// Get transaction history
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const { limit: pageLimit, offset } = require('../utils/helpers').paginate(page, limit);
    
    let whereClause = 'WHERE user_id = $1';
    const params = [req.user.id];
    
    if (type) {
      whereClause += ' AND type = $2';
      params.push(type);
    }

    const result = await query(
      `SELECT id, type, amount, description, reference, status, metadata, created_at
       FROM transactions
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageLimit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions ${whereClause}`,
      params
    );

    const transactions = result.rows.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: parseFloat(tx.amount),
      description: tx.description,
      reference: tx.reference,
      status: tx.status,
      metadata: tx.metadata,
      createdAt: tx.created_at
    }));

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / pageLimit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const result = await query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, first_name, last_name, phone, updated_at`,
      [firstName, lastName, phone, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
