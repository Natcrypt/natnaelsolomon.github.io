import React, { useState } from 'react';
import { sodexApi } from '../../services/api.js';
import { useStore } from '../../store/index.js';
import { useWallet } from '../../hooks/useWallet.js';

export default function OrderForm() {
  const { activeSymbol, ticker } = useStore();
  const { walletConnected, connect } = useWallet();

  const [side, setSide]           = useState('buy');    // 'buy' | 'sell'
  const [orderType, setOrderType] = useState('limit');  // 'limit' | 'market'
  const [price, setPrice]         = useState('');
  const [quantity, setQuantity]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState(null);     // { type, msg }

  const total = price && quantity ? (parseFloat(price) * parseFloat(quantity)).toFixed(2) : '—';

  async function handleSubmit() {
    if (!walletConnected) { connect(); return; }
    if (!quantity || (orderType === 'limit' && !price)) {
      setStatus({ type: 'error', msg: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await sodexApi.placeOrder({
        symbolID: activeSymbol.id,
        side: side === 'buy' ? 1 : 2,
        type: orderType === 'limit' ? 1 : 2,
        price: orderType === 'limit' ? price : undefined,
        quantity,
      });
      setStatus({ type: 'success', msg: `${side.toUpperCase()} order placed successfully!` });
      setPrice('');
      setQuantity('');
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  const isBuy = side === 'buy';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '12px 14px', gap: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>
        Place Order — {activeSymbol.name}
      </div>

      {/* Buy / Sell tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {['buy', 'sell'].map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            style={{
              padding: '8px 0', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: side === s ? (s === 'buy' ? 'var(--green)' : 'var(--red)') : 'var(--bg-hover)',
              color: side === s ? '#0a0b0f' : 'var(--text-secondary)',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Order type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {['limit', 'market'].map((t) => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            style={{
              padding: '5px 0', borderRadius: 5, cursor: 'pointer', fontSize: 11, fontWeight: 500,
              border: `1px solid ${orderType === t ? 'var(--accent)' : 'var(--border)'}`,
              background: orderType === t ? 'var(--accent-dim)' : 'transparent',
              color: orderType === t ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Price (limit only) */}
      {orderType === 'limit' && (
        <div>
          <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            Price (USDC)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={ticker ? Number(ticker.lastPrice).toLocaleString() : '0.00'}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 6, fontSize: 13,
              background: 'var(--bg-hover)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', outline: 'none', fontFamily: 'IBM Plex Mono, monospace',
            }}
          />
        </div>
      )}

      {/* Quantity */}
      <div>
        <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
          Amount ({activeSymbol.base || 'BASE'})
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.0000"
          style={{
            width: '100%', padding: '8px 10px', borderRadius: 6, fontSize: 13,
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', outline: 'none', fontFamily: 'IBM Plex Mono, monospace',
          }}
        />
      </div>

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span style={{ color: 'var(--text-muted)' }}>Total</span>
        <span className="mono" style={{ color: 'var(--text-secondary)' }}>{total} USDC</span>
      </div>

      {/* Status */}
      {status && (
        <div style={{
          padding: '8px 10px', borderRadius: 6, fontSize: 12,
          background: status.type === 'success' ? 'var(--green-dim)' : 'var(--red-dim)',
          color:      status.type === 'success' ? 'var(--green)'     : 'var(--red)',
          border: `1px solid ${status.type === 'success' ? 'var(--green)' : 'var(--red)'}`,
        }}>
          {status.msg}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '10px 0', borderRadius: 7, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 600, fontSize: 14,
          background: isBuy ? 'var(--green)' : 'var(--red)',
          color: '#0a0b0f',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Placing...' : walletConnected ? `${isBuy ? 'Buy' : 'Sell'} ${activeSymbol.base}` : 'Connect Wallet to Trade'}
      </button>

      <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>
        Trading on SoDEX testnet — no real funds
      </p>
    </div>
  );
}
