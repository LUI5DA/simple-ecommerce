import { coreApi } from './api';

export const getVendorSales = async () => {
  const response = await coreApi.get('/vendors/sales');
  return response.data;
};

export const getVendorRevenue = async () => {
  const response = await coreApi.get('/vendors/revenue');
  return response.data;
};

export const getTags = async () => {
  const response = await coreApi.get('/vendors/tags');
  return response.data;
};