// Mean Reversion Algoritması
export const meanReversion = (priceData) => {
  if (priceData.length < 20) return { action: 'hold', price: priceData[priceData.length - 1] };
  
  const currentPrice = priceData[priceData.length - 1];
  const window = priceData.slice(-20);
  const mean = window.reduce((sum, price) => sum + price, 0) / window.length;
  const stdDev = Math.sqrt(window.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / window.length);
  
  if (currentPrice < mean - stdDev) {
    return { action: 'buy', price: currentPrice };
  } else if (currentPrice > mean + stdDev) {
    return { action: 'sell', price: currentPrice };
  }
  return { action: 'hold', price: currentPrice };
};

// Breakout Algoritması
export const breakout = (priceData) => {
  if (priceData.length < 50) return { action: 'hold', price: priceData[priceData.length - 1] };
  
  const currentPrice = priceData[priceData.length - 1];
  const window = priceData.slice(-50);
  const high = Math.max(...window);
  const low = Math.min(...window);
  
  if (currentPrice >= high * 0.99) {
    return { action: 'buy', price: currentPrice };
  } else if (currentPrice <= low * 1.01) {
    return { action: 'sell', price: currentPrice };
  }
  return { action: 'hold', price: currentPrice };
};