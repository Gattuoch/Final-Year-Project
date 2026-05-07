import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    try {
<<<<<<< HEAD
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingUser(false);
        return;
      }
      // No need to read from localStorage – token is already in api interceptor
      const res = await api.get("/auth/profile");
      if (res.data && res.data.user) {
        setUser(res.data.user);
        // Optionally sync with localStorage (for other parts of the app)
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        // If profile fails, clear stored user
=======
      // Set a timeout of 10 seconds for the request
      const res = await api.get("/auth/profile", { timeout: 10000 });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        setUser(null);
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("User fetch failed", err);
<<<<<<< HEAD
      // If unauthorized, token might be invalid – clear storage
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
=======
      if (err.response?.status === 401) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        setUser(null);
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
      }
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loadingUser,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};