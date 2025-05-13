import { useState, useEffect } from "react";
import {
  getBalance,getDogeUsdtPrice,
  getPriceHistory,
  placeOrder as apiPlaceOrder,
} from "../services/api";
import { meanReversion, breakout,defaultAlgorithmSettings  } from '../services/tradingAlgorithms'; 

export const useMexc = () => { 
  const [balance, setBalance] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leverage, setLeverage] = useState(10);
  const [ws, setWs] = useState(null);
  const [algorithmSettings, setAlgorithmSettings] = useState({
    ...defaultAlgorithmSettings,
    selectedAlgorithm: 'meanReversion'
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
 
  const connectWallet = async (apiKey, secretKey) => {
    if (!apiKey || !secretKey) {
      setConnectionStatus('disconnected');
      return false;
    }
    try {
      setConnectionStatus('connecting');
      //const bal = await getBalance(apiKey, secretKey);
      //setBalance(bal);
      
      // WebSocket bağlantısı
      //const websocket = new WebSocket('wss://wbs.mexc.com/ws');
      
      // websocket.onopen = () => {
      //   websocket.send(JSON.stringify({
      //     method: "SUBSCRIPTION",
      //     params: ["spot@public.miniTicker.v3.api@DOGEUSDT"]
      //   }));
      //   setConnectionStatus('connected');
      // }; 

      // websocket.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   if (data && data.d && data.d.c) {
       //    setCurrentPrice(parseFloat(data.d.c));
      //     setPriceHistory((prev) => [...prev.slice(-99), parseFloat(data.d.c)]);
      //   }
      // };

      // setWs(websocket);

      // Fiyat geçmişini yükle
      //const history = await getPriceHistory();
      //setPriceHistory(history);

      return true;
    } catch (error) {
      setConnectionStatus('error');
      return false;
    }
  };

  const placeOrder = async (side, amount, price) => {
    try {
      const order = {
        symbol: "DOGEUSDT",
        side,
        amount,
        price,
        leverage,
        timestamp: Date.now(),
        status: "open",
      };

      // API'ye gönder
      await apiPlaceOrder(order);

      setOpenOrders((prev) => [...prev, order]);
      return order;
    } catch (error) {
      console.error("Order failed:", error);
      return null;
    }
  };

  const applyAlgorithm = () => {
    const priceData = priceHistory.map(kline => ({
      x: kline[0],
      o: parseFloat(kline[1]),
      h: parseFloat(kline[2]),
      l: parseFloat(kline[3]),
      c: parseFloat(kline[4]),
    }));
  
    const settings = algorithmSettings[algorithmSettings.selectedAlgorithm];
  
    switch (algorithmSettings.selectedAlgorithm) {
      case 'meanReversion':
        return meanReversion(priceData, settings);
      case 'breakout':
        return breakout(priceData, settings);
      default:
        return { action: 'hold', price: currentPrice };
    }
  };
  const updateAlgorithmSettings = (algorithm, newSettings) => {
    setAlgorithmSettings(prev => ({
      ...prev,
      [algorithm]: {
        ...prev[algorithm],
        ...newSettings
      }
    }));
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [price, history] = await Promise.all([
          getDogeUsdtPrice(),
          getPriceHistory()
        ]);
        setCurrentPrice(price);
        setPriceHistory(history);
      } catch (error) {
        console.error('Initial data fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
     
    fetchInitialData();
  }, []);
  //useEffect(() => {
  //   const ws = new WebSocket('wss://wbs.mexc.com/ws');

  //   ws.onopen = () => {
  //     ws.send(JSON.stringify({
  //       method: "SUBSCRIPTION",
  //       params: ["spot@public.miniTicker.v3.api@DOGEUSDT"]
  //     }));
  //   };

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data?.d?.c) {
  //       const newPrice = parseFloat(data.d.c);
  //       setCurrentPrice(newPrice);
  //       setPriceHistory(prev => [...prev.slice(-99), newPrice]);
  //     }
  //   };

  //   return () => ws.close();
  // }, []);

  return {
    balance,
    currentPrice,
    priceHistory,
    loading,
    openOrders,
    orderHistory,
    connectWallet,
    placeOrder,
    setLeverage,
    applyAlgorithm,
    algorithmSettings,
    updateAlgorithmSettings,
    connectionStatus,
    setSelectedAlgorithm: (algo) => setAlgorithmSettings(prev => ({
      ...prev,
      selectedAlgorithm: algo
    }))
  };
};
