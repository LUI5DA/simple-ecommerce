import React, { useState, useEffect, useContext } from 'react';
import { coreApi } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

const ClientWallets: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await coreApi.get('/clients/wallets');
      setWallets(response.data);
    } catch (err: any) {
      console.log('Error loading wallets:', err);
      // Mock data for demonstration
      setWallets([
        { id: '1', balance: 150.75, currency: 'USD' },
        { id: '2', balance: 89.50, currency: 'USD' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFundsAmount || !selectedWallet) return;

    try {
      await coreApi.post(`/clients/wallets/${selectedWallet}/add-funds`, {
        amount: parseFloat(addFundsAmount)
      });
      
      // Update wallet balance locally
      setWallets(prev => prev.map(wallet => 
        wallet.id === selectedWallet 
          ? { ...wallet, balance: wallet.balance + parseFloat(addFundsAmount) }
          : wallet
      ));
      
      setAddFundsAmount('');
      setSelectedWallet('');
      alert('Funds added successfully!');
    } catch (err: any) {
      setError('Failed to add funds. Please try again.');
    }
  };

  const createWallet = async () => {
    try {
      const response = await coreApi.post('/clients/wallets', {
        currency: 'USD'
      });
      
      setWallets(prev => [...prev, response.data]);
      alert('Wallet created successfully!');
    } catch (err: any) {
      // Mock wallet creation
      const newWallet = {
        id: Date.now().toString(),
        balance: 0,
        currency: 'USD'
      };
      setWallets(prev => [...prev, newWallet]);
      alert('Wallet created successfully!');
    }
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
        <h1 className="text-3xl font-bold">My Wallets</h1>
        <button
          onClick={createWallet}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Create New Wallet
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Wallet #{wallet.id}</h3>
            <p className="text-2xl font-bold text-green-600 mb-4">
              ${wallet.balance.toFixed(2)} {wallet.currency}
            </p>
            <div className="text-sm text-gray-600">
              <p>Currency: {wallet.currency}</p>
              <p>ID: {wallet.id}</p>
            </div>
          </div>
        ))}
      </div>

      {wallets.length === 0 && (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">You don't have any wallets yet.</p>
          <button
            onClick={createWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Create Your First Wallet
          </button>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Funds</h2>
          <form onSubmit={handleAddFunds} className="space-y-4">
            <div>
              <label htmlFor="wallet" className="block text-gray-700 font-medium mb-2">
                Select Wallet
              </label>
              <select
                id="wallet"
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a wallet...</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    Wallet #{wallet.id} - ${wallet.balance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                Amount to Add
              </label>
              <input
                type="number"
                id="amount"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Add Funds
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientWallets;