import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { aiApi } from '../../services/api.js';
import { useStore } from '../../store/index.js';

const SUGGESTIONS = [
  'What do the current ETF inflows signal?',
  'Is now a good time to long BTC on testnet?',
  'Explain the current orderbook imbalance',
  'Summarize today\'s top news',
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 12,
    }}>
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <Bot size={12} color="var(--accent)" />
          <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>SosiQ AI</span>
        </div>
      )}
      <div style={{
        maxWidth: '90%', padding: '8px 12px', borderRadius: 8, fontSize: 13, lineHeight: 1.6,
        background: isUser ? 'var(--accent-dim)' : 'var(--bg-hover)',
        border: `1px solid ${isUser ? 'var(--accent)' : 'var(--border)'}`,
        color: isUser ? 'var(--accent)' : 'var(--text-primary)',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

export default function AiPanel() {
  const { chatMessages, chatLoading, addChatMessage, setChatLoading, toggleAiPanel, activeSymbol } = useStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  async function sendMessage(text) {
    const content = text || input.trim();
    if (!content) return;
    setInput('');

    const userMsg = { role: 'user', content };
    addChatMessage(userMsg);
    setChatLoading(true);

    try {
      const history = [...chatMessages, userMsg].map(({ role, content }) => ({ role, content }));
      const { reply } = await aiApi.chat(history, activeSymbol.id);
      addChatMessage({ role: 'assistant', content: reply });
    } catch (err) {
      addChatMessage({ role: 'assistant', content: `Error: ${err.message}` });
    } finally {
      setChatLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <aside style={{
      width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Bot size={15} color="var(--accent)" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>AI Research Assistant</span>
        </div>
        <button onClick={toggleAiPanel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {chatMessages.length === 0 && (
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
              Ask me anything about the market. I have access to live ETF data, news, and the current orderbook.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    textAlign: 'left', padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                    background: 'var(--bg-hover)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.4,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => <Message key={i} msg={msg} />)}

        {chatLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
            <Bot size={12} color="var(--accent)" />
            <span>Analyzing live data...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about the market..."
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 6, fontSize: 13,
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', outline: 'none',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={chatLoading || !input.trim()}
          style={{
            width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer',
            background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: chatLoading || !input.trim() ? 0.5 : 1,
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </aside>
  );
}
