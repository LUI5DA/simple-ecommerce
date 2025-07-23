import { coreApi } from './api';

export const getPendingVendors = async () => {
  const response = await coreApi.get('/admins/vendors/pending');
  return response.data;
};

export const approveVendor = async (vendorId: string) => {
  const response = await coreApi.post(`/admins/vendors/${vendorId}/approve`);
  return response.data;
};

export const rejectVendor = async (vendorId: string) => {
  const response = await coreApi.post(`/admins/vendors/${vendorId}/reject`);
  return response.data;
};

export const getAllSales = async () => {
  const response = await coreApi.get('/admins/sales');
  return response.data;
};

export const createTag = async (tagData: any) => {
  const response = await coreApi.post('/admins/tags', tagData);
  return response.data;
};

export const getAllTags = async () => {
  const response = await coreApi.get('/admins/tags');
  return response.data;
};

export const deleteTag = async (tagId: string) => {
  const response = await coreApi.delete(`/admins/tags/${tagId}`);
  return response.data;
};

export const banUser = async (userId: string) => {
  const response = await coreApi.post(`/admins/users/${userId}/ban`);
  return response.data;
};

export const unbanUser = async (userId: string) => {
  const response = await coreApi.post(`/admins/users/${userId}/unban`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await coreApi.get('/admins/users');
  return response.data;
};

export const getSystemStatistics = async () => {
  const response = await coreApi.get('/admins/statistics');
  return response.data;
};