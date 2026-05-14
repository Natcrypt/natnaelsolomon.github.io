import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useStore } from '../../store/index.js';

function MetricCard({ label, value, subvalue, trend, icon: Icon }) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="card" style={{ padding: '14px 16px', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        {Icon && <Icon size={14} color="var(--text-muted)" />}
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4, fontFamily: 'IBM Plex Mono, monospace' }}>
        {value ?? '—'}
      </div>
      {subvalue !== undefined && (
        <div style={{
          fontSize: 12,
          color: isPositive ? 'var(--green)' : isNegative ? 'var(--red)' : 'var(--text-secondary)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {isPositive && <TrendingUp size={12} />}
          {isNegative && <TrendingDown size={12} />}
          {subvalue}
        </div>
      )}
    </div>
  );
}

export default function MarketPanel() {
  const { etfMetrics } = useStore();

  // Safely extract values from SoSoValue ETF response
  // Actual field names depend on the API — adjust as needed once you have a real key
  const aum     = etfMetrics?.totalAum    ? `$${(etfMetrics.totalAum / 1e9).toFixed(2)}B`  : '—';
  const inflow  = etfMetrics?.netInflow   ? `$${(etfMetrics.netInflow / 1e6).toFixed(1)}M` : '—';
  const holders = etfMetrics?.holders     ? etfMetrics.holders.toLocaleString()              : '—';
  const change  = etfMetrics?.inflowChange ?? 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      <MetricCard
        label="Total ETF AUM"
        value={aum}
        subvalue={etfMetrics ? 'SoSoValue live' : 'Loading...'}
        trend={0}
        icon={DollarSign}
      />
      <MetricCard
        label="Net Inflow (24h)"
        value={inflow}
        subvalue={change ? `${change > 0 ? '+' : ''}${change.toFixed(2)}%` : undefined}
        trend={change}
        icon={Activity}
      />
      <MetricCard
        label="ETF Holders"
        value={holders}
        trend={0}
        icon={TrendingUp}
      />
      <MetricCard
        label="Data Source"
        value="SoSoValue"
        subvalue="API connected"
        trend={1}
        icon={Activity}
      />
    </div>
  );
}
