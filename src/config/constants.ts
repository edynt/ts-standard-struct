export const constants = {
  API_PREFIX: '/api/v1',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '24h',
  REDIS_CACHE_DURATION: 3600, // 1 hour in seconds
};