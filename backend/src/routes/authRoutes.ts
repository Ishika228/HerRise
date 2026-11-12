import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  submitOnboarding
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.post('/onboarding', submitOnboarding);

export default router;
