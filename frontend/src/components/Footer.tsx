import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Simple E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;