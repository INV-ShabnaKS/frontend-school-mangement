import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();


  if (!auth?.token && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
