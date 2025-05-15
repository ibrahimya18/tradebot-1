import { useState, useEffect } from "react";
import { useMexc } from "./hooks/useMexc";
import { useWallet } from "./hooks/useWallet";
import { CandleChart } from "./components/CandleChart";
import { getCandleData } from "./services/api";
import { TradeForm } from "./components/TradeForm";
import { OpenOrders } from "./components/OpenOrders";
import { OrderHistory } from "./components/OrderHistory";
import { WalletInfo } from "./components/WalletInfo";
import { AlgorithmSettings } from "./components/AlgorithmSettings";
import { AddWalletModal } from "./components/AddWalletModal";
import { WalletSelector } from "./components/WalletSelector";

function App() {
  const {
    wallets,
    selectedWallet,
    setSelectedWallet,
    addWallet,
    removeWallet,
    showAddModal,
    setShowAddModal,
  } = useWallet();

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
    algorithmSettings,
    updateAlgorithmSettings,
    setSelectedAlgorithm,
    connectionStatus,
  } = useMexc();

  // Seçili cüzdan değiştiğinde bağlantıyı güncelle
  useEffect(() => {
    if (selectedWallet) {
      connectWallet(selectedWallet.apiKey, selectedWallet.secretKey);
    }
  }, [selectedWallet, connectWallet]);

  const handleAddWallet = (wallet) => {
    addWallet(wallet);
  };

  const handleDisconnect = () => {
    setSelectedWallet(null);
  };

  const [interval, setInterval] = useState("15m");
  const [priceData, setPriceData] = useState([]);
  useEffect(() => {
  const fetchData = async () => {
    const rawData = await getCandleData(interval);
    const transformed = rawData.prices.map(p => ({
      x: p.timestamp,
      o: p.open,
      h: p.high,
      l: p.low,
      c: p.close,
    }));
    setPriceData(transformed);
  };
  fetchData();
}, [interval]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Add Wallet Modal */}
      <AddWalletModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddWallet}
      />

      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Doge/USDT Trading Bot
        </h1>

        {/* Wallet Selector */}
        <div className="w-64">
          <WalletSelector
            wallets={wallets}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            setShowAddModal={setShowAddModal}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            
            <CandleChart
              priceData={priceData}
              interval={interval}
              onIntervalChange={setInterval}
              currentPrice={currentPrice}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <OpenOrders orders={openOrders} currentPrice={currentPrice} />
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <OrderHistory history={orderHistory} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <WalletInfo
            balance={balance}
            selectedWallet={selectedWallet}
            onDisconnect={handleDisconnect}
          />

          <TradeForm
            currentPrice={currentPrice}
            placeOrder={placeOrder}
            algorithm={algorithmSettings.selectedAlgorithm}
            setAlgorithm={setSelectedAlgorithm}
            leverage={
              algorithmSettings[algorithmSettings.selectedAlgorithm].leverage
            }
            setLeverageInput={(lev) =>
              updateAlgorithmSettings(algorithmSettings.selectedAlgorithm, {
                leverage: lev,
              })
            }
            applyAlgorithm={applyAlgorithm}
            connectWallet={connectWallet}
            connectionStatus={connectionStatus}
          />

          <AlgorithmSettings
            algorithmSettings={algorithmSettings}
            updateAlgorithmSettings={updateAlgorithmSettings}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
