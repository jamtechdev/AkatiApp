import axios from 'axios';
import {store} from '../_store';
import Config from '../_constant/Config';
const {API_URL} = Config;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  config => {
    const state = store.getState();
    const token =
      state.auth.token ||
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZmV1cHNvbnRlYy5jb21cL2FwaVwvY3VzdG9tZXJcL3NpZ24taW4iLCJpYXQiOjE3MjI0ODg4ODMsImV4cCI6MTc1NDAyNDg4MywibmJmIjoxNzIyNDg4ODgzLCJqdGkiOiJKS2xYRHpUek9DRXFvc3R2Iiwic3ViIjoxMzMsInBydiI6IjhiNDIyZTZmNjU3OTMyYjhhZWJjYjFiZjFlMzU2ZGQ3NmEzNjViZjIifQ.LOp0EH1wn48SXmJ_4ndE2UGioUKTH6yvYeckuQz5VE0';
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
