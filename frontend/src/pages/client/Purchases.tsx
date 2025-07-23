import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Accordion, Button, Alert } from 'react-bootstrap';
import { getPurchaseHistory } from '../../services/purchaseService';

const ClientPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await getPurchaseHistory();
        setPurchases(data);
      } catch (err: any) {
        setError('Error loading purchase history: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const calculateInvoiceTotal = (sales: any[]) => {
    return sales.reduce((total, sale) => {
      return total + (sale.product_Ref.price * sale.ammount);
    }, 0);
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
      <h1 className="mb-4">Purchase History</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {purchases.length === 0 ? (
        <Alert variant="info">
          You haven't made any purchases yet.
          <Button variant="link" href="/">Start shopping</Button>
        </Alert>
      ) : (
        <Accordion defaultActiveKey="0">
          {purchases.map((invoice, index) => (
            <Accordion.Item key={invoice.id} eventKey={index.toString()}>
              <Accordion.Header>
                <div className="d-flex justify-content-between w-100 me-3">
                  <span>
                    <strong>Invoice #{invoice.id.substring(0, 8)}</strong>
                  </span>
                  <span>
                    <Badge bg="primary">
                      ${calculateInvoiceTotal(invoice.sales).toFixed(2)}
                    </Badge>
                    <small className="ms-3 text-muted">
                      {new Date(invoice.purchaseDate || Date.now()).toLocaleDateString()}
                    </small>
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.sales.map((sale: any) => (
                      <tr key={sale.id}>
                        <td>{sale.product_Ref.name}</td>
                        <td>${sale.product_Ref.price.toFixed(2)}</td>
                        <td>{sale.ammount}</td>
                        <td>${(sale.product_Ref.price * sale.ammount).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={3} className="text-end">Total:</th>
                      <th>${calculateInvoiceTotal(invoice.sales).toFixed(2)}</th>
                    </tr>
                  </tfoot>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default ClientPurchases;