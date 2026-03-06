import axios from 'axios';

const DEFAULT_PROD_API_BASE_URL = 'https://ladenutricare-22.onrender.com/api';

const resolveApiBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (envUrl) return envUrl.replace(/\/+$/, '');

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    return isLocalHost ? 'http://localhost:8000/api' : DEFAULT_PROD_API_BASE_URL;
  }

  return DEFAULT_PROD_API_BASE_URL;
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to every request
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

// Response interceptor - handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
