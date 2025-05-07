import React from 'react';

export const WalletInfo = ({ balance, connectWallet }) => {
  return (
    <div className="wallet-info">
      <h3>Wallet Balance</h3>
      {balance ? (
        <div className="balance-details">
          <p>USDT: {balance.free} (available)</p>
          <p>Total: {parseFloat(balance.free) + parseFloat(balance.locked)} USDT</p>
        </div>
      ) : (
        <p>Wallet not connected</p>
      )}
    </div>
  );
};