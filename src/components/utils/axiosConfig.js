import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your API base URL
});

console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from session storage
    const token = sessionStorage.getItem('token');
    if (token) {
      // If token exists, set it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Check if the error response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Redirect to the home page for login
      window.location.href = '/home';
    }
    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
