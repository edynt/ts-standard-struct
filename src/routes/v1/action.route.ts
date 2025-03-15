import { Router } from 'express';
import { body } from 'express-validator';
import { ActionController } from '../../controllers/actionController';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validator';

const router = Router();
const actionController = new ActionController();

const createActionValidation = [
  body('type').notEmpty().withMessage('Action type is required'),
  body('payload').isObject().withMessage('Payload must be an object'),
];

router.use(authenticate);

router.post(
  '/',
  validate(createActionValidation),
  actionController.createAction.bind(actionController)
);

router.get('/', actionController.listActions.bind(actionController));
router.get('/:id', actionController.getAction.bind(actionController));

export const actionRoutes = router;