import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { AuthContext } from '../context/AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await getProduct(id);
          setProduct(data);
        }
      } catch (err: any) {
        setError('Error loading product: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = cart.find((item: any) => item.productId === product.id);
    
    if (existingItem) {
      // Increment quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({ productId: product.id, quantity: 1 });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Notify user
    alert('Product added to cart!');
  };

  const goToCheckout = () => {
    // Add product to cart first
    addToCart();
    // Navigate to checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <div className="bg-light p-5 text-center mb-4">
            <h3>Product Image</h3>
            <p className="text-muted">(Image placeholder)</p>
          </div>
        </Col>
        
        <Col md={6}>
          <h1>{product.name}</h1>
          <h3 className="text-primary mb-4">${product.price.toFixed(2)}</h3>
          
          <div className="mb-4">
            <h5>Description:</h5>
            <p>{product.description}</p>
          </div>
          
          {product.tags && product.tags.length > 0 && (
            <div className="mb-4">
              <h5>Tags:</h5>
              <div>
                {product.tags.map((tag: any) => (
                  <Badge key={tag.id} bg="secondary" className="me-2 mb-2">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {isAuthenticated && user?.role === 'Cliente' && (
            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" onClick={addToCart}>
                Add to Cart
              </Button>
              <Button variant="success" size="lg" onClick={goToCheckout}>
                Buy Now
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;