import { UserRepository } from '../../repositories/userRepository';
import { PrismaClient } from '@prisma/client';
import { mockDeep, MockProxy } from 'jest-mock-extended';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prisma: MockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    userRepository = new UserRepository();
    (userRepository as any).prisma = prisma;
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      prisma.user.create.mockResolvedValue({
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userRepository.create(userData);
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
    });
  });
});