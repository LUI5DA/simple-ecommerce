import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { getAllTags, createTag, deleteTag } from '../../services/adminService';

const AdminTags: React.FC = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const loadTags = async () => {
    try {
      const data = await getAllTags();
      setTags(data);
    } catch (err: any) {
      setError('Error loading tags: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTag({ name: newTagName });
      setNewTagName('');
      setShowModal(false);
      await loadTags(); // Refresh tags
    } catch (err: any) {
      setError('Error creating tag: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await deleteTag(tagId);
        await loadTags(); // Refresh tags
      } catch (err: any) {
        setError('Error deleting tag: ' + (err.response?.data || err.message));
      }
    }
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
        <h1>Manage Tags</h1>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Create New Tag
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {tags.length === 0 ? (
        <Alert variant="info">
          No tags in the system. Create some to help vendors categorize their products.
        </Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id}>
                <td>{tag.id.substring(0, 8)}...</td>
                <td>{tag.name}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Tag Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTag}>
            <Form.Group className="mb-3">
              <Form.Label>Tag Name</Form.Label>
              <Form.Control
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Tag
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminTags;