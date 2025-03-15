import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { CacheHook } from './useCache';

export class AuthHook {
  private static instance: AuthHook;
  private cache = CacheHook.getInstance();

  private constructor() {}

  public static getInstance(): AuthHook {
    if (!AuthHook.instance) {
      AuthHook.instance = new AuthHook();
    }
    return AuthHook.instance;
  }

  public async generateToken(userId: string): Promise<string> {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    await this.cache.set(`token:${userId}`, token, 3600);
    return token;
  }

  public async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const cachedToken = await this.cache.get(`token:${decoded.userId}`);
      
      if (cachedToken !== token) {
        throw new Error('Token revoked');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  public async revokeToken(userId: string): Promise<void> {
    await this.cache.delete(`token:${userId}`);
  }
}