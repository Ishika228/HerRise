import mongoose from 'mongoose';
import { config } from './env.js';

/**
 * Connect to MongoDB database with graceful fallback
 */
export async function connectDatabase(): Promise<boolean> {
  const uri = config.mongoUri;

  if (!uri) {
    console.warn('[MongoDB] No MONGODB_URI configured. Running with in-memory store.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      dbName: config.mongoDbName,
      serverSelectionTimeoutMS: 4000
    });
    console.log(`🍃 [MongoDB] Connected successfully to database: ${config.mongoDbName}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [MongoDB] Connection could not be established (${error.message}).`);
    console.warn(`ℹ️ [MongoDB] The API server continues running normally with the in-memory store.`);
    return false;
  }
}
