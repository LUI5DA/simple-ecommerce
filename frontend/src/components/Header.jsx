// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ showMenu }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Simple E-Commerce</h1>
      {showMenu && (
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Home</Link>
          {!user && <Link to="/login" style={styles.link}>Login</Link>}
          {!user && <Link to="/register" style={styles.link}>Register</Link>}
          {user && user.role === 'Admin' && <Link to="/admin" style={styles.link}>Admin</Link>}
          {user && user.role === 'Vendor' && <Link to="/vendor" style={styles.link}>Vendor</Link>}
          {user && user.role === 'Client' && <Link to="/client" style={styles.link}>Client</Link>}
          {user && <span onClick={handleLogout} style={styles.link}>Logout</span>}
        </nav>
      )}
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#222',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};

export default Header;
