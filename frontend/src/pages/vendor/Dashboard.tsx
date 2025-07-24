import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VendorDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>
      <p className="text-lg mb-8">Welcome back, {user?.username}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600 mb-4">Add, edit, or remove products from your inventory.</p>
          <Link 
            to="/vendor/products" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Products
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Sales History</h2>
          <p className="text-gray-600 mb-4">View your sales history and transaction details.</p>
          <Link 
            to="/vendor/sales" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Sales
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;