import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // LocalStorage'dan cüzdanları yükle
  useEffect(() => {
    const savedWallets = JSON.parse(localStorage.getItem('savedWallets')) || [];
    setWallets(savedWallets);
    if (savedWallets.length > 0) {
      setSelectedWallet(savedWallets[0]);
    }
  }, []);

  // Cüzdan ekleme fonksiyonu
  const addWallet = (wallet) => {
    const newWallets = [...wallets, wallet];
    setWallets(newWallets);
    setSelectedWallet(wallet);
    localStorage.setItem('savedWallets', JSON.stringify(newWallets));
    setShowAddModal(false);
  };

  // Cüzdan silme fonksiyonu
  const removeWallet = (walletId) => {
    const newWallets = wallets.filter(w => w.id !== walletId);
    setWallets(newWallets);
    localStorage.setItem('savedWallets', JSON.stringify(newWallets));
    if (selectedWallet?.id === walletId) {
      setSelectedWallet(newWallets[0] || null);
    }
  };

  return {
    wallets,
    selectedWallet,
    setSelectedWallet,
    addWallet,
    removeWallet,
    showAddModal,
    setShowAddModal
  };
};