import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/doctors" replace />;
  return children;
}
