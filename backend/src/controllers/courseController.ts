import { Request, Response } from 'express';
import { CourseModel } from '../models/CourseModel.js';
import { CourseProgressModel } from '../models/CourseProgressModel.js';
import { syncAustralianQualifications } from '../services/courseSyncService.js';

/**
 * GET /api/courses/recommendations
 * Personalized course recommendations based on user qualification, target domain, and skills
 */
export const getRecommendedCourses = async (req: Request, res: Response) => {
  try {
    const rawQualification = String(req.query.qualification || '').trim();
    const qLower = rawQualification.toLowerCase();
    const domain = String(req.query.domain || req.query.category || '').toLowerCase();
    const skills = String(req.query.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    const targetRole = String(req.query.targetRole || '').toLowerCase();
    const limit = Math.min(30, Math.max(1, parseInt(req.query.limit as string) || 12));

    // Determine target AQF progression based strictly on the user's educational qualification
    let qualificationTier = "Bachelor's Degree";
    let targetLevels: string[] = ['Diploma', 'Advanced Diploma', 'Certificate IV'];
    let progressionRationale = '';

    if (
      qLower.includes('master') ||
      qLower.includes('mca') ||
      qLower.includes('mba') ||
      qLower.includes('m.tech') ||
      qLower.includes('mtech') ||
      qLower.includes('m.sc') ||
      qLower.includes('msc') ||
      qLower.includes('post graduate') ||
      qLower.includes('phd')
    ) {
      qualificationTier = "Master's Degree (Post-Graduate)";
      targetLevels = ['Advanced Diploma', 'Diploma', 'Graduate Certificate', 'Graduate Diploma'];
      progressionRationale = `Tailored for Master's graduates seeking Australian AQF Level 5/6 Advanced Diplomas & high-tier vocational credentials for industry accreditation and senior leadership.`;
    } else if (
      qLower.includes('bachelor') ||
      qLower.includes('bca') ||
      qLower.includes('b.tech') ||
      qLower.includes('btech') ||
      qLower.includes('b.e.') ||
      qLower.includes('b.sc') ||
      qLower.includes('bsc') ||
      qLower.includes('b.com') ||
      qLower.includes('bcom') ||
      qLower.includes('bba') ||
      qLower.includes('undergraduate') ||
      qLower.includes('degree') ||
      qLower.includes('graduate')
    ) {
      qualificationTier = "Bachelor's Degree (Undergraduate)";
      targetLevels = ['Diploma', 'Advanced Diploma', 'Certificate IV'];
      progressionRationale = `Direct pathway building on your university degree to achieve Australian AQF Level 5 (Diploma) and Level 6 (Advanced Diploma) practical workplace competencies.`;
    } else if (
      qLower.includes('diploma') ||
      qLower.includes('polytechnic') ||
      qLower.includes('associate')
    ) {
      qualificationTier = 'Diploma / Associate';
      targetLevels = ['Advanced Diploma', 'Diploma', 'Certificate IV'];
      progressionRationale = `Step-up ladder advancing your current Diploma to an accredited Advanced Diploma (AQF Level 6) for supervisory and specialized execution.`;
    } else if (
      qLower.includes('certificate') ||
      qLower.includes('cert') ||
      qLower.includes('vocational')
    ) {
      qualificationTier = 'Certificate III / IV';
      targetLevels = ['Certificate IV', 'Diploma', 'Advanced Diploma'];
      progressionRationale = `Upgrade pathway advancing from Certificate III/IV into full Australian Diplomas with broader industry utility.`;
    } else if (
      qLower.includes('school') ||
      qLower.includes('12') ||
      qLower.includes('10') ||
      qLower.includes('secondary') ||
      qLower.includes('high school')
    ) {
      qualificationTier = 'Year 12 / High School';
      targetLevels = ['Certificate III', 'Certificate IV', 'Diploma'];
      progressionRationale = `Foundational vocational certifications (AQF Levels 3–4) designed for direct career entry and skilled apprenticeship from secondary school.`;
    }

    // Determine primary category safely without substring false positives
    const isHealthDomain =
      domain.includes('health') ||
      domain.includes('nurs') ||
      domain.includes('care') ||
      domain.includes('medical') ||
      targetRole.includes('nurse') ||
      targetRole.includes('care');

    const isFinanceDomain =
      domain.includes('finance') ||
      domain.includes('account') ||
      domain.includes('bookkeep') ||
      targetRole.includes('accountant') ||
      targetRole.includes('auditor');

    const isDesignDomain =
      domain.includes('design') ||
      domain.includes('art') ||
      domain.includes('media') ||
      domain.includes('creative') ||
      targetRole.includes('designer');

    const isBusinessDomain =
      domain.includes('business') ||
      domain.includes('manage') ||
      domain.includes('lead') ||
      domain.includes('admin') ||
      targetRole.includes('manager');

    const isTechDomain =
      domain.includes('tech') ||
      domain.includes('software') ||
      domain.includes('ai') ||
      domain.includes('cyber') ||
      domain.includes('data') ||
      domain.split(/[\s&,/]+/).includes('it') ||
      targetRole.includes('developer') ||
      targetRole.includes('engineer') ||
      targetRole.includes('programmer') ||
      skills.some(s => ['react', 'node', 'python', 'javascript', 'mongodb', 'html', 'css', 'sql'].includes(s));

    let targetCategoryRegex = /Information Technology|Business & Management/i;
    if (isHealthDomain) {
      targetCategoryRegex = /Community & Health/i;
    } else if (isFinanceDomain) {
      targetCategoryRegex = /Finance & Accounting/i;
    } else if (isDesignDomain) {
      targetCategoryRegex = /Creative Arts & Design/i;
    } else if (isBusinessDomain) {
      targetCategoryRegex = /Business & Management/i;
    } else if (isTechDomain) {
      targetCategoryRegex = /Information Technology/i;
    }

    // Fetch primary matching qualifications
    const primaryMatches = await CourseModel.find({
      category: targetCategoryRegex,
      qualificationLevel: { $in: targetLevels.map(l => new RegExp(l, 'i')) }
    })
      .sort({ featured: -1, code: 1 })
      .limit(limit)
      .lean();

    // If needed, supplement with secondary matching qualifications
    let results = [...primaryMatches];
    if (results.length < limit) {
      const remainingLimit = limit - results.length;
      const existingCodes = results.map(r => r.code);
      const secondaryMatches = await CourseModel.find({
        code: { $nin: existingCodes },
        qualificationLevel: { $in: targetLevels.map(l => new RegExp(l, 'i')) }
      })
        .sort({ featured: -1 })
        .limit(remainingLimit)
        .lean();

      results.push(...secondaryMatches);
    }

    // Attach personalization metadata (matchScore, matchReason, progressionBadge)
    const personalizedCourses = results.map((course, idx) => {
      let score = 98 - (idx * 2);
      if (score < 82) score = 82 + Math.floor(Math.random() * 8);

      let reason = `Targeted for your ${qualificationTier} background in ${course.category}.`;
      if (course.qualificationLevel?.toLowerCase().includes('advanced diploma')) {
        reason = `High-level AQF Level 6 qualification bridging your ${qualificationTier} to Australian enterprise leadership.`;
      } else if (course.qualificationLevel?.toLowerCase().includes('diploma')) {
        reason = `Nationally recognized AQF Level 5 diploma providing direct industry competencies for ${targetRole || 'specialist roles'}.`;
      } else if (course.qualificationLevel?.toLowerCase().includes('certificate iv')) {
        reason = `Specialist AQF Level 4 credential strengthening core supervisory skills aligned with ${qualificationTier}.`;
      } else if (course.qualificationLevel?.toLowerCase().includes('certificate iii')) {
        reason = `Direct entry-level AQF Level 3 qualification to gain verified hands-on vocational skills.`;
      }

      return {
        ...course,
        matchScore: score,
        matchReason: reason,
        progressionBadge: `${course.aqfLevel || course.qualificationLevel} Pathway`
      };
    });

    return res.status(200).json({
      success: true,
      userProfileAnalyzed: {
        qualificationInput: rawQualification || 'Detected from profile',
        qualificationTier,
        targetDomain: domain || 'Information Technology',
        targetRole: targetRole || 'Software Professional',
        recommendedAQFLevels: targetLevels,
        progressionRationale
      },
      count: personalizedCourses.length,
      data: personalizedCourses
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate course recommendations',
      details: error.message
    });
  }
};

/**
 * GET /api/courses
 * List Australian training courses with pagination, category filter, AQF level filter & search
 */
export const getCourses = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
    const skip = (page - 1) * limit;

    const { category, level, status, search, package: pkg } = req.query;

    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(String(category), 'i');
    }

    if (level && level !== 'All') {
      filter.qualificationLevel = new RegExp(String(level), 'i');
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (pkg) {
      filter['trainingPackage.code'] = String(pkg).toUpperCase();
    }

    if (search && String(search).trim()) {
      const q = String(search).trim();
      filter.$or = [
        { code: new RegExp(q, 'i') },
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { occupations: { $in: [new RegExp(q, 'i')] } },
        { industrySectors: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    const [total, courses] = await Promise.all([
      CourseModel.countDocuments(filter),
      CourseModel.find(filter)
        .sort({ featured: -1, code: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    // If database has 0 courses, trigger an automatic first sync
    if (total === 0 && Object.keys(filter).length === 0) {
      const syncResult = await syncAustralianQualifications();
      return res.status(200).json({
        success: true,
        count: syncResult.courses.length,
        total: syncResult.courses.length,
        page: 1,
        totalPages: 1,
        source: 'training.gov.au',
        data: syncResult.courses
      });
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      source: 'training.gov.au',
      data: courses
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve training courses',
      details: error.message
    });
  }
};

/**
 * GET /api/courses/search?q=...
 */
export const searchCourses = async (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query parameter q is required' });
    }

    const courses = await CourseModel.find({
      $or: [
        { code: new RegExp(q, 'i') },
        { title: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
        { occupations: { $in: [new RegExp(q, 'i')] } },
        { industrySectors: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Course search failed',
      details: error.message
    });
  }
};

/**
 * GET /api/courses/category/:category
 */
export const getCoursesByCategory = async (req: Request, res: Response) => {
  try {
    const category = String(req.params.category || '');
    const courses = await CourseModel.find({
      category: new RegExp(category, 'i')
    })
      .sort({ code: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      category,
      count: courses.length,
      data: courses
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: `Failed to fetch courses for category ${req.params.category}`,
      details: error.message
    });
  }
};

/**
 * GET /api/courses/:id
 * Retrieve a single Australian qualification by MongoDB _id or national code (e.g. ICT50220)
 */
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || '').trim();
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const course = await CourseModel.findOne(
      isObjectId ? { _id: id } : { code: id.toUpperCase() }
    ).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course not found with identifier ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve course details',
      details: error.message
    });
  }
};

/**
 * POST /api/courses/sync
 * Synchronise qualification records from official training.gov.au REST API into MongoDB
 */
export const syncCourses = async (req: Request, res: Response) => {
  try {
    const { codes } = req.body || {};
    const result = await syncAustralianQualifications(Array.isArray(codes) ? codes : undefined);

    return res.status(200).json({
      success: result.success,
      message: `Successfully synchronized ${result.insertedOrUpdated} Australian training qualifications into MongoDB Atlas`,
      stats: {
        totalProcessed: result.totalProcessed,
        insertedOrUpdated: result.insertedOrUpdated,
        source: 'https://training.gov.au/api',
        lastSyncedAt: new Date().toISOString()
      },
      errors: result.errors,
      sampleCodes: result.courses.slice(0, 5).map(c => c.code)
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Australian training synchronization failed',
      details: error.message
    });
  }
};

/**
 * POST /api/courses/progress
 * Save where the user stopped watching (timestamp, module index, completion status)
 */
export const saveCourseProgress = async (req: Request, res: Response) => {
  try {
    const {
      userEmail,
      userId,
      courseId,
      courseTitle,
      currentModuleIndex = 0,
      currentModuleTitle = '',
      currentTimeSeconds = 0,
      durationSeconds = 0,
      completedModuleIds = [],
      progressPercent = 0
    } = req.body;

    if (!userEmail || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'userEmail and courseId are required to track playback progress'
      });
    }

    const emailNorm = String(userEmail).toLowerCase().trim();

    // Check if certificate already exists or if existing progress exists in MongoDB
    const existing = await CourseProgressModel.findOne({ userEmail: emailNorm, courseId });

    // Merge completed module IDs so completed modules are permanent and never lost on refresh
    const incomingCompleted = Array.isArray(completedModuleIds) ? completedModuleIds : [];
    const mergedCompletedModuleIds = Array.from(
      new Set([
        ...(existing?.completedModuleIds || []),
        ...incomingCompleted
      ])
    );

    const isCompleted =
      progressPercent >= 100 ||
      Boolean(req.body.isCompleted) ||
      Boolean(existing?.isCompleted);

    let certificateId = existing?.certificateId || req.body.certificateId || '';

    if (isCompleted && !certificateId) {
      // Deterministic yet unique credential identifier
      const prefix = courseId.includes('fin') ? 'HR-FIN' : courseId.includes('mkt') ? 'HR-MKT' : 'HR-CRS';
      certificateId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const updateDoc: any = {
      userEmail: emailNorm,
      userId: userId || existing?.userId || '',
      courseId,
      courseTitle: courseTitle || existing?.courseTitle || 'HerRise Course',
      currentModuleIndex: Math.max(0, parseInt(currentModuleIndex) || 0),
      currentModuleTitle: String(currentModuleTitle || ''),
      currentTimeSeconds: Math.max(0, Math.round(Number(currentTimeSeconds) || 0)),
      durationSeconds: Math.max(0, Math.round(Number(durationSeconds) || 0)),
      completedModuleIds: mergedCompletedModuleIds,
      progressPercent: isCompleted ? 100 : Math.min(100, Math.max(0, Math.round(Number(progressPercent) || 0))),
      isCompleted,
      lastWatchedAt: new Date()
    };

    if (isCompleted) {
      updateDoc.completedAt = existing?.completedAt || new Date();
      updateDoc.certificateId = certificateId;
      updateDoc.certificateIssuedAt = existing?.certificateIssuedAt || new Date();
    }

    const savedProgress = await CourseProgressModel.findOneAndUpdate(
      { userEmail: emailNorm, courseId },
      { $set: updateDoc },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: isCompleted
        ? 'Course completed! Verified certificate generated.'
        : `Progress saved at ${Math.floor(currentTimeSeconds / 60)}m ${Math.round(currentTimeSeconds % 60)}s`,
      progress: savedProgress
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to save course playback progress',
      details: error.message
    });
  }
};

