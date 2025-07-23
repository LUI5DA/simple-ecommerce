import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container className="text-center">
        <p>&copy; {new Date().getFullYear()} Simple E-Commerce. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;