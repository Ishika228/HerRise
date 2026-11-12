import { Router } from 'express';
import { getMentors, bookSession } from '../controllers/networkController.js';

const router = Router();

router.get('/mentors', getMentors);
router.post('/book', bookSession);

export default router;

