import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

// When the connection is successful, log this message:
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// If there is an error, log this message with the error message:
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

client.hset('HolbertonSchools', 'Portland', 50, redis.print);
client.hset('HolbertonSchools', 'Seattle', 80, redis.print);
client.hset('HolbertonSchools', 'New York', 20, redis.print);
client.hset('HolbertonSchools', 'Bogota', 20, redis.print);
client.hset('HolbertonSchools', 'Cali', 40, redis.print);
client.hset('HolbertonSchools', 'Paris', 2, redis.print);
client.hgetall('HolbertonSchools', (err, object) => {
    if (err) {
      console.error('Error retrieving hash:', err);
    } else {
      console.log('HolbertonSchools hash:', object);
    }
  });