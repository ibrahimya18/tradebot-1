import React from 'react';
import { Line } from 'react-chartjs-2';

export const Chart = ({ priceHistory, currentPrice }) => {
  const data = {
    labels: priceHistory.map((_, i) => i),
    datasets: [
      {
        label: 'DOGE/USDT Price',
        data: priceHistory,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
              return `Price: ${context.parsed.y.toFixed(8)} USDT`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value.toFixed(8);
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <h3>Current Price: {currentPrice.toFixed(8)} USDT</h3>
      <Line data={data} options={options} />
    </div>
  );
};