import React from 'react';
import { Bot, Wifi, WifiOff } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet.js';
import { useStore } from '../../store/index.js';

export default function Header() {
  const { walletConnected, shortAddress, connect, disconnect } = useWallet();
  const { aiPanelOpen, toggleAiPanel, ticker } = useStore();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: '52px', flexShrink: 0,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 600, color: '#fff',
        }}>S</div>
        <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.3px' }}>SosiQ</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 4 }}>
          AI DeFi Intelligence
        </span>
      </div>

      {/* Live ticker */}
      {ticker && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>BTC/USDC</span>
          <span className="mono" style={{ fontWeight: 500 }}>
            ${Number(ticker.lastPrice || 0).toLocaleString()}
          </span>
          <span className={Number(ticker.priceChangePercent) >= 0 ? 'positive' : 'negative'}>
            {Number(ticker.priceChangePercent) >= 0 ? '+' : ''}
            {Number(ticker.priceChangePercent || 0).toFixed(2)}%
          </span>
        </div>
      )}

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Testnet badge */}
        <span className="badge badge-amber">TESTNET</span>

        {/* AI panel toggle */}
        <button
          onClick={toggleAiPanel}
          title="Toggle AI assistant"
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
            border: `1px solid ${aiPanelOpen ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 6, background: aiPanelOpen ? 'var(--accent-dim)' : 'transparent',
            color: aiPanelOpen ? 'var(--accent)' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}
        >
          <Bot size={14} />
          AI
        </button>

        {/* Wallet */}
        <button
          onClick={walletConnected ? disconnect : connect}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
            border: `1px solid ${walletConnected ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 6,
            background: walletConnected ? 'var(--green-dim)' : 'var(--bg-hover)',
            color: walletConnected ? 'var(--green)' : 'var(--text-primary)',
            cursor: 'pointer', fontSize: 12, fontWeight: 500,
          }}
        >
          {walletConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {walletConnected ? shortAddress : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
