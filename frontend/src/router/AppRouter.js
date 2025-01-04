import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import FriendListPage from "../pages/FriendListPage";
import FriendRequestsPage from "../pages/FriendRequestsPage";
import RecommendationPage from "../pages/FriendRecommendations";


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/friends-list" element={<FriendListPage />} />
        <Route path="/friend-requests" element={<FriendRequestsPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />

      </Routes>
    </Router>
  );
}

export default AppRouter;
