require('dotenv').config();
const { Worker } = require('bullmq');
const { connectRedis } = require('../backend/src/utils/redis');
const { connectDatabase, query } = require('../backend/src/database/connection');
const { processSmsJob } = require('./services/smsProcessor');
const { SMS_QUEUE_NAME } = require('../backend/src/services/queueService');

let worker = null;

async function startWorker() {
  try {
    // Connect to Redis
    const redis = await connectRedis();
    console.log('✅ Worker connected to Redis');

    // Connect to database
    await connectDatabase();
    console.log('✅ Worker connected to database');

    // Create worker
    worker = new Worker(
      SMS_QUEUE_NAME,
      async (job) => {
        console.log(`🔄 Processing job ${job.id}:`, job.name, job.data);
        
        try {
          await processSmsJob(job);
          console.log(`✅ Job ${job.id} completed successfully`);
        } catch (error) {
          console.error(`❌ Job ${job.id} failed:`, error);
          throw error;
        }
      },
      {
        connection: redis,
        concurrency: 10, // Process 10 jobs concurrently
        limiter: {
          max: 100, // Max 100 jobs per 10 seconds
          duration: 10000,
        },
      }
    );

    // Worker event listeners
    worker.on('completed', (job) => {
      console.log(`🎉 Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`💥 Job ${job.id} failed:`, err.message);
    });

    worker.on('error', (err) => {
      console.error('Worker error:', err);
    });

    worker.on('closing', () => {
      console.log('Worker is closing...');
    });

    worker.on('closed', () => {
      console.log('Worker has closed');
    });

    console.log('🚀 SMS Worker started successfully');
    console.log(`📊 Processing queue: ${SMS_QUEUE_NAME}`);
    console.log(`⚙️ Concurrency: 10 jobs`);

  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdownWorker() {
  console.log('🛑 Shutting down worker...');
  
  if (worker) {
    await worker.close();
    console.log('✅ Worker closed gracefully');
  }
  
  process.exit(0);
}

// Handle process signals
process.on('SIGTERM', shutdownWorker);
process.on('SIGINT', shutdownWorker);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdownWorker();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdownWorker();
});

// Start worker
startWorker();
