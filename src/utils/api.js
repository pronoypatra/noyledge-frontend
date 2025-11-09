import axios from "axios";

// Get base URL from environment variable or use default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 second timeout
});

console.log("API Base URL:", `${API_BASE_URL}/api`);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Only set header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // just in case
  }

  return config;
});

// Response interceptor to handle 401 errors (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      // Redirect to login page
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
