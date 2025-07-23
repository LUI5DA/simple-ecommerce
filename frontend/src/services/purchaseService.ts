import { coreApi } from './api';

export const getPurchaseHistory = async () => {
  const response = await coreApi.get('/clients/purchases');
  return response.data;
};

export const makePurchase = async (purchaseData: any) => {
  const response = await coreApi.post('/clients/purchase', purchaseData);
  return response.data;
};