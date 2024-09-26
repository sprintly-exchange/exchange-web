// src/axiosConfig.js

import axios from 'axios';


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`, // Replace with your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = sessionStorage.getItem('token');
    if (token) {
      // If token exists, set it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Optionally, you can add a response interceptor as well
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    return Promise.reject(error);
  }
);

export default axiosInstance;
