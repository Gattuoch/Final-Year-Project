import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUser = async () => {
    try {
      // No need to read from localStorage – token is already in api interceptor
      const res = await api.get("/auth/profile");
      if (res.data && res.data.user) {
        setUser(res.data.user);
        // Optionally sync with localStorage (for other parts of the app)
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        // If profile fails, clear stored user
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("User fetch failed", err);
      // If unauthorized, token might be invalid – clear storage
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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