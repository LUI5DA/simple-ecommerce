import axios from 'axios';

// Create axios instances
export const authApi = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const coreApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
const addTokenToRequest = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addTokenToRequest);
coreApi.interceptors.request.use(addTokenToRequest);

// Response interceptor for handling errors
const handleResponse = (response: any) => {
  return response;
};

const handleError = (error: any) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(handleResponse, handleError);
coreApi.interceptors.response.use(handleResponse, handleError);

export default {
  authApi,
  coreApi,
};