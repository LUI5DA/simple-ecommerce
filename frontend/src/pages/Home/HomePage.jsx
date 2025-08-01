// src/pages/Home/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const HomePage = () => {
  return (
    <div>
      <main style={styles.main}>
        <h1 style={styles.title}>Welcome to Simple E-Commerce</h1>
        <p style={styles.description}>Your place to shop, sell and manage your business, all in one platform.</p>

        <div style={styles.buttons}>
          <Link to="/login" style={styles.button}>Login</Link>
          <Link to="/register" style={styles.buttonAlt}>Register</Link>
        </div>
      </main>
    </div>
  );
};

const styles = {
  main: {
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    minHeight: 'calc(100vh - 160px)'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '2rem'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    textDecoration: 'none'
  },
  buttonAlt: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '5px',
    textDecoration: 'none'
  }
};

export default HomePage;
