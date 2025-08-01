// Estructura base del frontend con autenticación JWT

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginRegister/LoginPage';
import RegisterPage from './pages/LoginRegister/RegisterPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import ClientDashboard from './pages/Client/ClientDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home/HomePage';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
      <Router>
        <AuthProvider>
          <Header showMenu={true} />
          <main>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/vendor"
                element={
                  <ProtectedRoute role="Vendor">
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/client"
                element={
                  <ProtectedRoute role="Client">
                    <ClientDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer/>
        </AuthProvider>
      </Router>
  );
}

export default App;