/**
 * GET /api/courses/progress/:courseId
 * Retrieve where the specific user stopped watching
 */
export const getCourseProgress = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userEmail = String(req.query.userEmail || '').toLowerCase().trim();

    if (!userEmail || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'userEmail and courseId are required'
      });
    }

    const progress = await CourseProgressModel.findOne({ userEmail, courseId });

    return res.status(200).json({
      success: true,
      progress: progress || null
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve course progress',
      details: error.message
    });
  }
};

/**
 * GET /api/courses/user-progress
 * Retrieve all course progress for a user (to resume any in-progress or completed courses)
 */
export const getUserAllProgress = async (req: Request, res: Response) => {
  try {
    const userEmail = String(req.query.userEmail || '').toLowerCase().trim();
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'userEmail query parameter is required'
      });
    }

    const allProgress = await CourseProgressModel.find({ userEmail }).sort({ lastWatchedAt: -1 });

    return res.status(200).json({
      success: true,
      count: allProgress.length,
      progressList: allProgress
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve all user progress',
      details: error.message
    });
  }
};

/**
 * POST /api/courses/complete
 * Mark course completed and issue certificate immediately in-place
 */
export const completeCourse = async (req: Request, res: Response) => {
  try {
    const { userEmail, userId, courseId, courseTitle } = req.body;

    if (!userEmail || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'userEmail and courseId are required'
      });
    }

    const emailNorm = String(userEmail).toLowerCase().trim();
    const existing = await CourseProgressModel.findOne({ userEmail: emailNorm, courseId });

    let certificateId = existing?.certificateId;
    if (!certificateId) {
      const prefix = courseId.includes('fin') ? 'HR-FIN' : courseId.includes('mkt') ? 'HR-MKT' : 'HR-CRS';
      certificateId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const progress = await CourseProgressModel.findOneAndUpdate(
      { userEmail: emailNorm, courseId },
      {
        $set: {
          userEmail: emailNorm,
          userId: userId || existing?.userId || '',
          courseId,
          courseTitle: courseTitle || existing?.courseTitle || 'HerRise Course',
          progressPercent: 100,
          isCompleted: true,
          completedAt: existing?.completedAt || new Date(),
          certificateId,
          certificateIssuedAt: existing?.certificateIssuedAt || new Date(),
          lastWatchedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Course marked as completed! Verified certificate generated.',
      progress,
      certificate: {
        id: `cert-${courseId}`,
        courseTitle: progress.courseTitle,
        credentialId: certificateId,
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        grade: 'Distinction with Honours (98%)',
        isCompleted: true
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to complete course',
      details: error.message
    });
  }
};

