import React, { useState } from 'react';

export const TradeForm = ({ 
  currentPrice, 
  placeOrder, 
  algorithm, 
  setAlgorithm, 
  leverage, 
  connectWallet,
  connectionStatus,
  setLeverageInput,
  applyAlgorithm
}) => {
  const [amount, setAmount] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [algoSignal, setAlgoSignal] = useState(null);

  const handleConnect = async () => {
    const connected = await connectWallet(apiKey, secretKey);
    setIsConnected(connected);
  };

  const handleAlgorithmCheck = () => {
    const signal = applyAlgorithm(algorithm);
    setAlgoSignal(signal);
  };

  const executeAlgorithmTrade = () => {
    if (!algoSignal || algoSignal.action === 'hold') return;
    
    placeOrder(
      algoSignal.action.toUpperCase(),
      amount || '10', // Varsayılan miktar
      algoSignal.price
    );
  };

  return (
    <div className="trade-form">
      <h3>Trading Controls</h3>
      
      {!isConnected ? (
        <div className="wallet-connect">
          <div className="connection-status">
            Status: <span className={connectionStatus}>{connectionStatus}</span>
          </div>
          <input 
            type="text" 
            placeholder="API Key" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Secret Key" 
            value={secretKey} 
            onChange={(e) => setSecretKey(e.target.value)} 
          />
          <button onClick={handleConnect}>Connect Wallet</button>
        </div>
      ) : (
        <>
          <div className="manual-trade">
            <input
              type="number"
              placeholder="Amount (USDT)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
            />
            <div className="trade-buttons">
              <button onClick={() => placeOrder('BUY', amount, currentPrice)}>BUY</button>
              <button onClick={() => placeOrder('SELL', amount, currentPrice)}>SELL</button>
            </div>
          </div>
          
          <div className="leverage-control">
            <label>Leverage: {leverage}x</label>
            <input
              type="range"
              min="1"
              max="20"
              value={leverage}
              onChange={(e) => setLeverageInput(parseInt(e.target.value))}
            />
          </div>
          
          <div className="algorithm-control">
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              <option value="meanReversion">Mean Reversion</option>
              <option value="breakout">Breakout</option>
            </select>
            <button onClick={handleAlgorithmCheck}>Check Algorithm</button>
            
            {algoSignal && (
              <div className={`algo-signal ${algoSignal.action}`}>
                <p>Algorithm suggests: {algoSignal.action.toUpperCase()}</p>
                <p>At price: {algoSignal.price.toFixed(8)}</p>
                <button onClick={executeAlgorithmTrade}>Execute Trade</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};