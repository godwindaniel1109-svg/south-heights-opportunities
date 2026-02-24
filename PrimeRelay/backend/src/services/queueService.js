const { Queue, Worker } = require('bullmq');
const { getRedisClient } = require('../utils/redis');

const SMS_QUEUE_NAME = 'sms-sending';

// Create SMS queue
function createSmsQueue() {
  const redis = getRedisClient();
  return new Queue(SMS_QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: 100, // Keep last 100 completed jobs
      removeOnFail: 50,      // Keep last 50 failed jobs
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  });
}

// Add SMS to queue
async function addSmsToQueue(smsData, options = {}) {
  const queue = createSmsQueue();
  
  const job = await queue.add(
    'send-sms',
    smsData,
    {
      delay: options.delay || 0,
      ...options
    }
  );

  console.log(`📝 SMS job added to queue: ${job.id}`);
  return job;
}

// Get queue status
async function getQueueStatus() {
  const queue = createSmsQueue();
  
  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getCompleted(),
    queue.getFailed()
  ]);

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length
  };
}

// Pause/Resume queue
async function pauseQueue() {
  const queue = createSmsQueue();
  await queue.pause();
  console.log('⏸️ SMS queue paused');
}

async function resumeQueue() {
  const queue = createSmsQueue();
  await queue.resume();
  console.log('▶️ SMS queue resumed');
}

// Clear queue
async function clearQueue() {
  const queue = createSmsQueue();
  await queue.drain();
  console.log('🗑️ SMS queue cleared');
}

module.exports = {
  createSmsQueue,
  addSmsToQueue,
  getQueueStatus,
  pauseQueue,
  resumeQueue,
  clearQueue,
  SMS_QUEUE_NAME
};
