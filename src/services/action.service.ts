import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { Kafka } from 'kafkajs';
import { Action, CreateActionDto } from '../types/action.types';

export class ActionService {
  private prisma: PrismaClient;
  private redis: Redis;
  private kafka: Kafka;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis(process.env.REDIS_URL);
    this.kafka = new Kafka({
      clientId: 'action-service',
      brokers: [process.env.KAFKA_BROKERS || ''],
    });
  }

  async createAction(data: CreateActionDto): Promise<Action> {
    // Create action in database
    const action = await this.prisma.action.create({
      data: {
        type: data.type,
        payload: data.payload,
        status: 'pending',
      },
    });

    // Cache action in Redis
    await this.redis.set(`action:${action.id}`, JSON.stringify(action));

    // Publish to Kafka
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic: 'actions',
      messages: [{ value: JSON.stringify(action) }],
    });

    return action;
  }

  async getAction(id: string): Promise<Action | null> {
    // Try to get from cache first
    const cached = await this.redis.get(`action:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // If not in cache, get from database
    const action = await this.prisma.action.findUnique({
      where: { id },
    });

    if (action) {
      // Cache the result
      await this.redis.set(`action:${id}`, JSON.stringify(action));
    }

    return action;
  }

  async listActions(): Promise<Action[]> {
    return this.prisma.action.findMany();
  }
}