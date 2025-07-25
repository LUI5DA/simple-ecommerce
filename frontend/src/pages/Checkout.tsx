import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { coreApi } from '../services/api';

const Checkout: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [selectedWallet, setSelectedWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mock wallets - in real app, fetch from API
  const mockWallets = [
    { id: '1', balance: 150.75, currency: 'USD' },
    { id: '2', balance: 89.50, currency: 'USD' }
  ];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWallet) {
      setError('Please select a wallet for payment');
      return;
    }
    
    const selectedWalletData = mockWallets.find(w => w.id === selectedWallet);
    if (!selectedWalletData || selectedWalletData.balance < getTotalPrice()) {
      setError('Insufficient funds in selected wallet');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In real app, make API call to process purchase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      // Clear cart and redirect
      clearCart();
      alert('Purchase completed successfully!');
      navigate('/client/purchases');
    } catch (err: any) {
      setError('Failed to process purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between items-center border-b border-gray-200 py-3 last:border-b-0">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCheckout}>
            <div className="mb-4">
              <label htmlFor="wallet" className="block text-gray-700 font-medium mb-2">
                Select Wallet
              </label>
              <select
                id="wallet"
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a wallet...</option>
                {mockWallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    Wallet #{wallet.id} - ${wallet.balance.toFixed(2)} available
                  </option>
                ))}
              </select>
            </div>
            
            {selectedWallet && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  Selected wallet balance: $
                  {mockWallets.find(w => w.id === selectedWallet)?.balance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  After purchase: $
                  {((mockWallets.find(w => w.id === selectedWallet)?.balance || 0) - getTotalPrice()).toFixed(2)}
                </p>
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;