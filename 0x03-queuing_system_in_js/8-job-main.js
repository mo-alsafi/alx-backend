// 8-job-main.js
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

// Create the queue
const queue = kue.createQueue();

// Define the list of jobs
const list = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  }
];

// Call the function to create the jobs
createPushNotificationsJobs(list, queue);
