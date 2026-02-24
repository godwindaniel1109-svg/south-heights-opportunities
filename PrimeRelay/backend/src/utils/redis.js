const redis = require('redis');

let client = null;

async function connectRedis() {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

function getRedisClient() {
  if (!client) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return client;
}

// Rate limiting helper
async function checkRateLimit(key, limit, window) {
  const redis = getRedisClient();
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, window);
  }
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: await redis.ttl(key)
  };
}

// Cache helper
async function setCache(key, value, ttl = 3600) {
  const redis = getRedisClient();
  await redis.setEx(key, ttl, JSON.stringify(value));
}

async function getCache(key) {
  const redis = getRedisClient();
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

async function deleteCache(key) {
  const redis = getRedisClient();
  await redis.del(key);
}

module.exports = {
  connectRedis,
  getRedisClient,
  checkRateLimit,
  setCache,
  getCache,
  deleteCache
};
