import { useState } from 'react'
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; 
import './App.css'
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {

  return (

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/Login" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      </Routes>
   
  );
};

export default App;
