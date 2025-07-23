import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ClientDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container className="my-5">
      <h1 className="mb-4">Client Dashboard</h1>
      <p className="lead">Welcome back, {user?.username}!</p>
      
      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>My Wallets</Card.Title>
              <Card.Text>
                Manage your wallets and add funds to make purchases.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/client/wallets" variant="primary">
                View Wallets
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Purchase History</Card.Title>
              <Card.Text>
                View your past purchases and order details.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/client/purchases" variant="primary">
                View Purchases
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Browse Products</Card.Title>
              <Card.Text>
                Explore our catalog and find products to purchase.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/" variant="primary">
                Shop Now
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientDashboard;