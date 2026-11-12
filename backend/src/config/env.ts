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
  groqApiKey: process.env.GROQ_API_KEY || ''
};

