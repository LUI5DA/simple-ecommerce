import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getSystemStatistics } from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSystemStatistics();
        setStats(data);
      } catch (err: any) {
        setError('Error loading statistics: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container className="my-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p className="lead">Welcome back, {user?.username}!</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mt-4">
        <Col md={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Clients</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2>{stats?.totalClients || 0}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Vendors</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2>{stats?.totalVendors || 0}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2>{stats?.totalProducts || 0}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2 className="text-success">${stats?.totalRevenue.toFixed(2) || '0.00'}</h2>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Manage Vendors</Card.Title>
              <Card.Text>
                Approve new vendors and manage existing ones.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/admin/vendors" variant="primary">
                View Vendors
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>
                View and manage all users in the system.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/admin/users" variant="primary">
                View Users
              </Button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Manage Tags</Card.Title>
              <Card.Text>
                Create and manage product tags.
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button as={Link} to="/admin/tags" variant="primary">
                View Tags
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;