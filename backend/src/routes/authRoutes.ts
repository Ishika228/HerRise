import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  submitOnboarding,
  saveModuleProfile,
  deleteUserAccount
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getCurrentUser);
router.post('/onboarding', submitOnboarding);
router.post('/module-profile', saveModuleProfile);
router.delete('/user/:email', deleteUserAccount);
router.delete('/user', deleteUserAccount);

export default router;
