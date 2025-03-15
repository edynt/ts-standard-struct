import { User } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'USER' | 'MANAGER';
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'USER' | 'MANAGER';
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}