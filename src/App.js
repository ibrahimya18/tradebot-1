import React, { useState, useEffect } from "react";
import { WalletInfo } from "./components/WalletInfo";
import { Chart } from "./components/Chart";
import { TradeForm } from "./components/TradeForm";
import { OpenOrders } from "./components/OpenOrders";
import { OrderHistory } from "./components/OrderHistory";
import { useMexc } from './hooks/useMexc';
import "./App.css";

function App() {
  const {
    balance,
    currentPrice,
    priceHistory,
    openOrders,
    orderHistory,
    connectWallet,
    placeOrder,
    setLeverage,
    applyAlgorithm,
  } = useMexc();

  const [algorithm, setAlgorithm] = useState("meanReversion");
  const [leverage, setLeverageInput] = useState(10);

  useEffect(() => {
    setLeverage(leverage);
  }, [leverage, setLeverage]);

  return (
    <div className="app">
      <header>
        <h1>Doge/USDT Trading Bot</h1>
      </header>

      <div className="grid-container">
        <div className="wallet-section">
          <WalletInfo balance={balance} connectWallet={connectWallet} />
        </div>

        <div className="chart-section">
          <Chart priceHistory={priceHistory} currentPrice={currentPrice} />
        </div>

        <div className="trade-section">
          <TradeForm
            currentPrice={currentPrice}
            placeOrder={placeOrder}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            leverage={leverage}
            setLeverageInput={setLeverageInput}
            applyAlgorithm={applyAlgorithm}
            connectWallet={connectWallet}  
          />
        </div>

        <div className="open-orders">
          <OpenOrders orders={openOrders} currentPrice={currentPrice} />
        </div>

        <div className="order-history">
          <OrderHistory history={orderHistory} />
        </div>
      </div>
    </div>
  );
}

export default App;
