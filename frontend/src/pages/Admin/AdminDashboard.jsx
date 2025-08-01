// src/pages/Admin/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin Panel</h2>
        <ul style={styles.menu}>
          <li style={styles.menuItem}>Dashboard</li>
          <li style={styles.menuItem}>Manage Users</li>
          <li style={styles.menuItem}>Vendors</li>
          <li style={styles.menuItem}>Clients</li>
          <li style={styles.menuItem}>Sales</li>
          <li style={styles.menuItem}>Tags</li>
          <li style={styles.menuItem} onClick={logout}>Logout</li>
        </ul>
      </div>
      <div style={styles.main}>
        <h1>Welcome, {user?.username}</h1>
        <p>You are logged in as <strong>{user?.role}</strong></p>
        <p>Here you will be able to manage users, view sales reports, and administer tags.</p>
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
    backgroundColor: '#343a40',
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
    borderBottom: '1px solid #495057'
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f8f9fa'
  }
};

export default AdminDashboard;
