import { PrismaClient } from '@prisma/client';

export class DatabaseHook {
  private static instance: DatabaseHook;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): DatabaseHook {
    if (!DatabaseHook.instance) {
      DatabaseHook.instance = new DatabaseHook();
    }
    return DatabaseHook.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Usage example:
// const db = DatabaseHook.getInstance();