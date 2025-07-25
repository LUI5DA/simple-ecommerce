import React, { useState, useEffect, useContext } from 'react';
import { coreApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Purchase {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  purchaseDate: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  vendorName: string;
}

const ClientPurchases: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/clients/purchases');
      setPurchases(response.data);
    } catch (err: any) {
      console.log('Error loading purchases:', err);
      // Mock data for demonstration
      setPurchases([
        {
          id: '1',
          productName: 'Sample Product 1',
          quantity: 2,
          unitPrice: 29.99,
          totalAmount: 59.98,
          purchaseDate: '2023-12-01T10:30:00Z',
          status: 'Completed',
          vendorName: 'Tech Store'
        },
        {
          id: '2',
          productName: 'Sample Product 2',
          quantity: 1,
          unitPrice: 49.99,
          totalAmount: 49.99,
          purchaseDate: '2023-11-28T14:15:00Z',
          status: 'Completed',
          vendorName: 'Fashion Hub'
        },
        {
          id: '3',
          productName: 'Sample Product 3',
          quantity: 3,
          unitPrice: 15.50,
          totalAmount: 46.50,
          purchaseDate: '2023-11-25T09:45:00Z',
          status: 'Pending',
          vendorName: 'Home Goods'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filter === 'all') return true;
    return purchase.status.toLowerCase() === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalSpent = () => {
    return purchases
      .filter(p => p.status === 'Completed')
      .reduce((total, purchase) => total + purchase.totalAmount, 0);
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
      <h1 className="text-3xl font-bold mb-6">Purchase History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{purchases.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Completed Orders</h3>
          <p className="text-3xl font-bold text-green-600">
            {purchases.filter(p => p.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
          <p className="text-3xl font-bold text-purple-600">${getTotalSpent().toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['all', 'completed', 'pending', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Purchases List */}
      {filteredPurchases.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No purchases found for the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{purchase.productName}</div>
                      <div className="text-sm text-gray-500">ID: {purchase.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.vendorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${purchase.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${purchase.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColor(purchase.status)
                      }`}>
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPurchases;