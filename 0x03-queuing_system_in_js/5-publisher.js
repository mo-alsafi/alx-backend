// 5-publisher.js

const redis = require('redis');

// Create Redis client
const publisher = redis.createClient();

// Connect event
publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Error event
publisher.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Function to publish a message after a delay
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
}

// Publish messages with a delay
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
