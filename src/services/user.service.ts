import { PrismaClient } from '@prisma/client';
import type { User, Profile } from '../types/prisma.type';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.user.create({
      data,
      include: {
        profile: true,
        orders: true
      }
    });
  }

  async getUserWithProfile(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
  }
}