import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { 
  getVendorProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addTagToProduct,
  removeTagFromProduct
} from '../../services/productService';
import { getTags } from '../../services/vendorService';

const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, tagsData] = await Promise.all([
          getVendorProducts(),
          getTags()
        ]);
        setProducts(productsData);
        setTags(tagsData);
      } catch (err: any) {
        setError('Error loading data: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newProduct = await createProduct(formData);
      setProducts([...products, newProduct]);
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError('Error creating product: ' + (err.response?.data || err.message));
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProduct = await updateProduct(currentProduct.id, formData);
      setProducts(products.map(p => p.id === currentProduct.id ? updatedProduct : p));
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError('Error updating product: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err: any) {
        setError('Error deleting product: ' + (err.response?.data || err.message));
      }
    }
  };

  const openEditModal = (product: any) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price
    });
    setShowModal(true);
  };

  const openAddTagModal = (product: any) => {
    setCurrentProduct(product);
    setSelectedTag(tags.length > 0 ? tags[0].id : '');
    setShowTagModal(true);
  };

  const handleAddTag = async () => {
    try {
      await addTagToProduct(currentProduct.id, selectedTag);
      
      // Refresh products to show updated tags
      const productsData = await getVendorProducts();
      setProducts(productsData);
      
      setShowTagModal(false);
    } catch (err: any) {
      setError('Error adding tag: ' + (err.response?.data || err.message));
    }
  };

  const handleRemoveTag = async (productId: string, tagId: string) => {
    try {
      await removeTagFromProduct(productId, tagId);
      
      // Refresh products to show updated tags
      const productsData = await getVendorProducts();
      setProducts(productsData);
    } catch (err: any) {
      setError('Error removing tag: ' + (err.response?.data || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0
    });
    setCurrentProduct(null);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Products</h1>
        <Button variant="success" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          Add New Product
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {products.length === 0 ? (
        <Alert variant="info">
          You don't have any products yet. Add some to start selling!
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  {product.tags && product.tags.map((tag: any) => (
                    <Badge 
                      key={tag.id} 
                      bg="secondary" 
                      className="me-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveTag(product.id, tag.id)}
                      title="Click to remove tag"
                    >
                      {tag.name} ×
                    </Badge>
                  ))}
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => openAddTagModal(product)}
                  >
                    +
                  </Button>
                </td>
                <td>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={currentProduct ? handleEditProduct : handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentProduct ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Tag Modal */}
      <Modal show={showTagModal} onHide={() => setShowTagModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tag to Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tags.length === 0 ? (
            <Alert variant="warning">
              No tags available. Contact an administrator to add tags.
            </Alert>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Tag</Form.Label>
                <Form.Select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  {tags.map((tag: any) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowTagModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default VendorProducts;