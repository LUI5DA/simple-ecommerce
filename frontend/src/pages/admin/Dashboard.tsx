import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg mb-8">Welcome back, {user?.username}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Manage Vendors</h2>
          <p className="text-gray-600 mb-4">Approve new vendors and manage existing ones.</p>
          <Link 
            to="/admin/vendors" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Vendors
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600 mb-4">View and manage all users in the system.</p>
          <Link 
            to="/admin/users" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Users
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Manage Tags</h2>
          <p className="text-gray-600 mb-4">Create and manage product tags.</p>
          <Link 
            to="/admin/tags" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Tags
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;