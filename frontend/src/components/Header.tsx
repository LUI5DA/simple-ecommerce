import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Simple E-Commerce</Link>
          
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
              
              {isAuthenticated ? (
                <>
                  {user?.role === 'Client' && (
                    <>
                      <li><Link to="/client" className="hover:text-gray-300">Dashboard</Link></li>
                      <li><Link to="/client/wallets" className="hover:text-gray-300">Wallets</Link></li>
                      <li><Link to="/client/purchases" className="hover:text-gray-300">Purchases</Link></li>
                      <li>
                        <Link to="/cart" className="hover:text-gray-300 relative">
                          Cart
                          {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    </>
                  )}
                  
                  {user?.role === 'Vendor' && (
                    <>
                      <li><Link to="/vendor" className="hover:text-gray-300">Dashboard</Link></li>
                      <li><Link to="/vendor/products" className="hover:text-gray-300">Products</Link></li>
                      <li><Link to="/vendor/sales" className="hover:text-gray-300">Sales</Link></li>
                    </>
                  )}
                  
                  {user?.role === 'Admin' && (
                    <>
                      <li><Link to="/admin" className="hover:text-gray-300">Dashboard</Link></li>
                      <li><Link to="/admin/vendors" className="hover:text-gray-300">Vendors</Link></li>
                      <li><Link to="/admin/users" className="hover:text-gray-300">Users</Link></li>
                      <li><Link to="/admin/tags" className="hover:text-gray-300">Tags</Link></li>
                    </>
                  )}
                  
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="hover:text-gray-300"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                  <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;