const express = require('express');
const { query, transaction } = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const { validate, campaignSchema, singleSmsSchema } = require('../middleware/validation');
const { generateReference, sanitizePhoneNumber } = require('../utils/helpers');
const { addSmsToQueue } = require('../services/queueService');

const router = express.Router();

// Send single SMS
router.post('/send', authenticate, validate(singleSmsSchema), async (req, res) => {
  try {
    const { senderId, recipient, message, scheduledAt } = req.validatedBody;
    const userId = req.user.id;

    // Check wallet balance
    const walletResult = await query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [userId]
    );

    if (walletResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const balance = parseFloat(walletResult.rows[0].balance);
    const costPerSms = 2.50; // NGN 2.50 per SMS
    const totalCost = costPerSms;

    if (balance < totalCost) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        required: totalCost,
        available: balance
      });
    }

    // Sanitize phone number
    const sanitizedRecipient = sanitizePhoneNumber(recipient);

    // Create campaign
    const campaignResult = await query(
      `INSERT INTO campaigns (user_id, sender_id, message, total_recipients, scheduled_at, status, cost_per_sms, total_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, senderId, message, 1, scheduledAt || null, scheduledAt ? 'scheduled' : 'draft', costPerSms, totalCost]
    );

    const campaignId = campaignResult.rows[0].id;

    // Create message record
    const messageResult = await query(
      `INSERT INTO messages (campaign_id, user_id, recipient, sender_id, message, cost, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [campaignId, userId, sanitizedRecipient, senderId, message, costPerSms, 'pending']
    );

    const messageId = messageResult.rows[0].id;

    // Add to queue
    await addSmsToQueue({
      messageId,
      campaignId,
      userId,
      recipient: sanitizedRecipient,
      senderId,
      message,
      scheduledAt
    });

    // Update campaign status
    await query(
      'UPDATE campaigns SET status = $1 WHERE id = $2',
      [scheduledAt ? 'scheduled' : 'queued', campaignId]
    );

    res.status(201).json({
      message: 'SMS queued successfully',
      messageId,
      campaignId,
      recipient: sanitizedRecipient,
      cost: totalCost,
      status: scheduledAt ? 'scheduled' : 'queued'
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Send bulk SMS campaign
router.post('/campaign', authenticate, validate(campaignSchema), async (req, res) => {
  try {
    const { senderId, message, recipients, scheduledAt } = req.validatedBody;
    const userId = req.user.id;

    let recipientNumbers = [];

    // Handle recipients (array of numbers or contact list ID)
    if (Array.isArray(recipients)) {
      recipientNumbers = recipients.map(sanitizePhoneNumber);
    } else {
      // It's a contact list ID - fetch contacts
      const contactsResult = await query(
        'SELECT phone FROM contacts WHERE list_id = $1 AND user_id = $2',
        [recipients, userId]
      );
      recipientNumbers = contactsResult.rows.map(contact => sanitizePhoneNumber(contact.phone));
    }

    if (recipientNumbers.length === 0) {
      return res.status(400).json({ error: 'No valid recipients found' });
    }

    // Check wallet balance
    const walletResult = await query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [userId]
    );

    if (walletResult.rows.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const balance = parseFloat(walletResult.rows[0].balance);
    const costPerSms = 2.50; // NGN 2.50 per SMS
    const totalCost = costPerSms * recipientNumbers.length;

    if (balance < totalCost) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        required: totalCost,
        available: balance,
        recipientCount: recipientNumbers.length
      });
    }

    // Create campaign
    const campaignResult = await query(
      `INSERT INTO campaigns (user_id, sender_id, message, total_recipients, scheduled_at, status, cost_per_sms, total_cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, senderId, message, recipientNumbers.length, scheduledAt || null, scheduledAt ? 'scheduled' : 'draft', costPerSms, totalCost]
    );

    const campaignId = campaignResult.rows[0].id;

    // Create message records and add to queue
    const messagePromises = recipientNumbers.map(async (recipient) => {
      const messageResult = await query(
        `INSERT INTO messages (campaign_id, user_id, recipient, sender_id, message, cost, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [campaignId, userId, recipient, senderId, message, costPerSms, 'pending']
      );

      return addSmsToQueue({
        messageId: messageResult.rows[0].id,
        campaignId,
        userId,
        recipient,
        senderId,
        message,
        scheduledAt
      });
    });

    await Promise.all(messagePromises);

    // Update campaign status
    await query(
      'UPDATE campaigns SET status = $1 WHERE id = $2',
      [scheduledAt ? 'scheduled' : 'queued', campaignId]
    );

    res.status(201).json({
      message: 'Campaign queued successfully',
      campaignId,
      recipientCount: recipientNumbers.length,
      totalCost,
      status: scheduledAt ? 'scheduled' : 'queued'
    });
  } catch (error) {
    console.error('Send campaign error:', error);
    res.status(500).json({ error: 'Failed to send campaign' });
  }
});

// Get campaigns
router.get('/campaigns', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { limit: pageLimit, offset } = require('../utils/helpers').paginate(page, limit);
    
    let whereClause = 'WHERE user_id = $1';
    const params = [req.user.id];
    
    if (status) {
      whereClause += ' AND status = $2';
      params.push(status);
    }

    const result = await query(
      `SELECT id, sender_id, message, total_recipients, scheduled_at, status, 
              cost_per_sms, total_cost, created_at, updated_at
       FROM campaigns
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageLimit, offset]
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM campaigns ${whereClause}`,
      params
    );

    const campaigns = result.rows.map(campaign => ({
      id: campaign.id,
      senderId: campaign.sender_id,
      message: campaign.message.substring(0, 100) + (campaign.message.length > 100 ? '...' : ''),
      totalRecipients: campaign.total_recipients,
      scheduledAt: campaign.scheduled_at,
      status: campaign.status,
      costPerSms: parseFloat(campaign.cost_per_sms),
      totalCost: parseFloat(campaign.total_cost),
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at
    }));

    res.json({
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: pageLimit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / pageLimit)
      }
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get campaign details
router.get('/campaigns/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const campaignResult = await query(
      `SELECT id, sender_id, message, total_recipients, scheduled_at, status, 
              cost_per_sms, total_cost, created_at, updated_at
       FROM campaigns 
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (campaignResult.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const campaign = campaignResult.rows[0];

    // Get message statistics
    const statsResult = await query(
      `SELECT status, COUNT(*) as count
       FROM messages 
       WHERE campaign_id = $1
       GROUP BY status`,
      [id]
    );

    const stats = {};
    statsResult.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
    });

    res.json({
      id: campaign.id,
      senderId: campaign.sender_id,
      message: campaign.message,
      totalRecipients: campaign.total_recipients,
      scheduledAt: campaign.scheduled_at,
      status: campaign.status,
      costPerSms: parseFloat(campaign.cost_per_sms),
      totalCost: parseFloat(campaign.total_cost),
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
      statistics: stats
    });
  } catch (error) {
    console.error('Get campaign details error:', error);
    res.status(500).json({ error: 'Failed to fetch campaign details' });
  }
});

module.exports = router;
