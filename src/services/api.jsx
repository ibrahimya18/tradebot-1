import axios from 'axios'; 

axios.defaults.baseURL = 'http://localhost:5000';




export const getDogeUsdtPrice = async () => {
  try {
    const response = await axios.get('/api/price');  
    return parseFloat(response.data.price);
  } catch (error) {
    console.error('Error fetching DOGE price:', error);
    return 0;
  }
};



export const getCandleData = async (interval = '1d') => {
  try {
    const response = await axios.get(`/api/history?interval=${interval}`);
     
    return response.data;
  } catch (error) {
    console.error('Error fetching candlestick data:', error);
    return [];
  }
};



export const getPriceHistory = async (interval = '1d', limit = 100) => {
  try {
    const response = await axios.get('/api/history', {
      params: { interval, limit }
    });
    return response.data.prices;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
};


export const getBalance = async (apiKey, secretKey) => {
  try {
    const response = await axios.post('/api/balance', { apiKey, secretKey });
    
    return response.data.balance
    
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};

export const placeOrder = async (order) => {
  try {
    const response = await axios.post('/api/order', {
      apiKey: order.apiKey,
      secretKey: order.secretKey,
      side: order.side,
      amount: order.amount,
      price: order.price
    });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    return null;
  }
};
