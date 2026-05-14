import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useStore } from '../../store/index.js';

export default function NewsPanel() {
  const { news } = useStore();

  return (
    <div className="card" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>AI News Feed</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Powered by SoSoValue</span>
      </div>

      {news.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: '12px 0', textAlign: 'center' }}>
          Loading news...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {news.slice(0, 6).map((item, i) => (
            <a
              key={item.id || i}
              href={item.sourceLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', padding: '10px 12px',
                background: 'var(--bg-hover)', borderRadius: 7,
                border: '1px solid var(--border)',
                textDecoration: 'none', color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-primary)', flex: 1, margin: 0 }}>
                  {item.title || 'Untitled'}
                </p>
                <ExternalLink size={11} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                {item.author && (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.author}</span>
                )}
                {item.releaseTime && (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {new Date(item.releaseTime).toLocaleDateString()}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
