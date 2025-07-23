import { coreApi } from './api';

export const searchProducts = async (query: string) => {
  const response = await coreApi.get(`/clients/search?query=${query}`);
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await coreApi.get(`/clients/products/${id}`);
  return response.data;
};

export const getVendorProducts = async () => {
  const response = await coreApi.get('/vendors/products');
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await coreApi.post('/vendors/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: any) => {
  const response = await coreApi.put(`/vendors/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await coreApi.delete(`/vendors/products/${id}`);
  return response.data;
};

export const addTagToProduct = async (productId: string, tagId: string) => {
  const response = await coreApi.post(`/vendors/products/${productId}/tags`, tagId);
  return response.data;
};

export const removeTagFromProduct = async (productId: string, tagId: string) => {
  const response = await coreApi.delete(`/vendors/products/${productId}/tags/${tagId}`);
  return response.data;
};