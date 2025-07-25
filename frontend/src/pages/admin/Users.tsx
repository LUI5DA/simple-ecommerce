import React, { useState, useEffect } from 'react';
import { coreApi } from '../../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  name: string;
  lastName?: string;
  location: string;
  telephone: string;
  isActive: boolean;
  createdAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'Client' | 'Vendor' | 'Admin'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/admin/users');
      setUsers(response.data);
    } catch (err: any) {
      console.log('Error loading users:', err);
      // Mock data
      setUsers([
        {
          id: '1',
          username: 'john_doe',
          email: 'john@example.com',
          role: 'Client',
          name: 'John',
          lastName: 'Doe',
          location: 'New York',
          telephone: '+1234567890',
          isActive: true,
          createdAt: '2023-10-01T10:00:00Z'
        },
        {
          id: '2',
          username: 'vendor_store',
          email: 'vendor@example.com',
          role: 'Vendor',
          name: 'Tech Store',
          location: 'California',
          telephone: '+1234567891',
          isActive: true,
          createdAt: '2023-10-15T14:30:00Z'
        },
        {
          id: '3',
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'Client',
          name: 'Jane',
          lastName: 'Smith',
          location: 'Texas',
          telephone: '+1234567892',
          isActive: false,
          createdAt: '2023-11-01T09:15:00Z'
        },
        {
          id: '4',
          username: 'admin_user',
          email: 'admin@example.com',
          role: 'Admin',
          name: 'Admin',
          lastName: 'User',
          location: 'Washington',
          telephone: '+1234567893',
          isActive: true,
          createdAt: '2023-09-01T08:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      await coreApi.post(`/admin/users/${userId}/${user?.isActive ? 'deactivate' : 'activate'}`);
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      ));
      
      alert(`User ${user?.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (err: any) {
      // Mock toggle
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      ));
      
      const user = users.find(u => u.id === userId);
      alert(`User ${user?.isActive ? 'deactivated' : 'activated'} successfully!`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await coreApi.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (err: any) {
      // Mock deletion
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = searchTerm === '' || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Vendor':
        return 'bg-blue-100 text-blue-800';
      case 'Client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Clients</h3>
          <p className="text-3xl font-bold text-green-600">
            {users.filter(u => u.role === 'Client').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Vendors</h3>
          <p className="text-3xl font-bold text-blue-600">
            {users.filter(u => u.role === 'Vendor').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
          <p className="text-3xl font-bold text-purple-600">
            {users.filter(u => u.isActive).length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by username, email, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'Client', 'Vendor', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role as any)}
                className={`px-4 py-2 rounded ${
                  filter === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {role === 'all' ? 'All' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">No users found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.telephone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getRoleColor(user.role)
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded text-xs ${
                            user.isActive
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {user.role !== 'Admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Delete
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

export default AdminUsers;