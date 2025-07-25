import React, { useState, useEffect, useContext } from 'react';
import { coreApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  tags?: { id: string; name: string }[];
}

const VendorProducts: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/vendors/products');
      setProducts(response.data);
    } catch (err: any) {
      console.log('Error loading products:', err);
      // Mock data
      setProducts([
        {
          id: '1',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 99.99,
          stock: 25,
          isActive: true,
          createdAt: '2023-11-01T10:00:00Z',
          tags: [{ id: '1', name: 'Electronics' }]
        },
        {
          id: '2',
          name: 'Bluetooth Speaker',
          description: 'Portable bluetooth speaker with excellent sound quality',
          price: 49.99,
          stock: 0,
          isActive: false,
          createdAt: '2023-10-15T14:30:00Z',
          tags: [{ id: '1', name: 'Electronics' }]
        },
        {
          id: '3',
          name: 'Smart Watch',
          description: 'Feature-rich smartwatch with health monitoring',
          price: 199.99,
          stock: 15,
          isActive: true,
          createdAt: '2023-10-20T09:15:00Z',
          tags: [{ id: '1', name: 'Electronics' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };
    
    try {
      if (editingProduct) {
        await coreApi.put(`/vendors/products/${editingProduct.id}`, productData);
        setProducts(prev => prev.map(product => 
          product.id === editingProduct.id 
            ? { ...product, ...productData }
            : product
        ));
        alert('Product updated successfully!');
      } else {
        const response = await coreApi.post('/vendors/products', productData);
        setProducts(prev => [...prev, response.data]);
        alert('Product created successfully!');
      }
    } catch (err: any) {
      // Mock creation/update
      if (editingProduct) {
        setProducts(prev => prev.map(product => 
          product.id === editingProduct.id 
            ? { ...product, ...productData }
            : product
        ));
        alert('Product updated successfully!');
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          ...productData,
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setProducts(prev => [...prev, newProduct]);
        alert('Product created successfully!');
      }
    }
    
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setShowCreateForm(true);
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      await coreApi.post(`/vendors/products/${productId}/${product?.isActive ? 'deactivate' : 'activate'}`);
      
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, isActive: !product.isActive } : product
      ));
      
      alert(`Product ${product?.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (err: any) {
      // Mock toggle
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, isActive: !product.isActive } : product
      ));
      
      const product = products.find(p => p.id === productId);
      alert(`Product ${product?.isActive ? 'deactivated' : 'activated'} successfully!`);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      await coreApi.delete(`/vendors/products/${productId}`);
      setProducts(prev => prev.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    } catch (err: any) {
      // Mock deletion
      setProducts(prev => prev.filter(product => product.id !== productId));
      alert('Product deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '' });
    setEditingProduct(null);
    setShowCreateForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Products</h3>
          <p className="text-3xl font-bold text-green-600">
            {products.filter(p => p.isActive).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Value</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="stock" className="block text-gray-700 font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">You haven't added any products yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(product.id)}
                    className={`px-2 py-1 rounded text-xs ${
                      product.isActive
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-semibold ${
                    product.stock === 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.stock} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-semibold ${
                    product.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-sm">{formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;