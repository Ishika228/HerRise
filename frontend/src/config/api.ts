// Centralized API base URL — reads from Vite env variable on Render/production,
// falls back to localhost for local development.
export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
