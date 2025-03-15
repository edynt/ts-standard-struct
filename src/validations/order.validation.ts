import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  items: z.array(
    z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one item'),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
});