// src/pages/LoginRegister/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = "https://ecommerce.proyectoredes.site";
const authService = `${API_BASE}/Auth`;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Client',
    name: '',
    lastName: '',
    location: '',
    telephone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(authService + "/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      alert(data.message);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Register</h2>

        <label style={styles.label}>Username:</label>
        <input name="username" value={formData.username} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
          <option value="Client">Client</option>
          <option value="Vendor">Vendor</option>
        </select>

        <label style={styles.label}>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Last Name:</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Location:</label>
        <input name="location" value={formData.location} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Telephone:</label>
        <input name="telephone" value={formData.telephone} onChange={handleChange} required style={styles.input} />

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4'
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '350px'
  },
  title: {
    marginBottom: '1rem',
    textAlign: 'center'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default RegisterPage;
