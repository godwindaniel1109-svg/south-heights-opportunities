const express = require('express');
const { query, transaction } = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const { validate, paymentSchema } = require('../middleware/validation');
const { generateReference } = require('../utils/helpers');
const Paystack = require('paystack-sdk');

const router = express.Router();
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// Initialize payment
router.post('/initialize', authenticate, validate(paymentSchema), async (req, res) => {
  try {
    const { amount } = req.validatedBody;
    const userId = req.user.id;

    // Generate transaction reference
    const reference = generateReference('PAY');

    // Create transaction record
    await query(
      `INSERT INTO transactions (user_id, type, amount, description, reference, status, metadata)
       VALUES ($1, 'credit', $2, 'Wallet funding via Paystack', $3, 'pending', $4)
       RETURNING id`,
      [userId, amount, reference, JSON.stringify({ paymentMethod: 'paystack' })]
    );

    // Initialize Paystack transaction
    const paymentData = {
      email: req.user.email,
      amount: amount * 100, // Paystack expects amount in kobo
      reference,
      callback_url: `${process.env.FRONTEND_URL}/dashboard/wallet?payment=success`,
      metadata: {
        userId,
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: userId
          }
        ]
      }
    };

    const response = await paystack.transaction.initialize(paymentData);

    res.json({
      message: 'Payment initialized successfully',
      reference,
      authorizationUrl: response.data.authorization_url,
      accessCode: response.data.access_code
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Verify payment
router.get('/verify/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const response = await paystack.transaction.verify(reference);

    if (!response.data.status) {
      return res.status(400).json({ error: 'Payment not successful' });
    }

    // Check if transaction exists and belongs to user
    const transactionResult = await query(
      `SELECT id, user_id, amount, status FROM transactions 
       WHERE reference = $1 AND user_id = $2`,
      [reference, req.user.id]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactionResult.rows[0];

    if (transaction.status === 'completed') {
      return res.json({
        message: 'Payment already processed',
        status: 'completed',
        amount: parseFloat(transaction.amount)
      });
    }

    // Update transaction status and credit wallet
    await transaction(async (client) => {
      await client.query(
        `UPDATE transactions 
         SET status = 'completed', metadata = $1, updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(response.data), transaction.id]
      );

      await client.query(
        `UPDATE wallets 
         SET balance = balance + $1, updated_at = NOW()
         WHERE user_id = $2`,
        [transaction.amount, req.user.id]
      );
    });

    res.json({
      message: 'Payment verified successfully',
      status: 'completed',
      amount: parseFloat(transaction.amount),
      paidAt: response.data.paid_at
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get payment methods
router.get('/methods', authenticate, (req, res) => {
  res.json({
    methods: [
      {
        id: 'paystack',
        name: 'Paystack',
        description: 'Pay with card, bank transfer, USSD, or other Paystack payment methods',
        currencies: ['NGN'],
        enabled: true
      }
    ]
  });
});

// Get transaction status
router.get('/transaction/:reference', authenticate, async (req, res) => {
  try {
    const { reference } = req.params;

    const result = await query(
      `SELECT id, type, amount, description, reference, status, metadata, created_at, updated_at
       FROM transactions 
       WHERE reference = $1 AND user_id = $2`,
      [reference, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = result.rows[0];

    res.json({
      id: transaction.id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      reference: transaction.reference,
      status: transaction.status,
      metadata: transaction.metadata,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;
