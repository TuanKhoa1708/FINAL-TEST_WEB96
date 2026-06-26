import axios from 'axios';

const axiosInstance = axios.create({
  // Empty baseURL = relative paths → Vite proxy forwards to http://localhost:3000
  // This avoids CORS entirely in dev. For production, set VITE_API_URL env var.
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Response interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
