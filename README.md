# SosiQ — AI DeFi Intelligence Dashboard

> Real-time ETF data + SoDEX on-chain trading + AI research assistant, in one dashboard.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, Recharts |
| Backend | Node.js, Express, ethers.js (EIP-712 signing), ws |
| APIs | SoSoValue API, SoDEX Testnet API, Claude API |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
sosiq/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express server entry
│   │   ├── routes/
│   │   │   ├── soso.js           # SoSoValue API proxy routes
│   │   │   ├── sodex.js          # SoDEX REST routes
│   │   │   └── ai.js             # Claude AI assistant route
│   │   └── services/
│   │       ├── sosovalue.js      # SoSoValue API client
│   │       ├── sodex.js          # SoDEX REST + EIP-712 signing
│   │       └── sodexWs.js        # SoDEX WebSocket relay
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Root layout
│   │   ├── components/
│   │   │   ├── dashboard/        # Header, Sidebar, MarketPanel, NewsPanel
│   │   │   ├── trading/          # OrderbookPanel, OrderForm
│   │   │   └── ai/               # AiPanel (Claude assistant)
│   │   ├── hooks/                # useSosoData, useSodexWebSocket, useWallet
│   │   ├── services/api.js       # Frontend API client
│   │   └── store/index.js        # Zustand global state
│   ├── .env.example
│   └── package.json
└── package.json                  # Root monorepo scripts
```

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/sosiq.git
cd sosiq
npm run install:all
```

### 2. Configure environment variables

**Backend:**
```bash
cp backend/.env.example backend/.env
```

Fill in:
- `SOSOVALUE_API_KEY` — from [sosovalue.com/developer](https://sosovalue.com/developer)
- `SODEX_PRIVATE_KEY` — your EVM wallet private key (use a dedicated API wallet)
- `SODEX_ACCOUNT_ID` — your SoDEX account ID
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```

Default values work for local dev (proxy is configured in `vite.config.js`).

### 3. Run in development

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:5173`

---

## SoDEX Testnet Setup

1. Sign up at [sodex.com/join/SOSOJP](https://sodex.com/join/SOSOJP)
2. Connect MetaMask to the SoDEX testnet network
3. Claim free USDC + SOSO test tokens from [testnet.sodex.com/faucet](https://testnet.sodex.com/faucet)
4. Your EVM wallet address is your API key — no separate key needed
5. Set `SODEX_PRIVATE_KEY` to your wallet's private key in `.env`

**Testnet chain config:**
- Chain ID: `138565`
- REST base: `https://testnet-gw.sodex.dev/api/v1`
- WebSocket: `wss://testnet-gw.sodex.dev/ws`

---

## Deployment

**Frontend (Vercel):**
```bash
cd frontend && npm run build
# Deploy /dist to Vercel
```

**Backend (Railway):**
- Connect GitHub repo
- Set root directory to `/backend`
- Add all `.env` variables in Railway dashboard

---

## APIs Used

| API | Purpose |
|-----|---------|
| `GET /api/v1/etf/current` | Live ETF metrics (AUM, inflow) |
| `GET /api/v1/etf/history/inflow` | Historical ETF inflow chart |
| `GET /api/v1/news/featured` | AI-curated crypto news |
| `GET /api/v1/currency/list` | Supported currencies |
| `GET /spot/orderbook` | SoDEX live orderbook |
| `POST /spot/exchange` | Place/cancel orders (EIP-712 signed) |
| `WSS /ws/spot` | Live orderbook + trade stream |
| Anthropic Claude | AI assistant with live market context |

---

## Buildathon

Built for the SoSoValue × SoDEX Buildathon.
