import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../services/productService';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Cart functionality
  const addToCart = (productId: string) => {
    // Get existing cart from localStorage or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = cart.find((item: any) => item.productId === productId);
    
    if (existingItem) {
      // Increment quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({ productId, quantity: 1 });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Notify user
    alert('Product added to cart!');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await searchProducts(searchQuery);
      setProducts(data);
    } catch (err: any) {
      setError('Error searching products: ' + (err.response?.data || err.message));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load some initial products on page load
    const loadInitialProducts = async () => {
      setLoading(true);
      try {
        const data = await searchProducts('');
        setProducts(data);
      } catch (err: any) {
        setError('Error loading products: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialProducts();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Welcome to Simple E-Commerce</h1>
      
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button type="submit" variant="primary" className="w-100">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <Alert variant="info">No products found.</Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {products.map((product) => (
                <Col key={product.id}>
                  <ProductCard product={product} onAddToCart={addToCart} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;