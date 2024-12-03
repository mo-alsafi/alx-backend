import redis from 'redis';

const client = redis.createClient();

// When the connection is successful, log this message:
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// If there is an error, log this message with the error message:
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});
