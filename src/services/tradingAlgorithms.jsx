// Algoritma ayarları için varsayılan değerler
export const defaultAlgorithmSettings = {
  meanReversion: {
    lookbackPeriod: 20,
    stdDevThreshold: 1,
    riskPercentage: 2, // %2 risk
    leverage: 10,
    takeProfit: 5, // %5
    stopLoss: 2 // %2
  },
  breakout: {
    lookbackPeriod: 50,
    breakoutThreshold: 0.99,
    riskPercentage: 1.5,
    leverage: 5,
    takeProfit: 8,
    stopLoss: 1.5
  }
};

// Güncellenmiş Mean Reversion Algoritması
export const meanReversion = (priceData, settings) => {
  const { 
    lookbackPeriod, 
    stdDevThreshold,
    riskPercentage,
    leverage
  } = settings;
  
  if (priceData.length < lookbackPeriod) return { 
    action: 'hold', 
    price: priceData[priceData.length - 1] 
  };
  
  const currentPrice = priceData[priceData.length - 1];
  const window = priceData.slice(-lookbackPeriod);
  const mean = window.reduce((sum, price) => sum + price, 0) / window.length;
  const stdDev = Math.sqrt(window.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / window.length);
  
  if (currentPrice < mean - (stdDev * stdDevThreshold)) {
    return { 
      action: 'buy', 
      price: currentPrice,
      amount: calculatePositionSize(riskPercentage, leverage),
      leverage,
      takeProfit: currentPrice * (1 + (settings.takeProfit/100)),
      stopLoss: currentPrice * (1 - (settings.stopLoss/100))
    };
  } else if (currentPrice > mean + (stdDev * stdDevThreshold)) {
    return { 
      action: 'sell', 
      price: currentPrice,
      amount: calculatePositionSize(riskPercentage, leverage),
      leverage,
      takeProfit: currentPrice * (1 - (settings.takeProfit/100)),
      stopLoss: currentPrice * (1 + (settings.stopLoss/100))
    };
  }
  return { action: 'hold', price: currentPrice };
};

// Güncellenmiş Breakout Algoritması
export const breakout = (priceData, settings) => {
  const { 
    lookbackPeriod, 
    breakoutThreshold,
    riskPercentage,
    leverage
  } = settings;
  
  if (priceData.length < lookbackPeriod) return { 
    action: 'hold', 
    price: priceData[priceData.length - 1] 
  };
  
  const currentPrice = priceData[priceData.length - 1];
  const window = priceData.slice(-lookbackPeriod);
  const high = Math.max(...window);
  const low = Math.min(...window);
  
  if (currentPrice >= high * breakoutThreshold) {
    return { 
      action: 'buy', 
      price: currentPrice,
      amount: calculatePositionSize(riskPercentage, leverage),
      leverage,
      takeProfit: currentPrice * (1 + (settings.takeProfit/100)),
      stopLoss: currentPrice * (1 - (settings.stopLoss/100))
    };
  } else if (currentPrice <= low * (2 - breakoutThreshold)) {
    return { 
      action: 'sell', 
      price: currentPrice,
      amount: calculatePositionSize(riskPercentage, leverage),
      leverage,
      takeProfit: currentPrice * (1 - (settings.takeProfit/100)),
      stopLoss: currentPrice * (1 + (settings.stopLoss/100))
    };
  }
  return { action: 'hold', price: currentPrice };
};

// Pozisyon büyüklüğü hesaplama
const calculatePositionSize = (riskPercentage, leverage) => {
  // Bu fonksiyon gerçek uygulamada balance bilgisini kullanacak şekilde güncellenmeli
  return (riskPercentage / 100) * leverage;
};