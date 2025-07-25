import React, { useState, useEffect, useContext } from 'react';
import { coreApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Sale {
  id: string;
  productName: string;
  productId: string;
  clientName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

const VendorSales: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/vendors/sales');
      setSales(response.data);
    } catch (err: any) {
      console.log('Error loading sales:', err);
      // Mock data
      setSales([
        {
          id: '1',
          productName: 'Wireless Headphones',
          productId: '1',
          clientName: 'John Doe',
          quantity: 2,
          unitPrice: 99.99,
          totalAmount: 199.98,
          saleDate: '2023-12-01T10:30:00Z',
          status: 'Completed'
        },
        {
          id: '2',
          productName: 'Bluetooth Speaker',
          productId: '2',
          clientName: 'Jane Smith',
          quantity: 1,
          unitPrice: 49.99,
          totalAmount: 49.99,
          saleDate: '2023-11-28T14:15:00Z',
          status: 'Completed'
        },
        {
          id: '3',
          productName: 'Smart Watch',
          productId: '3',
          clientName: 'Mike Johnson',
          quantity: 1,
          unitPrice: 199.99,
          totalAmount: 199.99,
          saleDate: '2023-11-25T09:45:00Z',
          status: 'Pending'
        },
        {
          id: '4',
          productName: 'Wireless Headphones',
          productId: '1',
          clientName: 'Sarah Wilson',
          quantity: 1,
          unitPrice: 99.99,
          totalAmount: 99.99,
          saleDate: '2023-11-20T16:20:00Z',
          status: 'Completed'
        },
        {
          id: '5',
          productName: 'Smart Watch',
          productId: '3',
          clientName: 'David Brown',
          quantity: 2,
          unitPrice: 199.99,
          totalAmount: 399.98,
          saleDate: '2023-11-15T11:10:00Z',
          status: 'Cancelled'
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

  const filteredSales = sales.filter(sale => {
    const matchesFilter = filter === 'all' || sale.status.toLowerCase() === filter;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const saleDate = new Date(sale.saleDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = saleDate >= startDate && saleDate <= endDate;
    }
    
    return matchesFilter && matchesDate;
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

  const getTotalRevenue = () => {
    return sales
      .filter(s => s.status === 'Completed')
      .reduce((total, sale) => total + sale.totalAmount, 0);
  };

  const getTopSellingProduct = () => {
    const productSales = sales
      .filter(s => s.status === 'Completed')
      .reduce((acc, sale) => {
        acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
        return acc;
      }, {} as Record<string, number>);
    
    const topProduct = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topProduct ? topProduct[0] : 'N/A';
  };

  const getAverageOrderValue = () => {
    const completedSales = sales.filter(s => s.status === 'Completed');
    if (completedSales.length === 0) return 0;
    
    const total = completedSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    return total / completedSales.length;
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
      <h1 className="text-3xl font-bold mb-6">Sales History</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600">{sales.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${getTotalRevenue().toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Avg Order Value</h3>
          <p className="text-3xl font-bold text-purple-600">${getAverageOrderValue().toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Top Product</h3>
          <p className="text-lg font-bold text-orange-600">{getTopSellingProduct()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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
          
          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End date"
            />
            <button
              onClick={() => setDateRange({ start: '', end: '' })}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No sales found for the selected criteria.</p>
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
                    Client
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
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sale.productName}</div>
                      <div className="text-sm text-gray-500">ID: {sale.productId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${sale.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${sale.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(sale.saleDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColor(sale.status)
                      }`}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {filteredSales.length} of {sales.length} sales
              </span>
              <span className="text-sm font-medium text-gray-900">
                Total: ${filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSales;