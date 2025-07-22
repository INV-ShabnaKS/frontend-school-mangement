import React from "react";
import Container from "@mui/material/Container";
import { useAuth } from "../context/AuthContext";

const DashboardHome = () => {
  const { auth } = useAuth();

  if (!auth) return null; 

  return (
    <Container>
      <h1>School Control</h1>
      <h2>
        {auth.role === "Teacher" ? (
          <p>This is the Teacher Dashboard</p>
        ) : auth.role === "Student" ? (
          <p>This is the Student Dashboard</p>
        ) : (
          <p>This is the Admin Dashboard</p>
        )}

      </h2>
    
    </Container>
  );
};

export default DashboardHome;
