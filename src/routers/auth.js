import express, { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
} from '../controllers/auth.js';

import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema, loginUserSchema } from '../validation/auth.js';

const router = Router();
const parse = express.json();

router.post(
  '/register',
  parse,
  validateBody(createUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  parse,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

export default router;
