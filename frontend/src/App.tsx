import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/client/Dashboard';
import ClientWallets from './pages/client/Wallets';
import ClientPurchases from './pages/client/Purchases';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorSales from './pages/vendor/Sales';
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendors from './pages/admin/Vendors';
import AdminUsers from './pages/admin/Users';
import AdminTags from './pages/admin/Tags';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Client Routes */}
            <Route path="/client" element={<PrivateRoute role="Cliente"><ClientDashboard /></PrivateRoute>} />
            <Route path="/client/wallets" element={<PrivateRoute role="Cliente"><ClientWallets /></PrivateRoute>} />
            <Route path="/client/purchases" element={<PrivateRoute role="Cliente"><ClientPurchases /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute role="Cliente"><Checkout /></PrivateRoute>} />
            
            {/* Vendor Routes */}
            <Route path="/vendor" element={<PrivateRoute role="Vendor"><VendorDashboard /></PrivateRoute>} />
            <Route path="/vendor/products" element={<PrivateRoute role="Vendor"><VendorProducts /></PrivateRoute>} />
            <Route path="/vendor/sales" element={<PrivateRoute role="Vendor"><VendorSales /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute role="Admin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/vendors" element={<PrivateRoute role="Admin"><AdminVendors /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute role="Admin"><AdminUsers /></PrivateRoute>} />
            <Route path="/admin/tags" element={<PrivateRoute role="Admin"><AdminTags /></PrivateRoute>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;