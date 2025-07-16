import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Typography, Container, Paper } from "@mui/material";
import Header from "../components/Header"; 

const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Dashboard!
          </Typography>
          <Typography variant="body1">
            Hello, <strong>{auth?.username}</strong>. You have successfully logged in.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;
