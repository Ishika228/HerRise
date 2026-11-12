import { Request, Response } from 'express';
import { store } from '../data/mockStore.js';

export const getCourses = (req: Request, res: Response) => {
  return res.status(200).json({ success: true, count: store.courses.length, data: store.courses });
};

export const enrollCourse = (req: Request, res: Response) => {
  const { courseId } = req.body;
  const course = store.courses.find((c) => c.id === courseId);

  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  course.enrolledCount += 1;

  return res.status(200).json({
    success: true,
    message: `Enrolled in "${course.title}". Progress tracker initialized.`,
    data: course
  });
};
