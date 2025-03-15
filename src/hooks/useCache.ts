import Redis from 'ioredis';

export class CacheHook {
  private static instance: CacheHook;
  private redis: Redis;

  private constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  public static getInstance(): CacheHook {
    if (!CacheHook.instance) {
      CacheHook.instance = new CacheHook();
    }
    return CacheHook.instance;
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } else {
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  public async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

// Usage example:
// const cache = CacheHook.getInstance();