// src/api/axios.js

import axios from "axios";

// Create an Axios instance with default configurations
const instance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api`, // Replace with your actual backend URL
  // // Replace with your actual backend URL
  // baseURL: "http://localhost:5000/api", // Replace with your actual backend URL
  // baseURL: /api/v1, // Replace with your actual backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token in headers
instance.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
