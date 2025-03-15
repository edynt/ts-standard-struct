import { Router } from 'express';
import { actionRoutes } from './v1/actionRoutes';
import { userRoutes } from './v1/userRoutes';
import { authRoutes } from './v1/authRoutes';

const router = Router();

router.use('/actions', actionRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;