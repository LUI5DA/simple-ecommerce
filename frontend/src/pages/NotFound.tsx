import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;