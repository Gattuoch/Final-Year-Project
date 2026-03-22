// src/services/api.js
import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ 1. Token Interceptor (Matches your login logic)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 2. Error Interceptor (Handles 401 Logout)
API.interceptors.response.use(
  (res) => {
    // Show success toast for mutating requests
    try {
      const method = (res.config && res.config.method) || "get";
      if (method && method.toLowerCase() !== "get") {
        const msg = res.data?.message || (res.statusText ? res.statusText : "Success");
        if (msg) toast.success(msg);
      }
    } catch (e) {
      console.debug("Toast handler error", e);
    }
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // Show error toast (excluding auth checks)
    try {
      const message = err.response?.data?.message || "Request failed";
      // Don't toast on refresh check failures to keep UI clean
      if (!originalRequest?.url?.includes("/auth/refresh")) {
        toast.error(message);
      }
    } catch (e) {
      console.debug("Toast error", e);
    }

    // Handle 401 (Unauthorized)
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear session
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

// ✅ 3. THE FIX: CHANGED "/user" TO "/users" (PLURAL)
// This matches: app.use("/api/users", userRoutes) in server.js
export const fetchDashboardStats = () => API.get("/users/super-admin/dashboard/stats");
export const fetchRevenueChart = () => API.get("/users/super-admin/dashboard/revenue");
export const fetchVisitorChart = () => API.get("/users/super-admin/dashboard/visitors");
export const fetchBookingActivity = () => API.get("/users/super-admin/dashboard/bookings");
export const fetchRefundSummary = () => API.get("/users/super-admin/dashboard/refunds");

export default API;