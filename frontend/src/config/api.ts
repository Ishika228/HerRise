// Centralized API base URL — reads from Vite env variable on Render/production,
// falls back to relative origin in production (unified host) or localhost:5000 for local development.
export const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? '' : 'http://localhost:5000');

