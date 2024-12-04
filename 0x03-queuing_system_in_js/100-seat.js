// 100-seat.js

import express from 'express';
import redis from 'redis';
import kue from 'kue';
import util from 'util';

const app = express();
const queue = kue.createQueue();

// Create a Redis client
const client = redis.createClient();

// Promisify Redis functions
const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);

// Initialize the reservationEnabled flag
let reservationEnabled = true;

// Initialize available seats in Redis when the server starts
async function initializeSeats() {
    await setAsync('available_seats', 50);
}

// Function to get the current available seats from Redis
async function getCurrentAvailableSeats() {
    const availableSeats = await getAsync('available_seats');
    return parseInt(availableSeats, 10);
}

// Function to reserve seats by updating the Redis key
async function reserveSeat(number) {
    const currentSeats = await getCurrentAvailableSeats();

    if (currentSeats >= number) {
        await setAsync('available_seats', currentSeats - number);
    } else {
        throw new Error('Not enough seats available');
    }
}

// Initialize seats and set up the server to listen on port 1245
initializeSeats();

app.get('/available_seats', async (req, res) => {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat', {})
        .save((err) => {
            if (err) {
                return res.json({ status: 'Reservation failed' });
            }
            return res.json({ status: 'Reservation in process' });
        });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err}`);
    });
});

app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        try {
            const availableSeats = await getCurrentAvailableSeats();
            if (availableSeats > 0) {
                await reserveSeat(1);
                done();
            } else {
                reservationEnabled = false;
                done(new Error('Not enough seats available'));
            }
        } catch (err) {
            done(err);
        }
    });
});

app.listen(1245, () => {
    console.log('Server is running on http://localhost:1245');
});
