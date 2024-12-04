import kue from 'kue';
import { expect } from 'chai';
import createPushNotificationsJobs from './8-job.js';

// Define the test suite for createPushNotificationsJobs
describe('createPushNotificationsJobs', function () {
  // Create the queue
  let queue;

  // Use Kue's testMode to avoid processing jobs during the test
  beforeEach(function () {
    queue = kue.createQueue();
    queue.testMode = true; // Enter test mode to prevent actual job processing
  });

  // Clean up after each test by removing jobs manually
  afterEach(function (done) {
    // Manually remove jobs from different states (active, completed, failed)
    queue.active((err, jobs) => {
      if (err) return done(err);
      jobs.forEach(job => job.remove());
    });
    
    queue.completed((err, jobs) => {
      if (err) return done(err);
      jobs.forEach(job => job.remove());
    });

    queue.failed((err, jobs) => {
      if (err) return done(err);
      jobs.forEach(job => job.remove());
    });

    // Exit test mode
    queue.testMode = false;

    done();
  });

  // Test case: Check if the input is not an array
  it('should display an error message if jobs is not an array', function () {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  // Test case: Check if two jobs are created and added to the queue
  it('should create jobs and add them to the queue', function (done) {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' }
    ];

    // Use a done callback to signal when the test should finish
    createPushNotificationsJobs(jobs, queue);

    // Validate the jobs created in the queue
    setImmediate(() => {
      expect(queue.testMode.jobs.length).to.equal(2); // Check if two jobs are in the queue
      expect(queue.testMode.jobs[0].data.phoneNumber).to.equal('4153518780'); // Check first job's phone number
      expect(queue.testMode.jobs[1].data.phoneNumber).to.equal('4153518781'); // Check second job's phone number

      done();
    });
  });

  // Test case: Check if job creation logs correctly
  it('should log the correct creation message', function (done) {
    const jobs = [
      { phoneNumber: '4153518782', message: 'This is the code 6789 to verify your account' }
    ];

    // Mocking the console.log to check if the creation message is logged
    let logMessage = '';
    const originalLog = console.log;
    console.log = (message) => { logMessage = message; };

    createPushNotificationsJobs(jobs, queue);

    setImmediate(() => {
      // Check if the job creation message is logged
      expect(logMessage).to.include('Notification job created');
      
      // Restore the original console.log
      console.log = originalLog;

      done();
    });
  });

  // Test case: Check if job completion logs correctly
  it('should log job completion correctly', function (done) {
    const jobs = [
      { phoneNumber: '4153518783', message: 'This is the code 9876 to verify your account' }
    ];

    // Mocking the console.log to check if the completion message is logged
    let logMessage = '';
    const originalLog = console.log;
    console.log = (message) => { logMessage = message; };

    createPushNotificationsJobs(jobs, queue);

    // Process the jobs after a delay (simulate job completion)
    setImmediate(() => {
      // Simulate job completion
      queue.process('push_notification_code_3', (job, done) => {
        done();
      });

      setTimeout(() => {
        // Check if the job completion message is logged
        expect(logMessage).to.include('Notification job completed');

        // Restore the original console.log
        console.log = originalLog;

        done();
      }, 100); // Wait for job processing to complete
    });
  });

  // Test case: Check if job failure is logged correctly
  it('should log job failure correctly', function (done) {
    const jobs = [
      { phoneNumber: '4153518784', message: 'This is the code 1122 to verify your account' }
    ];

    // Mocking the console.log to check if the failure message is logged
    let logMessage = '';
    const originalLog = console.log;
    console.log = (message) => { logMessage = message; };

    createPushNotificationsJobs(jobs, queue);

    // Process the jobs after a delay (simulate job failure)
    setImmediate(() => {
      // Simulate job failure
      queue.process('push_notification_code_3', (job, done) => {
        done(new Error('Some error'));
      });

      setTimeout(() => {
        // Check if the job failure message is logged
        expect(logMessage).to.include('Notification job failed');

        // Restore the original console.log
        console.log = originalLog;

        done();
      }, 100); // Wait for job processing to complete
    });
  });

  // Test case: Check if job progress is logged correctly
  it('should log job progress correctly', function (done) {
    const jobs = [
      { phoneNumber: '4153518785', message: 'This is the code 3344 to verify your account' }
    ];

    // Mocking the console.log to check if the progress message is logged
    let logMessage = '';
    const originalLog = console.log;
    console.log = (message) => { logMessage = message; };

    createPushNotificationsJobs(jobs, queue);

    // Process the jobs after a delay (simulate job progress)
    setImmediate(() => {
      queue.process('push_notification_code_3', (job, done) => {
        job.progress(50, 100); // Simulate 50% progress
        done();
      });

      setTimeout(() => {
        // Check if the progress message is logged
        expect(logMessage).to.include('Notification job 50% complete');

        // Restore the original console.log
        console.log = originalLog;

        done();
      }, 100); // Wait for job progress and completion
    });
  });
});
