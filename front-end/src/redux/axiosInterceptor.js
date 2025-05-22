
import axios from 'axios';
import Cookies from 'js-cookie';


export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('User Request Error:', error);
    return Promise.reject(error);
  }
);




export const adminAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add admin token to request headers
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = Cookies.get('adminToken');
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Admin Request Error:', error);
    return Promise.reject(error);
  }
);
