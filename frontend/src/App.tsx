import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';

// Layouts
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import ClientWallets from './pages/client/Wallets';
import ClientPurchases from './pages/client/Purchases';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorSales from './pages/vendor/Sales';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendors from './pages/admin/Vendors';
import AdminUsers from './pages/admin/Users';
import AdminTags from './pages/admin/Tags';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<PrivateRoute role="Client"><Cart /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute role="Client"><Checkout /></PrivateRoute>} />
              
              {/* Client Routes */}
              <Route path="/client" element={<PrivateRoute role="Client"><ClientDashboard /></PrivateRoute>} />
              <Route path="/client/wallets" element={<PrivateRoute role="Client"><ClientWallets /></PrivateRoute>} />
              <Route path="/client/purchases" element={<PrivateRoute role="Client"><ClientPurchases /></PrivateRoute>} />
              
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
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;