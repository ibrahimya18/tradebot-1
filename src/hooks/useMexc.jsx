import { useState, useEffect } from "react";
import {
  getBalance,
  getPriceHistory,
  placeOrder as apiPlaceOrder,
} from "../services/api";
import { meanReversion, breakout } from '../services/tradingAlgorithms'; 

export const useMexc = () => {
  const [balance, setBalance] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [leverage, setLeverage] = useState(10);
  const [ws, setWs] = useState(null);

  const connectWallet = async (apiKey, secretKey) => {
    try {
      const bal = await getBalance(apiKey, secretKey);
      setBalance(bal);

      // MEXC WebSocket bağlantısı
      const websocket = new WebSocket(`wss://wbs.mexc.com/ws`);

      websocket.onopen = () => {
        // Doge/USDT sembolüne subscribe ol
        websocket.send(
          JSON.stringify({
            method: "SUBSCRIPTION",
            params: ["spot@public.miniTicker.v3.api@DOGEUSDT"],
          })
        );
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data && data.d && data.d.c) {
          setCurrentPrice(parseFloat(data.d.c));
          setPriceHistory((prev) => [...prev.slice(-99), parseFloat(data.d.c)]);
        }
      };

      setWs(websocket);

      // Fiyat geçmişini yükle
      const history = await getPriceHistory();
      setPriceHistory(history);

      return true;
    } catch (error) {
      console.error("Wallet connection failed:", error);
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

  const applyAlgorithm = (algorithmName) => {
    const priceData = [...priceHistory, currentPrice];

    switch (algorithmName) {
      case "meanReversion":
        return meanReversion(priceData);
      case "breakout":
        return breakout(priceData);
      default:
        return { action: "hold", price: currentPrice };
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  return {
    balance,
    currentPrice,
    priceHistory,
    openOrders,
    orderHistory,
    connectWallet,
    placeOrder,
    setLeverage,
    applyAlgorithm,
  };
};
