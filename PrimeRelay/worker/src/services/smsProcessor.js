const { query, transaction } = require('../../backend/src/database/connection');
const { selectProvider, sendSmsViaProvider } = require('../providers/providerManager');
const moment = require('moment');

async function processSmsJob(job) {
  const { messageId, campaignId, userId, recipient, senderId, message, scheduledAt } = job.data;

  try {
    // Check if message is still pending
    const messageResult = await query(
      'SELECT status, attempts FROM messages WHERE id = $1',
      [messageId]
    );

    if (messageResult.rows.length === 0) {
      throw new Error('Message not found');
    }

    const messageRecord = messageResult.rows[0];

    // Skip if already processed
    if (messageRecord.status !== 'pending' && messageRecord.status !== 'queued') {
      console.log(`Message ${messageId} already processed (status: ${messageRecord.status})`);
      return;
    }

    // Update message status to sending
    await query(
      `UPDATE messages 
       SET status = 'sending', attempts = attempts + 1, last_attempt_at = NOW()
       WHERE id = $1`,
      [messageId]
    );

    // Check wallet balance before sending
    const walletResult = await query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [userId]
    );

    if (walletResult.rows.length === 0 || parseFloat(walletResult.rows[0].balance) < 2.50) {
      await query(
        `UPDATE messages 
         SET status = 'failed', updated_at = NOW()
         WHERE id = $1`,
        [messageId]
      );
      throw new Error('Insufficient balance');
    }

    // Select provider and send SMS
    const provider = await selectProvider(recipient);
    console.log(`📱 Sending SMS via ${provider.name} to ${recipient}`);

    const smsResult = await sendSmsViaProvider(provider, {
      recipient,
      senderId,
      message,
      messageId
    });

    // Update message with provider response
    await query(
      `UPDATE messages 
       SET status = $1, provider = $2, provider_message_id = $3, updated_at = NOW()
       WHERE id = $4`,
      [smsResult.status, provider.name, smsResult.providerMessageId, messageId]
    );

    // Deduct cost from wallet if sent successfully
    if (smsResult.status === 'sent') {
      await transaction(async (client) => {
        // Deduct from wallet
        await client.query(
          'UPDATE wallets SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2',
          [2.50, userId]
        );

        // Create transaction record
        await client.query(
          `INSERT INTO transactions (user_id, type, amount, description, reference, status, metadata)
           VALUES ($1, 'debit', $2, 'SMS sending', $3, 'completed', $4)`,
          [
            userId,
            2.50,
            `SMS-${messageId}`,
            JSON.stringify({
              messageId,
              recipient,
              provider: provider.name,
              cost: 2.50
            })
          ]
        );
      });

      console.log(`💰 Cost NGN 2.50 deducted from user ${userId}`);
    }

    // Update campaign status if needed
    await updateCampaignProgress(campaignId);

    return {
      success: true,
      messageId,
      provider: provider.name,
      status: smsResult.status,
      recipient
    };

  } catch (error) {
    console.error(`Failed to process SMS job ${messageId}:`, error);

    // Update message status to failed
    await query(
      `UPDATE messages 
       SET status = 'failed', updated_at = NOW()
       WHERE id = $1`,
      [messageId]
    );

    throw error;
  }
}

async function updateCampaignProgress(campaignId) {
  try {
    // Get message statistics for campaign
    const statsResult = await query(
      `SELECT status, COUNT(*) as count
       FROM messages 
       WHERE campaign_id = $1
       GROUP BY status`,
      [campaignId]
    );

    const stats = {};
    let totalMessages = 0;
    
    statsResult.rows.forEach(row => {
      stats[row.status] = parseInt(row.count);
      totalMessages += parseInt(row.count);
    });

    // Determine campaign status
    let newStatus = 'sending';
    
    const completedCount = (stats.delivered || 0) + (stats.failed || 0) + (stats.sent || 0);
    
    if (completedCount === totalMessages) {
      if (stats.delivered === totalMessages) {
        newStatus = 'completed';
      } else if (stats.failed === totalMessages) {
        newStatus = 'failed';
      } else {
        newStatus = 'completed'; // Partial success
      }
    }

    // Update campaign status
    await query(
      'UPDATE campaigns SET status = $1, updated_at = NOW() WHERE id = $2',
      [newStatus, campaignId]
    );

    console.log(`📊 Campaign ${campaignId} status updated to ${newStatus}`);

  } catch (error) {
    console.error('Error updating campaign progress:', error);
  }
}

module.exports = {
  processSmsJob
};
