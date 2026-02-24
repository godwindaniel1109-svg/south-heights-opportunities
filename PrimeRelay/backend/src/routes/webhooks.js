const express = require('express');
const { query } = require('../database/connection');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Paystack webhook
router.post('/paystack', async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (recommended for production)
    // const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    // if (hash !== req.headers['x-paystack-signature']) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    console.log('💳 Paystack webhook received:', event.event);

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;
      
      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;
      
      case 'transfer.success':
        await handleSuccessfulTransfer(event.data);
        break;
      
      case 'transfer.failed':
        await handleFailedTransfer(event.data);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// DLR (Delivery Report) webhook
router.post('/dlr', async (req, res) => {
  try {
    const { messageId, status, provider, providerMessageId, timestamp } = req.body;
    
    console.log('📨 DLR webhook received:', { messageId, status, provider });

    // Update message status in database
    await query(
      `UPDATE messages 
       SET dlr_status = $1, dlr_timestamp = $2, provider = $3, provider_message_id = $4, updated_at = NOW()
       WHERE id = $5`,
      [status, timestamp || new Date(), provider, providerMessageId, messageId]
    );

    // Update campaign status if all messages are processed
    await updateCampaignStatus(messageId);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('DLR webhook error:', error);
    res.status(500).json({ error: 'DLR processing failed' });
  }
});

// Helper functions
async function handleSuccessfulPayment(data) {
  const { reference, amount, customer, metadata } = data;
  
  try {
    // Find transaction
    const transactionResult = await query(
      'SELECT id, user_id, amount FROM transactions WHERE reference = $1 AND status = $2',
      [reference, 'pending']
    );

    if (transactionResult.rows.length === 0) {
      console.log('Transaction not found or already processed:', reference);
      return;
    }

    const transaction = transactionResult.rows[0];

    // Update transaction status
    await query(
      `UPDATE transactions 
       SET status = 'completed', metadata = $1, updated_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(data), transaction.id]
    );

    // Credit user wallet
    await query(
      `UPDATE wallets 
       SET balance = balance + $1, updated_at = NOW()
       WHERE user_id = $2`,
      [transaction.amount, transaction.user_id]
    );

    console.log(`✅ Payment processed: ${reference} - NGN ${amount}`);
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function handleFailedPayment(data) {
  const { reference } = data;
  
  try {
    await query(
      `UPDATE transactions 
       SET status = 'failed', metadata = $1, updated_at = NOW()
       WHERE reference = $2`,
      [JSON.stringify(data), reference]
    );

    console.log(`❌ Payment failed: ${reference}`);
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}

async function handleSuccessfulTransfer(data) {
  console.log('Transfer successful:', data);
  // Handle transfer success if needed
}

async function handleFailedTransfer(data) {
  console.log('Transfer failed:', data);
  // Handle transfer failure if needed
}

async function updateCampaignStatus(messageId) {
  try {
    // Get campaign ID from message
    const messageResult = await query(
      'SELECT campaign_id FROM messages WHERE id = $1',
      [messageId]
    );

    if (messageResult.rows.length === 0) {
      return;
    }

    const campaignId = messageResult.rows[0].campaign_id;

    // Check if all messages in campaign are processed
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

    // Update campaign status based on message statuses
    let newStatus = 'sending';
    
    if (stats.delivered === totalMessages) {
      newStatus = 'completed';
    } else if (stats.failed === totalMessages) {
      newStatus = 'failed';
    } else if (stats.delivered + stats.failed === totalMessages) {
      newStatus = 'completed'; // Some delivered, some failed
    }

    if (newStatus !== 'sending') {
      await query(
        'UPDATE campaigns SET status = $1, updated_at = NOW() WHERE id = $2',
        [newStatus, campaignId]
      );
    }
  } catch (error) {
    console.error('Error updating campaign status:', error);
  }
}

module.exports = router;
