import Redis from 'ioredis';
import { config } from '../config/config';

const {
  redis: { host, port },
} = config;

export const redis = new Redis({ port, host });
