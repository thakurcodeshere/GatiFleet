const fastq = require('fastq');

// In-memory store to track job statuses (since we have no external DB for it)
const jobStatuses = new Map();

// Worker function that processes the jobs
async function worker(job, done) {
  console.log(`[Worker] Started processing job ${job.id} of type: ${job.type}`);
  
  // Mark job as processing
  jobStatuses.set(job.id, { status: 'PROCESSING', progress: 10 });
  
  try {
    if (job.type === 'GENERATE_INVOICE_BATCH') {
      // Simulate heavy PDF generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      jobStatuses.set(job.id, { status: 'PROCESSING', progress: 50 });
      await new Promise(resolve => setTimeout(resolve, 3000));
      jobStatuses.set(job.id, { status: 'COMPLETED', progress: 100, result: 'invoices_batch_72.zip' });
      
    } else if (job.type === 'TRAIN_NEURAL_MODEL') {
      // Simulate AI training
      for(let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        jobStatuses.set(job.id, { status: 'PROCESSING', progress: i * 20 });
      }
      jobStatuses.set(job.id, { status: 'COMPLETED', progress: 100, result: 'model_weights_v4.bin' });
      
    } else {
      throw new Error('Unknown job type');
    }
    
    console.log(`[Worker] Completed job ${job.id}`);
    done(null, jobStatuses.get(job.id));
  } catch (err) {
    console.error(`[Worker] Job ${job.id} failed:`, err.message);
    jobStatuses.set(job.id, { status: 'FAILED', error: err.message });
    done(err);
  }
}

// Concurrency of 2 (can process 2 heavy jobs at exactly the same time)
const queue = fastq(worker, 2);

function dispatchJob(type, payload) {
  const jobId = `job-${Date.now()}`;
  jobStatuses.set(jobId, { status: 'QUEUED', progress: 0 });
  
  queue.push({ id: jobId, type, payload }, function (err, result) {
    if (err) {
      console.log(`Job error callback for ${jobId}`);
    }
  });
  
  return jobId;
}

function getJobStatus(jobId) {
  return jobStatuses.get(jobId) || { status: 'NOT_FOUND' };
}

module.exports = { dispatchJob, getJobStatus };
