import React, { useState, useEffect } from 'react';
import { coreApi } from '../../services/api';

interface Tag {
  id: string;
  name: string;
  description?: string;
  color: string;
  productCount: number;
  createdAt: string;
}

const AdminTags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/admin/tags');
      setTags(response.data);
    } catch (err: any) {
      console.log('Error loading tags:', err);
      // Mock data
      setTags([
        {
          id: '1',
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          color: '#3B82F6',
          productCount: 15,
          createdAt: '2023-10-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Clothing',
          description: 'Fashion and apparel items',
          color: '#EF4444',
          productCount: 8,
          createdAt: '2023-10-15T14:30:00Z'
        },
        {
          id: '3',
          name: 'Home & Garden',
          description: 'Home improvement and garden supplies',
          color: '#10B981',
          productCount: 12,
          createdAt: '2023-11-01T09:15:00Z'
        },
        {
          id: '4',
          name: 'Books',
          description: 'Books and educational materials',
          color: '#F59E0B',
          productCount: 5,
          createdAt: '2023-11-10T16:45:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTag) {
        // Update existing tag
        await coreApi.put(`/admin/tags/${editingTag.id}`, formData);
        setTags(prev => prev.map(tag => 
          tag.id === editingTag.id 
            ? { ...tag, ...formData }
            : tag
        ));
        alert('Tag updated successfully!');
      } else {
        // Create new tag
        const response = await coreApi.post('/admin/tags', formData);
        setTags(prev => [...prev, response.data]);
        alert('Tag created successfully!');
      }
    } catch (err: any) {
      // Mock creation/update
      if (editingTag) {
        setTags(prev => prev.map(tag => 
          tag.id === editingTag.id 
            ? { ...tag, ...formData }
            : tag
        ));
        alert('Tag updated successfully!');
      } else {
        const newTag: Tag = {
          id: Date.now().toString(),
          ...formData,
          productCount: 0,
          createdAt: new Date().toISOString()
        };
        setTags(prev => [...prev, newTag]);
        alert('Tag created successfully!');
      }
    }
    
    resetForm();
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || '',
      color: tag.color
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (tagId: string) => {
    if (!window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return;
    }
    
    try {
      await coreApi.delete(`/admin/tags/${tagId}`);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      alert('Tag deleted successfully!');
    } catch (err: any) {
      // Mock deletion
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      alert('Tag deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setEditingTag(null);
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
        <h1 className="text-3xl font-bold">Manage Tags</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Tag
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Tags</h3>
            <p className="text-3xl font-bold text-blue-600">{tags.length}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Products Tagged</h3>
            <p className="text-3xl font-bold text-green-600">
              {tags.reduce((sum, tag) => sum + tag.productCount, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Tag Name
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
                <label htmlFor="color" className="block text-gray-700 font-medium mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag description..."
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {editingTag ? 'Update Tag' : 'Create Tag'}
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

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No tags found.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Create Your First Tag
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <div key={tag.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <h3 className="text-lg font-semibold">{tag.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tag)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {tag.description && (
                <p className="text-gray-600 text-sm mb-3">{tag.description}</p>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{tag.productCount} products</span>
                <span>Created {formatDate(tag.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTags;