import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Simple E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {isAuthenticated && user?.role === 'Cliente' && (
              <>
                <Nav.Link as={Link} to="/client">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/client/wallets">Wallets</Nav.Link>
                <Nav.Link as={Link} to="/client/purchases">Purchases</Nav.Link>
              </>
            )}
            
            {isAuthenticated && user?.role === 'Vendor' && (
              <>
                <Nav.Link as={Link} to="/vendor">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/vendor/products">Products</Nav.Link>
                <Nav.Link as={Link} to="/vendor/sales">Sales</Nav.Link>
              </>
            )}
            
            {isAuthenticated && user?.role === 'Admin' && (
              <>
                <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/vendors">Vendors</Nav.Link>
                <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
                <Nav.Link as={Link} to="/admin/tags">Tags</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={user?.username || 'User'} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;