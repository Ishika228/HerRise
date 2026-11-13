import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  searchCourses,
  getCoursesByCategory,
  getRecommendedCourses,
  syncCourses,
  saveCourseProgress,
  getCourseProgress,
  getUserAllProgress,
  completeCourse
} from '../controllers/courseController.js';

const router = Router();

// Specialized sub-paths must be declared before parameterized /:id route
router.get('/recommendations', getRecommendedCourses);
router.get('/search', searchCourses);
router.get('/category/:category', getCoursesByCategory);
router.post('/sync', syncCourses);

// Per-user watch progress & completion routes (saved to MongoDB)
router.get('/user-progress', getUserAllProgress);
router.get('/progress/:courseId', getCourseProgress);
router.post('/progress', saveCourseProgress);
router.post('/complete', completeCourse);

// Core catalog listing & detail routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

export default router;
