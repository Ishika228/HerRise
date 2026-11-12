import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './env.js';

// Ensure DNS can resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where custom DNS is restricted
}

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
      dbName: config.mongoDbName || 'HerRise',
      serverSelectionTimeoutMS: 8000
    });
    console.log(`🍃 [MongoDB] Connected successfully to Atlas database: ${config.mongoDbName || 'HerRise'}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [MongoDB] Connection could not be established (${error.message}).`);
    console.warn(`ℹ️ [MongoDB] The API server continues running normally with the in-memory store.`);
    return false;
  }
}

