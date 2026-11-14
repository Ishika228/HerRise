import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { seedMongoIfEmpty } from './services/seedDatabase.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import learnRoutes from './routes/learnRoutes.js';
import networkRoutes from './routes/networkRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import { syncAustralianQualifications } from './services/courseSyncService.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      const allowed = [
        config.clientUrl,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174'
      ].filter(Boolean);
      // Allow any *.onrender.com subdomain for Render deployments
      if (allowed.includes(origin) || /\.onrender\.com$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // permissive for now, tighten per env if needed
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  const mongoStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HerRise AI Backend API Service',
    version: '1.0.0',
    environment: config.nodeEnv,
    database: {
      type: 'mongodb',
      status: mongoStatusMap[mongoose.connection.readyState] || 'disconnected',
      dbName: config.mongoDbName
    },
    ai: {
      groqConnected: !!config.groqApiKey
    }
  });
});

// Mount Module Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/network', networkRoutes);

// Serve compiled React frontend in production if dist exists
const frontendDist = path.resolve(process.cwd(), 'frontend/dist');
const altFrontendDist = path.resolve(__dirname, '../../frontend/dist');
const activeDist = fs.existsSync(frontendDist) ? frontendDist : (fs.existsSync(altFrontendDist) ? altFrontendDist : null);

if (activeDist) {
  app.use(express.static(activeDist));
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(activeDist, 'index.html'));
  });
}

// 404 Route Handler for unmatched API routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, '0.0.0.0', async () => {
    console.log(`=========================================`);
    console.log(`🌸 HerRise AI Backend API Server`);
    console.log(`🚀 Live on: http://0.0.0.0:${config.port}`);
    console.log(`🩺 Health check: http://0.0.0.0:${config.port}/api/health`);
    console.log(`=========================================`);

    // Initialize MongoDB connection & seed initial data
    const connected = await connectDatabase();
    if (connected) {
      await seedMongoIfEmpty();
      try {
        const { CourseModel } = await import('./models/CourseModel.js');
        const count = await CourseModel.countDocuments();
        if (count === 0) {
          console.log('🔄 Initializing Australian Training Qualifications synchronization...');
          await syncAustralianQualifications();
          console.log('✅ Australian Training Qualifications synchronized into MongoDB Atlas.');
        }
      } catch (err: any) {
        console.warn('⚠️ Course sync note:', err.message);
      }
    }
  });
}

export default app;

