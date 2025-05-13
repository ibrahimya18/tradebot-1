export const setupWebSocket = (symbol, onMessage) => {
    const ws = new WebSocket('wss://wbs.mexc.com/ws');
  
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({
        method: "SUBSCRIPTION",
        params: [`spot@public.miniTicker.v3.api@${symbol}@UTC+3`]
      }));
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
  
    return ws;
  };