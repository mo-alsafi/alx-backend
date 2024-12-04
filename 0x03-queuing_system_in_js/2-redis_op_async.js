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

const getAsync = promisify(client.get).bind(client)

function setNewSchool(schoolName, value){
    client.set(schoolName, value, redis.print)
}

async function displaySchoolValue(schoolName){
    await client.get(schoolName, (err, replay) => {
        if (err) {
            console.log(`Error retrieving the value for ${schoolName}: ${err.message}`);
        } else{
            console.log(`Value for ${schoolName}: ${replay}`)
        }
    });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');