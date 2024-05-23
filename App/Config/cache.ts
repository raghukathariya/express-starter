import { config } from 'dotenv';
config();
/**
 |
 |=====================================================================
 | REDIS CACE+HE
 |=====================================================================
 |
 */
export const RedisConfig = {
    REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ?? 6379,
    REDIS_ENABLED: process.env.REDIS_ENABLED ?? false
}