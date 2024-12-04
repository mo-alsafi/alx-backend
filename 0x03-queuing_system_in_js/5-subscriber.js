// 5-subscriber.js

const redis = require('redis');

// Create Redis client
const subscriber = redis.createClient();

// Connect event
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Error event
subscriber.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Subscribe to the 'holberton school channel'
subscriber.subscribe('holberton school channel');

// Message event listener
subscriber.on('message', (channel, message) => {
  console.log(message); // Log the message to the console
  if (message === 'KILL_SERVER') {
    // Unsubscribe and quit when the message is 'KILL_SERVER'
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
