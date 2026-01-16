// src/services/api.js
import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // must match login storage
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler (optional)
API.interceptors.response.use(
  (res) => {
    // Show success toast for non-GET mutating requests (POST/PUT/PATCH/DELETE)
    try {
      const method = (res.config && res.config.method) || "get";
      if (method && method.toLowerCase() !== "get") {
        const msg = res.data?.message || (res.statusText ? res.statusText : "Success");
        // Only show a toast when there's a meaningful message or a successful status
        if (msg) toast.success(msg);
      }
    } catch (e) {
      // swallow errors from toast handling
      console.debug("Toast success handler error", e);
    }
    return res;
  },
  (err) => {
    // Refresh token flow: when we get 401, try to refresh access token using refresh token
    const originalRequest = err.config;

    // show error toast for non-auth cases
    try {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message || "Request failed";
      // only toast when not an auth/refresh failure (optional)
      if (!(originalRequest && originalRequest.url && originalRequest.url.includes("/auth/refresh"))) {
        toast.error(message);
      }
    } catch (e) {
      console.debug("Toast error handler error", e);
    }

    // If 401 unauthorized, try refreshing
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // No refresh token — clear auth and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        // optional: navigate to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      // queue requests while refreshing
      if (!API._isRefreshing) API._isRefreshing = false;
      if (!API._failedQueue) API._failedQueue = [];

      const processQueue = (error, token = null) => {
        API._failedQueue.forEach((prom) => {
          if (error) prom.reject(error);
          else prom.resolve(token);
        });
        API._failedQueue = [];
      };

      if (API._isRefreshing) {
        return new Promise(function (resolve, reject) {
          API._failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((err2) => Promise.reject(err2));
      }

      API._isRefreshing = true;

      return new Promise(function (resolve, reject) {
        API.post("/auth/refresh", { refreshToken })
          .then((response) => {
            const { accessToken, refreshToken: newRefresh } = response.data;
            if (accessToken) {
              localStorage.setItem("accessToken", accessToken);
            }
            if (newRefresh) {
              localStorage.setItem("refreshToken", newRefresh);
            }

            API.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
            originalRequest.headers.Authorization = "Bearer " + accessToken;
            processQueue(null, accessToken);
            resolve(API(originalRequest));
          })
          .catch((err2) => {
            processQueue(err2, null);
            // optional: clear tokens and redirect to login
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            console.error("Refresh failed", err2);
            reject(err2);
          })
          .finally(() => {
            API._isRefreshing = false;
          });
      });
    }

    console.error("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const fetchDashboardStats = () => API.get("/usersuperadmindashboard/statsstat");
export const fetchRevenueChart = () => API.get("/usersuperadmindashboard/revenue");
export const fetchVisitorChart = () => API.get("/usersuperadmindashboard/visitors");
export const fetchBookingActivity = () => API.get("/usersuperadmindashboard/bookings");
export const fetchRefundSummary = () => API.get("/usersuperadmindashboard/refunds");

export default API;
