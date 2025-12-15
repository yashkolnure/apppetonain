import React from "react";
import { Navigate, useParams } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const { id } = useParams(); // restaurant id from URL
  const token = localStorage.getItem("token");

  // ❌ No restaurant ID
  if (!id) {
    return <Navigate to="/" replace />;
  }

  // ❌ No token or expired token
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  // ✅ All good
  return children;
};

export default ProtectedRoute;
