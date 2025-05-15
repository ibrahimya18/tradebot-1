import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial'; 
import { Chart } from 'react-chartjs-2'; // react-chartjs-2 kullanarak Chart bileşeni alınıyor
import 'chartjs-adapter-date-fns';

// Chart.js bileşenlerini kaydediyoruz
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement,
  Tooltip,
  Legend
);

export const CandleChart = ({ priceData, interval, onIntervalChange, currentPrice }) => {
  // En son timestamp'ı almak için useMemo kullanıyoruz
  const lastTimestamp = useMemo(() => {
    if (priceData.length === 0) return null;
    const lastData = priceData[priceData.length - 1];
    return lastData.x; 
  }, [priceData]);

  const data = {
    datasets: [
      {
        label: 'DOGE/USDT',
        data: priceData, // OHLC verisi (open, high, low, close)
        borderColor: 'rgba(0, 0, 0, 1)', // Çizgi rengini belirliyoruz
        borderWidth: 1,
        upColor: 'rgba(0, 255, 0, 1)', // Yükselen mumlar için renk
        downColor: 'rgba(255, 0, 0, 1)', // Düşen mumlar için renk
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: interval === '1d' ? 'day' : 'hour',
          tooltipFormat: 'yyyy-MM-dd HH:mm', // Zaman formatı
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USDT)',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const ohlc = context.raw; // OHLC verisini alıyoruz
            return `O: ${ohlc.o}, H: ${ohlc.h}, L: ${ohlc.l}, C: ${ohlc.c}`; // Tooltip etiketini gösteriyoruz
          },
        },
      },
    },
  };

  const buttonStyle = (buttonInterval) => ({
    backgroundColor: interval === buttonInterval ? '#90EE90' : 'transparent', // Seçili interval için açık yeşil arka plan
    border: '1px solid #ccc',
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s', // Geçiş efekti
  });

  return (
    <div>
      {/* Current Price'ı başta gösteriyoruz */}
      <div style={{ marginBottom: 10, fontSize: '18px' }}>
        <strong>Current Price: {currentPrice} USDT</strong>
      </div>

      {/* Seçilen timestamp'ı gösteriyoruz */}
      {lastTimestamp && (
        <div style={{ marginBottom: 10, fontSize: '16px', fontWeight: 'bold' }}>
          <strong>Selected Timestamp: {new Date(lastTimestamp).toLocaleString()}</strong>
        </div>
      )}
      
      <div style={{ marginBottom: 10 }}>
        {['15m', '1h', '4h', '1d'].map((i) => (
          <button
            key={i}
            onClick={() => onIntervalChange(i)}
            style={buttonStyle(i)} // Dinamik arka plan rengi için buttonStyle fonksiyonunu çağırıyoruz
          >
            {i}
          </button>
        ))}
      </div>
      
      {/* Chart bileşenini render ediyoruz */}
      <Chart type="candlestick" data={data} options={options} />
    </div>
  );
};
