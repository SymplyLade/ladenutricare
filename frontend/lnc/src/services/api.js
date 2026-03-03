import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const { origin, hostname } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    return isLocalHost ? 'http://localhost:8000/api' : `${origin}/api`;
  }

  return 'http://localhost:8000/api';
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      // You can also trigger a logout event
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
