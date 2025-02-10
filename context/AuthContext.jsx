// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

// Create Context
const AuthContext = createContext();

// Custom hook to access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around your app and provide auth context
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    )
  );

  useEffect(() => {
    console.log("isAuthenticated", localStorage.getItem("token"));
  });
  // Example login function
  const login = () => setIsAuthenticated(true);

  // Example logout function
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
