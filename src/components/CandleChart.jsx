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
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import useMexcCandles from '../hooks/useWebSocket';

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
    return lastData?.x?.getTime ? lastData.x.getTime() : null;
  }, [priceData]);

  const data = {
    datasets: [
      {
        label: 'DOGE/USDT',
        data: priceData,
        color: {
          up: 'rgba(0, 255, 0, 1)',
          down: 'rgba(255, 0, 0, 1)',
          unchanged: 'rgba(128, 128, 128, 1)',
        },
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: interval === '1d' ? 'day' : interval === '4h' ? 'hour' : 'minute',
          tooltipFormat: 'yyyy-MM-dd HH:mm',
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
            const ohlc = context.raw;
            if (!ohlc) return '';
            return `O: ${ohlc.o}, H: ${ohlc.h}, L: ${ohlc.l}, C: ${ohlc.c}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const buttonStyle = (buttonInterval) => ({
    backgroundColor: interval === buttonInterval ? '#90EE90' : 'transparent',
    border: '1px solid #ccc',
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginRight: '8px',
  });

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div style={{ marginBottom: 10, fontSize: '18px' }}>
        <strong>Current Price: {currentPrice || 'Loading...'} USDT</strong>
      </div>

      {lastTimestamp && (
        <div style={{ marginBottom: 10, fontSize: '16px', fontWeight: 'bold' }}>
          <strong>Last Updated: {new Date(lastTimestamp).toLocaleString()}</strong>
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        {['1m','15m', '60m', '4h', '1d'].map((i) => (
          <button key={i} onClick={() => onIntervalChange(i)} style={buttonStyle(i)}>
            {i}
          </button>
        ))}
      </div>

      <Chart type="candlestick" data={data} options={options} />
    </div>
  );
};
