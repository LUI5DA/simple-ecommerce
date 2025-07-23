import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { getWallets } from '../services/walletService';
import { makePurchase } from '../services/purchaseService';

interface CartItem {
  productId: string;
  quantity: number;
  product?: any;
}

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartAndWallets = async () => {
      try {
        // Load cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Fetch product details for each cart item
        const itemsWithDetails = await Promise.all(
          cart.map(async (item: CartItem) => {
            try {
              const productData = await getProduct(item.productId);
              return { ...item, product: productData };
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              return item;
            }
          })
        );
        
        setCartItems(itemsWithDetails);
        
        // Fetch user wallets
        const walletsData = await getWallets();
        setWallets(walletsData);
        
        if (walletsData.length > 0) {
          setSelectedWallet(walletsData[0].id);
        }
      } catch (err: any) {
        setError('Error loading checkout data: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    loadCartAndWallets();
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems.map(({ product, ...item }) => item)));
  };

  const removeItem = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedItems.map(({ product, ...item }) => item)));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedWallet) {
      setError('Please select a wallet');
      return;
    }
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    try {
      setLoading(true);
      
      const purchaseData = {
        walletId: selectedWallet,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      
      await makePurchase(purchaseData);
      
      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);
      
      setSuccess('Purchase completed successfully!');
      
      // Redirect to purchase history after a delay
      setTimeout(() => {
        navigate('/client/purchases');
      }, 2000);
    } catch (err: any) {
      setError('Error processing purchase: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
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
      <h1 className="mb-4">Checkout</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      {cartItems.length === 0 ? (
        <Alert variant="info">
          Your cart is empty. <Button variant="link" onClick={() => navigate('/')}>Continue shopping</Button>
        </Alert>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.productId}>
                  <td>{item.product?.name || 'Loading...'}</td>
                  <td>${item.product?.price?.toFixed(2) || '0.00'}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>${((item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3} className="text-end">Total:</th>
                <th>${calculateTotal().toFixed(2)}</th>
                <th></th>
              </tr>
            </tfoot>
          </Table>
          
          <Row className="mt-5">
            <Col md={6}>
              <h3>Payment Method</h3>
              
              {wallets.length === 0 ? (
                <Alert variant="warning">
                  You don't have any wallets. <Button variant="link" onClick={() => navigate('/client/wallets')}>Create a wallet</Button>
                </Alert>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Select Wallet</Form.Label>
                  <Form.Select
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                  >
                    {wallets.map(wallet => (
                      <option key={wallet.id} value={wallet.id}>
                        {wallet.name} - {wallet.currency} {wallet.balance.toFixed(2)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Col>
          </Row>
          
          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCheckout}
              disabled={loading || wallets.length === 0}
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Checkout;