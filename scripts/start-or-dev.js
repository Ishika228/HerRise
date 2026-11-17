const { execSync } = require('child_process');

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;

if (isProduction) {
  console.log('🚀 [HerRise Runner] Production environment detected. Starting Express backend server...');
  execSync('node backend/dist/server.js', { stdio: 'inherit' });
} else {
  console.log('⚡ [HerRise Runner] Development environment detected. Starting frontend development server...');
  execSync('npm --prefix frontend run dev', { stdio: 'inherit' });
}
