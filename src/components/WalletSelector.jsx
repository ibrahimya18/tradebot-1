import { useState } from 'react';

export const WalletSelector = ({ 
  wallets, 
  selectedWallet, 
  setSelectedWallet,
  setShowAddModal
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
      >
        <span className="truncate">
          {selectedWallet ? selectedWallet.name : 'Select Wallet'}
        </span>
        <svg 
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <div className="py-1">
            {wallets.map(wallet => (
              <div 
                key={wallet.id}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                  selectedWallet?.id === wallet.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  setSelectedWallet(wallet);
                  setIsOpen(false);
                }}
              >
                <span className="truncate">{wallet.name}</span>
                {selectedWallet?.id === wallet.id && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
            <div 
              className="px-4 py-2 border-t border-gray-200 hover:bg-gray-100 cursor-pointer text-blue-600"
              onClick={() => {
                setIsOpen(false);
                setShowAddModal(true);
              }}
            >
              + Add New Wallet
            </div>
          </div>
        </div>
      )}
    </div>
  );
};