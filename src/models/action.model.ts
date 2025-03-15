import { z } from 'zod';

export const ActionSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  payload: z.record(z.any()),
  status: z.enum(['pending', 'completed', 'failed']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Action = z.infer<typeof ActionSchema>;