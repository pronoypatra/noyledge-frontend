import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`, // dynamic based on env
});
console.log("API base URL:", process.env.REACT_APP_API_BASE_URL);

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // change if backend is hosted
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ✅ Only set header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // just in case
  }

  return config;
});

export default api;
