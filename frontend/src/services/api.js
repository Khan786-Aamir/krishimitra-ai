import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // 30 seconds for longer Gemini calls
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into headers dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized token expirations)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errMessage = error.response?.data?.error?.message || error.message || 'Network error occurred';
    
    // Handle session expirations globally
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login';
    }

    console.error('Axios API Error:', errMessage);
    return Promise.reject(error.response?.data || { success: false, error: { message: errMessage } });
  }
);

export default api;
