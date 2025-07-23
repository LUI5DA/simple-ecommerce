import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  onAddToCart?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted">${product.price.toFixed(2)}</Card.Text>
        <Card.Text>{product.description.substring(0, 100)}...</Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <Link to={`/product/${product.id}`} className="btn btn-primary">
          View Details
        </Link>
        {isAuthenticated && user?.role === 'Cliente' && onAddToCart && (
          <Button variant="success" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;