import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    tags?: { id: string; name: string }[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 mt-2 text-sm">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </p>
        
        {product.tags && product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.map(tag => (
              <span 
                key={tag.id} 
                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 flex justify-between">
        <Link 
          to={`/product/${product.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          View Details
        </Link>
        
        {isAuthenticated && user?.role === 'Client' && (
          <button 
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;