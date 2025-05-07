import React from 'react';

export const OpenOrders = ({ orders, currentPrice }) => {
  const calculatePnl = (order) => {
    if (order.side === 'BUY') {
      return ((currentPrice - order.price) * order.amount * order.leverage).toFixed(4);
    } else {
      return ((order.price - currentPrice) * order.amount * order.leverage).toFixed(4);
    }
  };

  return (
    <div className="open-orders">
      <h3>Open Positions</h3>
      {orders.length === 0 ? (
        <p>No open positions</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Side</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Leverage</th>
              <th>PNL</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td className={order.side.toLowerCase()}>{order.side}</td>
                <td>{order.price.toFixed(8)}</td>
                <td>{order.amount} USDT</td>
                <td>{order.leverage}x</td>
                <td className={calculatePnl(order) >= 0 ? 'positive' : 'negative'}>
                  {calculatePnl(order)} USDT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};