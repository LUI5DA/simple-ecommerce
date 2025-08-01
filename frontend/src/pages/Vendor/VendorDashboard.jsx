// src/pages/Vendor/VendorDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const VendorDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Vendor Panel</h2>
        <ul style={styles.menu}>
          <li style={styles.menuItem}>Dashboard</li>
          <li style={styles.menuItem}>My Products</li>
          <li style={styles.menuItem}>Add Product</li>
          <li style={styles.menuItem}>Sales</li>
          <li style={styles.menuItem}>Analytics</li>
          <li style={styles.menuItem} onClick={logout}>Logout</li>
        </ul>
      </div>
      <div style={styles.main}>
        <h1>Welcome, {user?.username}</h1>
        <p>You are logged in as <strong>{user?.role}</strong></p>
        <p>From here you can manage your product inventory, view your sales and check analytics.</p>
        <div style={styles.stats}>
          <div style={styles.card}>
            <h3>Total Products</h3>
            <p>12</p>
          </div>
          <div style={styles.card}>
            <h3>Total Sales</h3>
            <p>$3,450</p>
          </div>
          <div style={styles.card}>
            <h3>Tags Used</h3>
            <p>7</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '1rem'
  },
  logo: {
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  menu: {
    listStyle: 'none',
    padding: 0
  },
  menuItem: {
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid #3e5871'
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#ecf0f1'
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  card: {
    flex: '1',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }
};

export default VendorDashboard;
