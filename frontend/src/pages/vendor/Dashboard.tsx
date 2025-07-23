import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getVendorRevenue } from '../../services/vendorService';

const VendorDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const data = await getVendorRevenue();
        setRevenue(data);
      } catch (err: any) {
        setError('Error loading revenue data: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <Container className="my-5">
      <h1 className="mb-4">Vendor Dashboard</h1>
      <p className="lead">Welcome back, {user?.username}!</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2 className="text-success">${revenue?.totalRevenue.toFixed(2) || '0.00'}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Sales</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2>{revenue?.totalSales || 0}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Products Sold</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2>{revenue?.totalProductsSold || 0}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Manage Products</Card.Title>
              <Card.Text>
                Add, edit, or remove products from your inventory.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/vendor/products" variant="primary">
                View Products
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Sales History</Card.Title>
              <Card.Text>
                View your sales history and transaction details.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/vendor/sales" variant="primary">
                View Sales
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VendorDashboard;