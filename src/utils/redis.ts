import { createClient } from 'redis';
import config from '../config/config';

const redisClient = createClient({ url: config.redisUrl });

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
})();

export default redisClient;
