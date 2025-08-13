// src/services/apiService.js
import axios from 'axios';

// FIXED: Changed port from 8082 to 8080 to match Spring Boot config
const BASE_URL = 'http://3.111.29.34:8080/api/v1';

// Create axios instance with base configuration
const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout for better error handling
});

// Request interceptor to add JWT token to requests
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url); // Debug logging
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiService.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status); // Debug logging
    return response;
  },
  (error) => {
    console.error('Response error:', error); // Debug logging
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.message === 'Network Error') {
      console.error('Network error - check CORS and backend availability');
    }
    
    return Promise.reject(error);
  }
);

// JWT Helper Functions
export const jwtHelper = {
  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('jwtToken');
  },
  
  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem('jwtToken');
  },
  
  // Check if token exists
  hasToken: () => {
    return !!localStorage.getItem('jwtToken');
  },
  
  // Basic JWT decode function (you might want to use jwt-decode library instead)
  decodeToken: (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },
  
  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = jwtHelper.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
  
  // Get user email from token
  getUserEmail: () => {
    try {
      const token = jwtHelper.getToken();
      if (!token) return null;
      const decoded = jwtHelper.decodeToken(token);
      return decoded?.sub || decoded?.email || null;
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }
};

// Authentication API calls
export const authAPI = {
  register: (userData) => apiService.post('/user/register', userData),
  login: (credentials) => apiService.post('/user/login', credentials),
  
  // Password reset functionality
  forgotPassword: (email) => apiService.post('/user/forgot-password', { email }),
  resetPassword: (resetData) => apiService.post('/user/reset-password', resetData),
  validateResetToken: (token) => apiService.get('/user/validate-reset-token', { params: { token } }),
  
  // Get current user info from token
  getCurrentUser: () => {
    const token = jwtHelper.getToken();
    if (!token) return null;
    return jwtHelper.decodeToken(token);
  }
};

// Task API calls
export const taskAPI = {
  createTask: (taskData) => apiService.post('/tasks/create-task', taskData),
  getAllTasks: () => apiService.get('/tasks/all-tasks'),
  getTodaysTasks: () => apiService.get('/tasks/today'),
  deleteTask: (taskId) => apiService.delete(`/tasks/delete/${taskId}`),
  updateTask: (taskId, updateData) => apiService.put(`/tasks/${taskId}`, updateData),
  
  // Get tasks for specific user (if needed)
  getTasksByUser: (email) => apiService.get(`/tasks/user/${email}`),
};

// User API calls
export const userAPI = {
  // Get user profile
  getProfile: () => apiService.get('/user/profile'),
  
  // Update user profile
  updateProfile: (userData) => apiService.put('/user/profile', userData),
  
  // Change password
  changePassword: (passwordData) => apiService.put('/user-update/change-password', passwordData),
};

export default apiService;