import { WebSocketServer, WebSocket } from 'ws';

const SODEX_WS = process.env.SODEX_TESTNET_WS || 'wss://testnet-gw.sodex.dev/ws';

let sodexSpotWs = null;
let wss = null;

// Reconnect delay in ms
const RECONNECT_DELAY = 3000;

/**
 * Connect to SoDEX testnet WebSocket and relay messages to all frontend clients
 */
function connectSodexWs() {
  console.log('[SoDEX WS] Connecting to', `${SODEX_WS}/spot`);
  sodexSpotWs = new WebSocket(`${SODEX_WS}/spot`);

  sodexSpotWs.on('open', () => {
    console.log('[SoDEX WS] Connected');
    // Subscribe to orderbook and trades for BTC/USDC (symbolID: 1)
    const subscriptions = [
      { method: 'subscribe', channel: 'orderbook', symbolID: 1 },
      { method: 'subscribe', channel: 'trades',    symbolID: 1 },
      { method: 'subscribe', channel: 'ticker',    symbolID: 1 },
    ];
    subscriptions.forEach((sub) => {
      sodexSpotWs.send(JSON.stringify(sub));
    });
  });

  sodexSpotWs.on('message', (raw) => {
    if (!wss) return;
    // Relay to all connected frontend clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(raw.toString());
      }
    });
  });

  sodexSpotWs.on('error', (err) => {
    console.error('[SoDEX WS] Error:', err.message);
  });

  sodexSpotWs.on('close', () => {
    console.warn(`[SoDEX WS] Disconnected — reconnecting in ${RECONNECT_DELAY}ms`);
    setTimeout(connectSodexWs, RECONNECT_DELAY);
  });
}

/**
 * Subscribe a specific frontend client to a symbol
 */
function handleClientMessage(message, clientWs) {
  try {
    const msg = JSON.parse(message);
    // Client can request to subscribe to a different symbol
    if (msg.type === 'subscribe' && msg.symbolID && sodexSpotWs?.readyState === WebSocket.OPEN) {
      sodexSpotWs.send(JSON.stringify({
        method: 'subscribe',
        channel: msg.channel || 'orderbook',
        symbolID: msg.symbolID,
      }));
    }
  } catch {
    // ignore malformed messages
  }
}

/**
 * Initialize the WebSocket server that proxies SoDEX to frontend clients
 * @param {import('http').Server} httpServer
 */
export function initSodexWebSocket(httpServer) {
  wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('[WSS] Frontend client connected');

    // Send a welcome/status message
    ws.send(JSON.stringify({ type: 'connected', message: 'SosiQ WebSocket ready' }));

    ws.on('message', (msg) => handleClientMessage(msg, ws));
    ws.on('close', () => console.log('[WSS] Frontend client disconnected'));
    ws.on('error', (err) => console.error('[WSS] Client error:', err.message));
  });

  // Connect to SoDEX
  connectSodexWs();

  console.log('[WSS] WebSocket relay server initialized at /ws');
}
