import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Form, Alert, Modal } from 'react-bootstrap';
import { getWallets, createWallet } from '../../services/walletService';

const ClientWallets: React.FC = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    currency: 'USD',
    balance: 1000 // Starting with some balance for demo purposes
  });

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const data = await getWallets();
        setWallets(data);
      } catch (err: any) {
        setError('Error loading wallets: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewWallet(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) : value
    }));
  };

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdWallet = await createWallet(newWallet);
      setWallets([...wallets, createdWallet]);
      setShowModal(false);
      setNewWallet({
        name: '',
        currency: 'USD',
        balance: 1000
      });
    } catch (err: any) {
      setError('Error creating wallet: ' + (err.response?.data || err.message));
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Wallets</h1>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Create New Wallet
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {wallets.length === 0 ? (
        <Alert variant="info">
          You don't have any wallets yet. Create one to start shopping!
        </Alert>
      ) : (
        <Row>
          {wallets.map(wallet => (
            <Col key={wallet.id} md={4} className="mb-4">
              <Card>
                <Card.Header>
                  <h5 className="mb-0">{wallet.name}</h5>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="text-success">
                    {wallet.currency} {wallet.balance.toFixed(2)}
                  </Card.Title>
                  <Card.Text>
                    Use this wallet to make purchases in our store.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Wallet Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateWallet}>
            <Form.Group className="mb-3">
              <Form.Label>Wallet Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newWallet.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select
                name="currency"
                value={newWallet.currency}
                onChange={handleInputChange}
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Initial Balance</Form.Label>
              <Form.Control
                type="number"
                name="balance"
                value={newWallet.balance}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
              <Form.Text className="text-muted">
                For demo purposes, you can set any initial balance.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Wallet
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ClientWallets;