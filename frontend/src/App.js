import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DoctorsPage from "./pages/DoctorsPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import AdminPage from "./pages/AdminPage";

import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/doctors" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
              <Route path="/my-appointments" element={<ProtectedRoute><MyAppointmentsPage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
