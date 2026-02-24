const express = require('express');
const bcrypt = require('bcryptjs');
const { query, transaction } = require('../database/connection');
const { generateTokens, generateReference, validateEmail } = require('../utils/helpers');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.validatedBody;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and wallet in transaction
    const result = await transaction(async (client) => {
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, first_name, last_name, role, created_at`,
        [email, passwordHash, firstName, lastName, phone]
      );

      const user = userResult.rows[0];

      // Create wallet
      await client.query(
        'INSERT INTO wallets (user_id, balance, currency) VALUES ($1, 0.00, $2)',
        [user.id, 'NGN']
      );

      return user;
    });

    // Generate tokens
    const tokens = generateTokens({ userId: result.id, email: result.email });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: result.id,
        email: result.email,
        firstName: result.first_name,
        lastName: result.last_name,
        role: result.role
      },
      ...tokens
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    // Get user
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, role, is_active
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, email: user.email });

    // Update last login (optional)
    await query(
      'UPDATE users SET updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      ...tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const { verifyRefreshToken } = require('../utils/helpers');
    const decoded = verifyRefreshToken(refreshToken);

    // Get user
    const result = await query(
      `SELECT id, email, first_name, last_name, role, is_active
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    const user = result.rows[0];

    // Generate new tokens
    const tokens = generateTokens({ userId: user.id, email: user.email });

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      ...tokens
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
