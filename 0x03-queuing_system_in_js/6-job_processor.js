// 6-job_processor.js

const kue = require('kue');

// Create a queue named push_notification_code
const queue = kue.createQueue();

// Function to send the notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Queue process that listens to new jobs on the 'push_notification_code' queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  
  // Call the sendNotification function with the phone number and message from the job data
  sendNotification(phoneNumber, message);

  // Indicate that the job is completed
  done();
});
