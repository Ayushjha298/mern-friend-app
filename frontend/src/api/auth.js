import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-friend-app-backend-gkrw.onrender.com/api",
});

// const API = axios.create({
  //   baseURL: "http://localhost:5000/api",
  // });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (userData) => API.post("/auth/signup", userData);
export const login = (userData) => API.post("/auth/login", userData);
