import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../../controllers/authController';
import { validate } from '../../middlewares/validator';

const router = Router();
const authController = new AuthController();

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post(
  '/login',
  validate(loginValidation),
  authController.login.bind(authController)
);

router.post(
  '/refresh-token',
  body('refreshToken').notEmpty(),
  validate([]),
  authController.refreshToken.bind(authController)
);

export const authRoutes = router;