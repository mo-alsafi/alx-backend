// 6-job_creator.js

const kue = require('kue');

// Create a queue named push_notification_code
const queue = kue.createQueue();

// Create an object containing job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'Your verification code is 12345',
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.log('Error creating job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Event listener for job completion
job.on('complete', () => {
  console.log('Notification job completed');
});

// Event listener for job failure
job.on('failed', (err) => {
  console.log('Notification job failed');
});
