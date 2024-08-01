import axios from 'axios';
import {store} from '../_store';
import {API_URL} from '../_constant';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state.auth.token;
    const language = state.auth.language;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['language'] = language;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
