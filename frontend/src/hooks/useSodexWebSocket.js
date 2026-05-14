import { useEffect, useRef } from 'react';
import { useStore } from '../store/index.js';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws';
const RECONNECT_DELAY = 3000;

export function useSodexWebSocket() {
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const { setOrderbook, setTicker, setRecentTrades } = useStore();

  function connect() {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WS] Connected to SosiQ relay');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
      } catch {
        // ignore non-JSON
      }
    };

    ws.onerror = (err) => {
      console.error('[WS] Error:', err);
    };

    ws.onclose = () => {
      console.warn('[WS] Disconnected — reconnecting...');
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };
  }

  function handleMessage(msg) {
    if (!msg?.channel) return;

    switch (msg.channel) {
      case 'orderbook':
        if (msg.data) setOrderbook(msg.data);
        break;
      case 'ticker':
        if (msg.data) setTicker(msg.data);
        break;
      case 'trades':
        if (msg.data) {
          useStore.getState().setRecentTrades((prev) =>
            [msg.data, ...(prev || [])].slice(0, 50)
          );
        }
        break;
    }
  }

  function subscribeSymbol(symbolID, channel = 'orderbook') {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', symbolID, channel }));
    }
  }

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  return { subscribeSymbol };
}
