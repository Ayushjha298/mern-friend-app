
import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  

export const sendFriendRequest = (to) => API.post("/friends/send", { to });
export const manageFriendRequest = (requestId, action) =>
  API.post("/friends/manage", { requestId, action });
export const getFriendRequests = () => API.get("/friends");


export const getFriendsList = () => API.get("/friends/list");
export const removeFriend = (friendId) => API.post("/friends/remove", { friendId });
export const getFriendRecommendations = () => API.get("/friends/recommendations");


export const searchUsers = (query) => API.get(`/users/search?query=${query}`);