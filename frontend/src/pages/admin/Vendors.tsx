import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { getPendingVendors, approveVendor, rejectVendor } from '../../services/adminService';
import { getAllUsers } from '../../services/adminService';

const AdminVendors: React.FC = () => {
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [allVendors, setAllVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingData, usersData] = await Promise.all([
          getPendingVendors(),
          getAllUsers()
        ]);
        
        setPendingVendors(pendingData);
        setAllVendors(usersData.vendors || []);
      } catch (err: any) {
        setError('Error loading vendors: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveVendor = async (vendorId: string) => {
    try {
      await approveVendor(vendorId);
      
      // Update lists
      setPendingVendors(pendingVendors.filter(v => v.id !== vendorId));
      
      // Refresh all vendors
      const usersData = await getAllUsers();
      setAllVendors(usersData.vendors || []);
      
    } catch (err: any) {
      setError('Error approving vendor: ' + (err.response?.data || err.message));
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    if (window.confirm('Are you sure you want to reject this vendor?')) {
      try {
        await rejectVendor(vendorId);
        setPendingVendors(pendingVendors.filter(v => v.id !== vendorId));
      } catch (err: any) {
        setError('Error rejecting vendor: ' + (err.response?.data || err.message));
      }
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
      <h1 className="mb-4">Manage Vendors</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="pending" className="mb-4">
        <Tab eventKey="pending" title={`Pending Approval (${pendingVendors.length})`}>
          {pendingVendors.length === 0 ? (
            <Alert variant="info">
              No vendors pending approval.
            </Alert>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Telephone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.location}</td>
                    <td>{vendor.telephone}</td>
                    <td>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleApproveVendor(vendor.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRejectVendor(vendor.id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
        
        <Tab eventKey="all" title={`All Vendors (${allVendors.length})`}>
          {allVendors.length === 0 ? (
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
                </tr>
              </thead>
              <tbody>
                {allVendors.map(vendor => (
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

export default AdminVendors;