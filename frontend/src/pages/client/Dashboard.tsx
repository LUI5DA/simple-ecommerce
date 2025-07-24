import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ClientDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Client Dashboard</h1>
      <p className="text-lg mb-8">Welcome back, {user?.username}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">My Wallets</h2>
          <p className="text-gray-600 mb-4">Manage your wallets and add funds to make purchases.</p>
          <Link 
            to="/client/wallets" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Wallets
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Purchase History</h2>
          <p className="text-gray-600 mb-4">View your past purchases and order details.</p>
          <Link 
            to="/client/purchases" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Purchases
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Browse Products</h2>
          <p className="text-gray-600 mb-4">Explore our catalog and find products to purchase.</p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;