import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Badge } from 'react-bootstrap';
import { getVendorSales } from '../../services/vendorService';

const VendorSales: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getVendorSales();
        setSales(data);
      } catch (err: any) {
        setError('Error loading sales: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const groupSalesByInvoice = () => {
    const invoiceMap = new Map();
    
    sales.forEach(sale => {
      const invoiceId = sale.invoice_Ref.id;
      if (!invoiceMap.has(invoiceId)) {
        invoiceMap.set(invoiceId, {
          id: invoiceId,
          date: sale.invoice_Ref.purchaseDate || new Date().toISOString(),
          client: sale.invoice_Ref.client_Ref,
          sales: []
        });
      }
      
      invoiceMap.get(invoiceId).sales.push(sale);
    });
    
    return Array.from(invoiceMap.values());
  };

  const calculateInvoiceTotal = (invoiceSales: any[]) => {
    return invoiceSales.reduce((total, sale) => {
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

  const invoices = groupSalesByInvoice();

  return (
    <Container className="my-5">
      <h1 className="mb-4">Sales History</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {sales.length === 0 ? (
        <Alert variant="info">
          You don't have any sales yet.
        </Alert>
      ) : (
        <>
          <h3 className="mb-3">Sales by Invoice</h3>
          {invoices.map(invoice => (
            <div key={invoice.id} className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>
                  Invoice #{invoice.id.substring(0, 8)}
                  <Badge bg="secondary" className="ms-2">
                    {new Date(invoice.date).toLocaleDateString()}
                  </Badge>
                </h5>
                <h5>
                  <Badge bg="success">
                    ${calculateInvoiceTotal(invoice.sales).toFixed(2)}
                  </Badge>
                </h5>
              </div>
              
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
            </div>
          ))}
        </>
      )}
    </Container>
  );
};

export default VendorSales;