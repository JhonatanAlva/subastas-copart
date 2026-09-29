import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const token = localStorage.getItem("token");

  // Si no hay usuario ni token, redirige al login
  if (!currentUser && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
