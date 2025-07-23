import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { getAllUsers, banUser, unbanUser } from '../../services/adminService';

const AdminUsers: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setClients(data.clients || []);
      setVendors(data.vendors || []);
    } catch (err: any) {
      setError('Error loading users: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBanUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      try {
        await banUser(userId);
        await loadUsers(); // Refresh user lists
      } catch (err: any) {
        setError('Error banning user: ' + (err.response?.data || err.message));
      }
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await unbanUser(userId);
      await loadUsers(); // Refresh user lists
    } catch (err: any) {
      setError('Error unbanning user: ' + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">Manage Users</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="clients" className="mb-4">
        <Tab eventKey="clients" title={`Clients (${clients.length})`}>
          {clients.length === 0 ? (
            <Alert variant="info">
              No clients in the system.
            </Alert>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td>{client.name} {client.lasName}</td>
                    <td>{client.email}</td>
                    <td>{client.location}</td>
                    <td>
                      {client.isBanned ? (
                        <Badge bg="danger">Banned</Badge>
                      ) : (
                        <Badge bg="success">Active</Badge>
                      )}
                    </td>
                    <td>
                      {client.isBanned ? (
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUnbanUser(client.id)}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleBanUser(client.id)}
                        >
                          Ban
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        
        <Tab eventKey="vendors" title={`Vendors (${vendors.length})`}>
          {vendors.length === 0 ? (
            <Alert variant="info">
              No vendors in the system.
            </Alert>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.location}</td>
                    <td>
                      {vendor.isBanned ? (
                        <Badge bg="danger">Banned</Badge>
                      ) : vendor.isApproved ? (
                        <Badge bg="success">Approved</Badge>
                      ) : (
                        <Badge bg="warning">Pending</Badge>
                      )}
                    </td>
                    <td>
                      {vendor.isBanned ? (
                        <Button 
                          variant="success" 
                          size="sm"
                          onClick={() => handleUnbanUser(vendor.id)}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleBanUser(vendor.id)}
                        >
                          Ban
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminUsers;