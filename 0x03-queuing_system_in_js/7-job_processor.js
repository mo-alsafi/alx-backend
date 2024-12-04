// 7-job_processor.js

const kue = require('kue');
const queue = kue.createQueue();

// Define the blacklisted phone numbers
const blacklistedNumbers = [
  '4153518780',
  '4153518781'
];

// Function to send notifications
function sendNotification(phoneNumber, message, job, done) {
  // Track job progress at 0%
  job.progress(0, 100);
  
  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job by passing an error to the done() callback
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    return done(error);
  }

  // Otherwise, process the job and track the progress to 50%
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate some processing (e.g., sending the notification)
  // This would be where you handle the actual logic of sending a notification
  setTimeout(() => {
    // Mark the job as complete
    job.progress(100, 100);  // Mark progress as complete
    console.log(`Notification job ${job.id} completed`);
    done();  // Job is completed
  }, 2000);  // Simulating a 2-second delay for the notification process
}

// Process jobs in the queue push_notification_code_2
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call sendNotification function with the job details
  sendNotification(phoneNumber, message, job, done);
});
