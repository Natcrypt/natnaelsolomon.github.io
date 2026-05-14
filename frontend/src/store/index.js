import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // ─── Market data ─────────────────────────────────────────
  etfMetrics:    null,
  etfInflow:     [],
  currencies:    [],
  news:          [],
  orderbook:     { bids: [], asks: [] },
  ticker:        null,
  recentTrades:  [],

  setEtfMetrics:   (data) => set({ etfMetrics: data }),
  setEtfInflow:    (data) => set({ etfInflow: data }),
  setCurrencies:   (data) => set({ currencies: data }),
  setNews:         (data) => set({ news: data }),
  setOrderbook:    (data) => set({ orderbook: data }),
  setTicker:       (data) => set({ ticker: data }),
  setRecentTrades: (data) => set({ recentTrades: data }),

  // ─── Wallet ──────────────────────────────────────────────
  walletAddress:  null,
  walletConnected: false,
  setWallet: (address) => set({ walletAddress: address, walletConnected: !!address }),

  // ─── Active symbol ───────────────────────────────────────
  activeSymbol:   { id: 1, name: 'BTC/USDC' },
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),

  // ─── AI chat ─────────────────────────────────────────────
  chatMessages:  [],
  chatLoading:   false,
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatLoading: (v) => set({ chatLoading: v }),

  // ─── UI ──────────────────────────────────────────────────
  aiPanelOpen: true,
  toggleAiPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
}));
