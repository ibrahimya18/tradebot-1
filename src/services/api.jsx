import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'https://api.mexc.com';

export const getBalance = async (apiKey, secretKey) => {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;
  const signature = CryptoJS.HmacSHA256(queryString, secretKey).toString(CryptoJS.enc.Hex);
  
  const response = await axios.get(`${API_URL}/api/v3/account?${queryString}&signature=${signature}`, {
    headers: {
      'X-MEXC-APIKEY': apiKey
    }
  });
  
  return response.data.balances.find(b => b.asset === 'USDT');
};

export const getPriceHistory = async () => {
  const response = await axios.get(`${API_URL}/api/v3/klines?symbol=DOGEUSDT&interval=1m&limit=100`);
  return response.data.map(k => parseFloat(k[2])); // Kapanış fiyatları (MEXC formatı)
};

export const placeOrder = async (order) => {
  const timestamp = Date.now();
  const queryString = `symbol=DOGEUSDT&side=${order.side}&type=LIMIT&quantity=${order.amount}&price=${order.price}&timestamp=${timestamp}`;
  const signature = CryptoJS.HmacSHA256(queryString, order.secretKey).toString(CryptoJS.enc.Hex);
  
  const response = await axios.post(`${API_URL}/api/v3/order`, `${queryString}&signature=${signature}`, {
    headers: {
      'X-MEXC-APIKEY': order.apiKey
    }
  });
  
  return response.data;
};