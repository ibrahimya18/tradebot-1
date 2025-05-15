import { useEffect, useRef, useState } from 'react';

export default function useMexcCandles(symbol = 'dogeusdt', interval = 'Min1') {
  const [candles, setCandles] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('wss://wbs.mexc.com/ws');

    ws.current.onopen = () => {
      const payload = {
        method: "SUBSCRIBE",
        params: [`spot@public.kline.v3.api.${symbol}@${interval}`] 
      };
      ws.current.send(JSON.stringify(payload));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.data && message.data.k) {
        const k = message.data.k;

        const candle = {
          x: new Date(k.t),
          o: parseFloat(k.o),
          h: parseFloat(k.h),
          l: parseFloat(k.l),
          c: parseFloat(k.c),
        };

        setCandles((prevCandles) => {
          const last = prevCandles[prevCandles.length - 1];
          if (last && last.x.getTime() === candle.x.getTime()) {
            return [...prevCandles.slice(0, -1), candle];
          } else {
            return [...prevCandles, candle];
          }
        });
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.current?.close();
    };
  }, [symbol, interval]);

  return candles;
}
