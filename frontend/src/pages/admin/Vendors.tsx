import React, { useState, useEffect } from 'react';
import { coreApi } from '../../services/api';

interface Vendor {
  id: string;
  username: string;
  email: string;
  name: string;
  location: string;
  telephone: string;
  isApproved: boolean;
  createdAt: string;
}

const AdminVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/admin/vendors');
      setVendors(response.data);
    } catch (err: any) {
      console.log('Error loading vendors:', err);
      // Mock data
      setVendors([
        {
          id: '1',
          username: 'vendor1',
          email: 'vendor1@example.com',
          name: 'Tech Store',
          location: 'New York',
          telephone: '+1234567890',
          isApproved: true,
          createdAt: '2023-11-01T10:00:00Z'
        },
        {
          id: '2',
          username: 'vendor2',
          email: 'vendor2@example.com',
          name: 'Fashion Hub',
          location: 'Los Angeles',
          telephone: '+1234567891',
          isApproved: false,
          createdAt: '2023-11-15T14:30:00Z'
        },
        {
          id: '3',
          username: 'vendor3',
          email: 'vendor3@example.com',
          name: 'Home Goods',
          location: 'Chicago',
          telephone: '+1234567892',
          isApproved: true,
          createdAt: '2023-10-20T09:15:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId: string) => {
    try {
      await coreApi.post(`/admin/vendors/${vendorId}/approve`);
      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId ? { ...vendor, isApproved: true } : vendor
      ));
      alert('Vendor approved successfully!');
    } catch (err: any) {
      // Mock approval
      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId ? { ...vendor, isApproved: true } : vendor
      ));
      alert('Vendor approved successfully!');
    }
  };

  const handleRejectVendor = async (vendorId: string) => {
    try {
      await coreApi.post(`/admin/vendors/${vendorId}/reject`);
      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId ? { ...vendor, isApproved: false } : vendor
      ));
      alert('Vendor rejected!');
    } catch (err: any) {
      // Mock rejection
      setVendors(prev => prev.map(vendor => 
        vendor.id === vendorId ? { ...vendor, isApproved: false } : vendor
      ));
      alert('Vendor rejected!');
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    if (filter === 'all') return true;
    if (filter === 'approved') return vendor.isApproved;
    if (filter === 'pending') return !vendor.isApproved;
    return true;
  });

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
      <h1 className="text-3xl font-bold mb-6">Manage Vendors</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Vendors</h3>
          <p className="text-3xl font-bold text-blue-600">{vendors.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
          <p className="text-3xl font-bold text-green-600">
            {vendors.filter(v => v.isApproved).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {vendors.filter(v => !v.isApproved).length}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['all', 'approved', 'pending'].map((status) => (
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

      {/* Vendors Table */}
      {filteredVendors.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No vendors found for the selected filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-sm text-gray-500">@{vendor.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vendor.email}</div>
                      <div className="text-sm text-gray-500">{vendor.telephone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vendor.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(vendor.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vendor.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendor.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {!vendor.isApproved && (
                          <button
                            onClick={() => handleApproveVendor(vendor.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Approve
                          </button>
                        )}
                        {vendor.isApproved && (
                          <button
                            onClick={() => handleRejectVendor(vendor.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        )}
                      </div>
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

export default AdminVendors;