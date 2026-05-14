import React from 'react';
import { useStore } from '../../store/index.js';

const SYMBOLS = [
  { id: 1, name: 'BTC/USDC', base: 'BTC' },
  { id: 2, name: 'ETH/USDC', base: 'ETH' },
  { id: 3, name: 'SOL/USDC', base: 'SOL' },
  { id: 4, name: 'BNB/USDC', base: 'BNB' },
];

export default function Sidebar() {
  const { activeSymbol, setActiveSymbol } = useStore();

  return (
    <aside style={{
      width: 160, flexShrink: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      padding: '8px 0',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '6px 12px 10px', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Markets
      </div>
      {SYMBOLS.map((sym) => {
        const isActive = activeSymbol.id === sym.id;
        return (
          <button
            key={sym.id}
            onClick={() => setActiveSymbol(sym)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '9px 12px',
              background: isActive ? 'var(--bg-hover)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              border: 'none',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 500 : 400,
            }}
          >
            {sym.name}
          </button>
        );
      })}

      {/* SoSoValue branding */}
      <div style={{
        position: 'absolute', bottom: 12, left: 0, width: 160,
        padding: '0 12px', fontSize: 10, color: 'var(--text-muted)',
      }}>
        Data by SoSoValue
      </div>
    </aside>
  );
}
