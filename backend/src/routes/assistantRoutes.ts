import { Router } from 'express';
import { chatWithAssistant } from '../controllers/assistantController.js';

const router = Router();

// Universal Assistant Chat endpoint
router.post('/chat', chatWithAssistant);
router.post('/consult', chatWithAssistant);

export default router;
