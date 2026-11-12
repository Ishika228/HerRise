import { Router } from 'express';
import { getCourses, enrollCourse } from '../controllers/learnController.js';

const router = Router();

router.get('/courses', getCourses);
router.post('/enroll', enrollCourse);

export default router;

