import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
<<<<<<< HEAD
  timeout: 60000, // 60 seconds (giving enough time for AI Generation)
=======
  timeout: 10000,
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
<<<<<<< HEAD
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signUp" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
=======
      window.location.href = "/login";
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
    }
    return Promise.reject(error);
  }
);

export default api;