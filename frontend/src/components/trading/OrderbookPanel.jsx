import React, { useMemo } from 'react';
import { useStore } from '../../store/index.js';

function OrderRow({ price, qty, total, maxTotal, side }) {
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  const isAsk = side === 'ask';

  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '2px 12px', fontSize: 12 }}>
      {/* Depth bar */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0,
        right: 0, width: `${pct}%`,
        background: isAsk ? 'rgba(255,77,106,0.08)' : 'rgba(0,212,170,0.08)',
      }} />
      <span className="mono" style={{ color: isAsk ? 'var(--red)' : 'var(--green)', position: 'relative' }}>
        {Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <span className="mono" style={{ textAlign: 'right', color: 'var(--text-secondary)', position: 'relative' }}>
        {Number(qty).toFixed(4)}
      </span>
      <span className="mono" style={{ textAlign: 'right', color: 'var(--text-muted)', position: 'relative' }}>
        {Number(total).toFixed(2)}
      </span>
    </div>
  );
}

export default function OrderbookPanel() {
  const { orderbook, ticker } = useStore();

  const asks = useMemo(() => {
    const raw = (orderbook?.asks || []).slice(0, 15);
    let cum = 0;
    return raw.map(([price, qty]) => ({ price, qty, total: (cum += Number(qty)) })).reverse();
  }, [orderbook]);

  const bids = useMemo(() => {
    const raw = (orderbook?.bids || []).slice(0, 15);
    let cum = 0;
    return raw.map(([price, qty]) => ({ price, qty, total: (cum += Number(qty)) }));
  }, [orderbook]);

  const maxTotal = Math.max(
    asks[asks.length - 1]?.total ?? 0,
    bids[bids.length - 1]?.total ?? 0,
  );

  const spread = asks.length && bids.length
    ? (Number(asks[asks.length - 1].price) - Number(bids[0].price)).toFixed(2)
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>Orderbook</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>SoDEX Testnet</span>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border)' }}>
        {['Price (USDC)', 'Amount', 'Total'].map((h) => (
          <span key={h} style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: h !== 'Price (USDC)' ? 'right' : 'left' }}>{h}</span>
        ))}
      </div>

      {/* Asks */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {asks.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            Waiting for orderbook data...
          </div>
        ) : (
          asks.map((row, i) => (
            <OrderRow key={i} {...row} side="ask" maxTotal={maxTotal} />
          ))
        )}
      </div>

      {/* Spread */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 16, fontWeight: 600 }}>
          {ticker ? `$${Number(ticker.lastPrice || 0).toLocaleString()}` : '—'}
        </span>
        {spread && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Spread: ${spread}</span>}
      </div>

      {/* Bids */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {bids.map((row, i) => (
          <OrderRow key={i} {...row} side="bid" maxTotal={maxTotal} />
        ))}
      </div>
    </div>
  );
}
