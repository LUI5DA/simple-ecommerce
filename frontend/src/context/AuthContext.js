// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();
const authService = 'http://localhost:8081/api/Auth';
const coreApi = 'http://localhost:8080/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.nameid,
          username: decoded.unique_name,
          email: decoded.email,
          role: decoded.role
        });
      } catch (error) {
        console.error('Invalid token');
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(authService + "/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);

      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      });

      // Redirige según el rol
      return data.user.role;

    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
