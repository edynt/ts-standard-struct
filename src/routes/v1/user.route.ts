import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../../controllers/userController';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validator';

const router = Router();
const userController = new UserController();

const createUserValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
];

router.post(
  '/',
  validate(createUserValidation),
  userController.createUser.bind(userController)
);

router.use(authenticate);

router.get('/me', userController.getCurrentUser.bind(userController));
router.put(
  '/me',
  validate([body('name').optional().notEmpty()]),
  userController.updateUser.bind(userController)
);

export const userRoutes = router;