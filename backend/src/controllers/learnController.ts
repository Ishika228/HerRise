import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { store } from '../data/mockStore.js';
import { CourseModel } from '../models/CourseModel.js';
import { CourseProgressModel } from '../models/CourseProgressModel.js';
import { DYNAMIC_COURSES_CATALOG } from '../data/coursesCatalog.js';

/**
 * GET /api/learn/courses
 * Fetch courses with optional category, search, and limit filters.
 * Queries MongoDB CourseModel first, falling back to DYNAMIC_COURSES_CATALOG.
 */
export const getCourses = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 30));
    const category = String(req.query.category || '').trim();
    const search = String(req.query.search || req.query.q || '').trim();

    const filter: any = {};
    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(category, 'i');
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { code: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { occupations: new RegExp(search, 'i') }
      ];
    }

    let courses: any[] = [];
    try {
      courses = await CourseModel.find(filter).limit(limit).lean();
    } catch (dbErr: any) {
      console.warn('[learnController:getCourses] DB query fallback:', dbErr.message);
    }

    if (courses && courses.length > 0) {
      return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
      });
    }

    // Dynamic catalog fallback if DB has no matches or is empty
    let fallback = [...DYNAMIC_COURSES_CATALOG];
    if (category && category.toLowerCase() !== 'all') {
      fallback = fallback.filter((c) =>
        c.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (search) {
      const s = search.toLowerCase();
      fallback = fallback.filter(
        (c) =>
          c.title.toLowerCase().includes(s) ||
          c.code.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s)
      );
    }

    const data = fallback.slice(0, limit);
    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve courses',
      details: error.message
    });
  }
};

/**
 * POST /api/learn/enroll
 * Enroll a user in a course and initialize their progress in CourseProgressModel.
 * Resolves course by code or ID from MongoDB, dynamic catalog, or memory store.
 */
export const enrollCourse = async (req: Request, res: Response) => {
  try {
    const { courseId, userEmail, userId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: 'courseId is required to enroll'
      });
    }

    const cleanCourseId = String(courseId).trim();
    let course: any = null;

    // 1. Check MongoDB CourseModel by code or _id
    try {
      const orConditions: any[] = [{ code: cleanCourseId }];
      if (mongoose.isValidObjectId(cleanCourseId)) {
        orConditions.push({ _id: cleanCourseId });
      }
      course = await CourseModel.findOne({ $or: orConditions }).lean();
    } catch {}

    // 2. Check dynamic catalog fallback
    if (!course) {
      course = DYNAMIC_COURSES_CATALOG.find(
        (c) => c.code.toLowerCase() === cleanCourseId.toLowerCase()
      );
    }

    // 3. Check in-memory mockStore
    if (!course) {
      course = store.courses.find(
        (c: any) => c.id === cleanCourseId || c.code === cleanCourseId
      );
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course "${cleanCourseId}" not found in catalog or database`
      });
    }

    // 4. If userEmail is provided, initialize or load progress in CourseProgressModel
    let userProgress: any = null;
    const emailNorm = String(userEmail || '').toLowerCase().trim();

    if (emailNorm) {
      try {
        const firstModuleTitle =
          course.unitsOfCompetency?.[0]?.title ||
          'Orientation & Core Competencies';

        userProgress = await CourseProgressModel.findOneAndUpdate(
          { userEmail: emailNorm, courseId: course.code || cleanCourseId },
          {
            $setOnInsert: {
              userEmail: emailNorm,
              userId: userId || '',
              courseId: course.code || cleanCourseId,
              courseTitle: course.title,
              currentModuleIndex: 0,
              currentModuleTitle: firstModuleTitle,
              currentTimeSeconds: 0,
              durationSeconds: 3600,
              completedModuleIds: [],
              progressPercent: 0,
              isCompleted: false,
              lastWatchedAt: new Date()
            }
          },
          { new: true, upsert: true }
        );
      } catch (err: any) {
        console.warn('[learnController:enrollCourse] Progress tracking note:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Enrolled in "${course.title}". Progress tracker initialized.`,
      data: {
        code: course.code || cleanCourseId,
        title: course.title,
        qualificationLevel: course.qualificationLevel,
        category: course.category,
        durationEstimate: course.durationEstimate,
        unitsCount: course.unitsCount || course.unitsOfCompetency?.length || 0,
        enrolledCount: (course.enrolledCount || 0) + 1,
        progress: userProgress || {
          progressPercent: 0,
          currentModuleIndex: 0,
          currentModuleTitle: 'Orientation & Core Competencies',
          isCompleted: false
        }
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to enroll in course',
      details: error.message
    });
  }
};
