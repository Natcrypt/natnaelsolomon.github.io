import { useCallback } from 'react';
import { ethers } from 'ethers';
import { useStore } from '../store/index.js';

export function useWallet() {
  const { walletAddress, walletConnected, setWallet } = useStore();

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask to trade on SoDEX.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts[0]) {
        setWallet(accounts[0]);
        console.log('[Wallet] Connected:', accounts[0]);
      }
    } catch (err) {
      console.error('[Wallet] Connection error:', err.message);
    }
  }, [setWallet]);

  const disconnect = useCallback(() => {
    setWallet(null);
  }, [setWallet]);

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return { walletAddress, walletConnected, shortAddress, connect, disconnect };
}
