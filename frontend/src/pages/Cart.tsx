import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)} each</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-lg font-semibold w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</span>
            <button
              onClick={clearCart}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/checkout" 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;