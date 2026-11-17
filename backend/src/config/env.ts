import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in backend/ directory first, then root/current working directory
const candidates = [
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '..', '.env')
];

for (const envPath of candidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'herrise_secret_key_default',
  groqApiKey: process.env.GROQ_API_KEY || '',
  jobdataApiKey: process.env.JOBDATA_API_KEY || process.env.JDL_API_KEY || '',
  digitalServicesAdminToken: process.env.DIGITAL_SERVICES_ADMIN_TOKEN || '',
  digitalServicesWhatsapp: (process.env.DIGITAL_SERVICES_WHATSAPP || '').replace(/\D/g, ''),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/herrise_db',
  mongoDbName: process.env.MONGODB_DB_NAME || 'herrise_db',
  startupDbApiBase: process.env.STARTUPDB_API_BASE || 'https://startupdb.com/api/v1',
  edenAiApiKey: process.env.EDENAI_API_KEY || process.env.EDEN_AI_API_KEY || process.env.RESUME_ANALYZER_API_KEY || ''
};

