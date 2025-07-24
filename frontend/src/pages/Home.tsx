import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { coreApi } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load initial products
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await coreApi.get('/products');
        setProducts(response.data);
      } catch (err: any) {
        console.log('Error loading products:', err);
        // For now, show mock data if API fails
        setProducts([
          {
            id: '1',
            name: 'Sample Product 1',
            description: 'This is a sample product description',
            price: 29.99,
            tags: [{ id: '1', name: 'electronics' }]
          },
          {
            id: '2',
            name: 'Sample Product 2',
            description: 'Another sample product description',
            price: 49.99,
            tags: [{ id: '2', name: 'clothing' }]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await coreApi.get(`/products/search?query=${searchQuery}`);
      setProducts(response.data);
    } catch (err: any) {
      console.log('Error searching products:', err);
      // Filter mock data for now
      const mockProducts = [
        {
          id: '1',
          name: 'Sample Product 1',
          description: 'This is a sample product description',
          price: 29.99,
          tags: [{ id: '1', name: 'electronics' }]
        },
        {
          id: '2',
          name: 'Sample Product 2',
          description: 'Another sample product description',
          price: 49.99,
          tags: [{ id: '2', name: 'clothing' }]
        }
      ];
      
      const filtered = mockProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to Simple E-Commerce</h1>
        {isAuthenticated && user?.role === 'Client' && (
          <Link 
            to="/client" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Search
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;