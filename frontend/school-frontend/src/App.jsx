import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import LoginPage from "./pages/Login"; 
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedExamCreate from "./pages/ExamCreate";
import Student from "./pages/Student";
import AddQuestion from "./pages/AddQuestion";
import StudentExam from "./pages/StudentExam";
import ExamPerform from "./pages/ExamPerform";








const App = () => {
  return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="profile" element={<Student />} />
          </Route>
          <Route path="/exams/create" element={<ProtectedExamCreate />} />
          <Route path="/exams/:examId/questions" element={<AddQuestion />} />
          <Route path="/dashboard/exams" element={<StudentExam />} />
          <Route path="/dashboard/exams/:examId/start" element={<ExamPerform />} />


          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
  );
};

export default App;
