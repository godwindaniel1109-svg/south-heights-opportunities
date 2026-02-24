const axios = require('axios');

// Provider configurations
const PROVIDERS = {
  termii: {
    name: 'termii',
    apiKey: process.env.TERMII_API_KEY,
    baseUrl: 'https://api.ng.termii.com',
    priority: 1,
    enabled: true
  },
  mtnairtel: {
    name: 'mtnairtel',
    apiKey: process.env.MTNAIRTEL_API_KEY,
    baseUrl: 'https://api.mtnairtel.com',
    priority: 2,
    enabled: true
  },
  smartsmpp: {
    name: 'smartsmpp',
    apiKey: process.env.SMARTSMPP_API_KEY,
    baseUrl: 'https://api.smartsmpp.com',
    priority: 3,
    enabled: true
  }
};

// Select provider based on availability and routing rules
async function selectProvider(recipient) {
  const enabledProviders = Object.values(PROVIDERS).filter(p => p.enabled && p.apiKey);
  
  if (enabledProviders.length === 0) {
    throw new Error('No SMS providers available');
  }

  // Simple round-robin based on priority
  // In production, you might want more sophisticated routing
  return enabledProviders.sort((a, b) => a.priority - b.priority)[0];
}

// Send SMS via specific provider
async function sendSmsViaProvider(provider, smsData) {
  const { recipient, senderId, message, messageId } = smsData;

  try {
    switch (provider.name) {
      case 'termii':
        return await sendViaTermii(provider, smsData);
      
      case 'mtnairtel':
        return await sendViaMtnAirtel(provider, smsData);
      
      case 'smartsmpp':
        return await sendViaSmartSMPP(provider, smsData);
      
      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  } catch (error) {
    console.error(`Error sending SMS via ${provider.name}:`, error);
    throw error;
  }
}

// Termii provider implementation
async function sendViaTermii(provider, smsData) {
  const { recipient, senderId, message, messageId } = smsData;

  try {
    const response = await axios.post(
      `${provider.baseUrl}/api/sms/send`,
      {
        to: recipient,
        from: senderId,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: provider.apiKey,
        message_id: messageId
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data;

    if (result.message_id || result.messageId) {
      return {
        status: 'sent',
        providerMessageId: result.message_id || result.messageId,
        response: result
      };
    } else {
      throw new Error(result.message || 'Failed to send SMS via Termii');
    }

  } catch (error) {
    if (error.response) {
      throw new Error(`Termii API error: ${error.response.data?.message || error.response.statusText}`);
    }
    throw error;
  }
}

// MTN/Airtel provider implementation
async function sendViaMtnAirtel(provider, smsData) {
  const { recipient, senderId, message, messageId } = smsData;

  try {
    const response = await axios.post(
      `${provider.baseUrl}/v1/sms/send`,
      {
        destination: recipient,
        source: senderId,
        text: message,
        transactionId: messageId,
        apiKey: provider.apiKey
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`
        }
      }
    );

    const result = response.data;

    if (result.status === 'success' || result.statusCode === 200) {
      return {
        status: 'sent',
        providerMessageId: result.transactionId || result.messageId,
        response: result
      };
    } else {
      throw new Error(result.message || 'Failed to send SMS via MTN/Airtel');
    }

  } catch (error) {
    if (error.response) {
      throw new Error(`MTN/Airtel API error: ${error.response.data?.message || error.response.statusText}`);
    }
    throw error;
  }
}

// SmartSMPP provider implementation
async function sendViaSmartSMPP(provider, smsData) {
  const { recipient, senderId, message, messageId } = smsData;

  try {
    const response = await axios.post(
      `${provider.baseUrl}/api/send-sms`,
      {
        msisdn: recipient,
        sender: senderId,
        message: message,
        messageId: messageId,
        apiKey: provider.apiKey
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data;

    if (result.status === 'submitted' || result.code === '0') {
      return {
        status: 'sent',
        providerMessageId: result.messageId || result.smsId,
        response: result
      };
    } else {
      throw new Error(result.message || 'Failed to send SMS via SmartSMPP');
    }

  } catch (error) {
    if (error.response) {
      throw new Error(`SmartSMPP API error: ${error.response.data?.message || error.response.statusText}`);
    }
    throw error;
  }
}

// Check provider health/status
async function checkProviderHealth(provider) {
  try {
    const response = await axios.get(
      `${provider.baseUrl}/api/health`,
      {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`
        }
      }
    );

    return {
      healthy: true,
      responseTime: response.headers['x-response-time'] || 'unknown',
      status: response.data
    };

  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

// Get provider statistics
async function getProviderStats() {
  const stats = {};

  for (const [key, provider] of Object.entries(PROVIDERS)) {
    if (!provider.enabled || !provider.apiKey) {
      stats[key] = { enabled: false };
      continue;
    }

    try {
      const health = await checkProviderHealth(provider);
      stats[key] = {
        enabled: true,
        priority: provider.priority,
        healthy: health.healthy,
        responseTime: health.responseTime
      };
    } catch (error) {
      stats[key] = {
        enabled: true,
        priority: provider.priority,
        healthy: false,
        error: error.message
      };
    }
  }

  return stats;
}

module.exports = {
  selectProvider,
  sendSmsViaProvider,
  checkProviderHealth,
  getProviderStats,
  PROVIDERS
};
