const express = require('express');
const cors = require('cors');
const axios = require('axios');
const CryptoJS = require('crypto-js');

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

app.get('/api/price', async (req, res) => {
  try {
    const response = await axios.get('https://api.mexc.com/api/v3/ticker/price?symbol=DOGEUSDT');
    res.json({ price: response.data.price });
  } catch (error) {
    console.error('MEXC API hatası:', error.message);
    res.status(500).json({ error: 'Fiyat alınamadı' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend çalışıyor: http://localhost:${PORT}`);
});
app.get('/api/history', async (req, res) => {
    const { interval = '1d', limit = 100 } = req.query;
    console.log('Interval received in backend:', interval);
  
    try {
      const response = await axios.get('https://api.mexc.com/api/v3/klines', {
        params: {
          symbol: 'DOGEUSDT',
          interval,
          limit
        }
      });
  
      const prices = response.data.map(kline => ({
        timestamp: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4])
      }));
  
      res.json({ prices });
    } catch (error) {
      console.error('Error fetching klines:', error);
      res.status(500).json({ error: 'Failed to fetch price history' });
    }
  });
  

app.post('/api/balance', async (req, res) => {
  const { apiKey, secretKey } = req.body;

  try {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const params = `recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const signature = CryptoJS.HmacSHA256(params, secretKey).toString(CryptoJS.enc.Hex);

    const url = `https://api.mexc.com/api/v3/account?${params}&signature=${signature}`;

    const response = await axios.get(url, {
      headers: { 'X-MEXC-APIKEY': apiKey }
    });

    const usdtBalance = response.data.balances.find(b => b.asset === 'USDT');
    res.json({ balance: usdtBalance });
    console.log("bakiye",response)
  } catch (error) {
    console.error('Balance hatası:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ error: 'Bakiye alınamadı' });
  }
});


app.post('/api/order', async (req, res) => {
    const { apiKey, secretKey, side, amount, price } = req.body;
  
    try {
      const timestamp = Date.now();
      const queryString = `symbol=DOGEUSDT&side=${side}&type=LIMIT&quantity=${amount}&price=${price}&timestamp=${timestamp}`;
      const signature = CryptoJS.HmacSHA256(queryString, secretKey).toString(CryptoJS.enc.Hex);
  
      const response = await axios.post(`https://api.mexc.com/api/v3/order?${queryString}&signature=${signature}`, null, {
        headers: {
          'X-MEXC-APIKEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Order hatası:', error.message);
      res.status(500).json({ error: 'Emir gönderilemedi' });
    }
  });
  