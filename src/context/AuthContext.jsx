import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('access');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return token ? { token, username, role } : null;
  });

  const login = async (username, password) => {
    try {
      const response = await api.post(`${import.meta.env.VITE_API_BASE_URL}/login/`, {
        username,
        password,
      });

      const { access, username: uname, role } = response.data;

      localStorage.setItem('access', access);
      localStorage.setItem('username', uname);
      localStorage.setItem('role', role);

      setAuth({ token: access, username: uname, role });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
