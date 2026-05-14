import React from 'react';
import { useSosoData } from './hooks/useSosoData.js';
import { useSodexWebSocket } from './hooks/useSodexWebSocket.js';
import { useStore } from './store/index.js';
import Header from './components/dashboard/Header.jsx';
import Sidebar from './components/dashboard/Sidebar.jsx';
import MarketPanel from './components/dashboard/MarketPanel.jsx';
import OrderbookPanel from './components/trading/OrderbookPanel.jsx';
import OrderForm from './components/trading/OrderForm.jsx';
import NewsPanel from './components/dashboard/NewsPanel.jsx';
import AiPanel from './components/ai/AiPanel.jsx';

export default function App() {
  // Init data fetching
  useSosoData();
  useSodexWebSocket();

  const { aiPanelOpen } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar — symbol list */}
        <Sidebar />

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top row — ETF metrics + ticker */}
          <MarketPanel />

          {/* Middle row — orderbook + order form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '12px' }}>
            <OrderbookPanel />
            <OrderForm />
          </div>

          {/* Bottom row — news feed */}
          <NewsPanel />
        </main>

        {/* Right panel — AI assistant */}
        {aiPanelOpen && <AiPanel />}
      </div>
    </div>
  );
}
