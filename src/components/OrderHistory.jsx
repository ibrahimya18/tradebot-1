import React from 'react';

export const OrderHistory = ({ history }) => {
  return (
    <div className="order-history">
      <h3>Trade History</h3>
      {history.length === 0 ? (
        <p>No trade history</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Side</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Leverage</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {history.map((order, index) => (
              <tr key={index}>
                <td>{new Date(order.timestamp).toLocaleString()}</td>
                <td className={order.side.toLowerCase()}>{order.side}</td>
                <td>{order.price.toFixed(8)}</td>
                <td>{order.amount} USDT</td>
                <td>{order.leverage}x</td>
                <td className={order.pnl >= 0 ? 'positive' : 'negative'}>
                  {order.pnl.toFixed(4)} USDT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};