// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} Simple E-Commerce. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#222',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem 0',
    position: 'fixed',
    width: '100%',
    bottom: 0
  }
};

export default Footer;