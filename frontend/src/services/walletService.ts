import { coreApi } from './api';

export const getWallets = async () => {
  const response = await coreApi.get('/clients/wallets');
  return response.data;
};

export const createWallet = async (walletData: any) => {
  const response = await coreApi.post('/clients/wallets', walletData);
  return response.data;
};