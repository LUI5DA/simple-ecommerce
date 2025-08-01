// src/pages/Client/ClientDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Client Panel</h2>
        <ul style={styles.menu}>
          <li style={styles.menuItem}>Home</li>
          <li style={styles.menuItem}>Browse Products</li>
          <li style={styles.menuItem}>My Cart</li>
          <li style={styles.menuItem}>My Orders</li>
          <li style={styles.menuItem}>Wallet</li>
          <li style={styles.menuItem} onClick={logout}>Logout</li>
        </ul>
      </div>
      <div style={styles.main}>
        <h1>Welcome, {user?.username}</h1>
        <p>You are logged in as <strong>{user?.role}</strong></p>
        <p>From here you can browse products, manage your cart and wallet, and view your purchase history.</p>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Cart Items</h3>
            <p>3</p>
          </div>
          <div style={styles.card}>
            <h3>Total Spent</h3>
            <p>$1,280</p>
          </div>
          <div style={styles.card}>
            <h3>Wallet Balance</h3>
            <p>$120</p>
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
    backgroundColor: '#6c757d',
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
    borderBottom: '1px solid #868e96'
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f1f3f5'
  },
  cards: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }
};

export default ClientDashboard;
