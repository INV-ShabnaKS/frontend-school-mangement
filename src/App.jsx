// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import LoginPage from "./pages/Login"; 
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";




const App = () => {
  return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="students" element={<StudentsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
  );
};

export default App;
