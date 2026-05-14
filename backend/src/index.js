import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';

import sosoRoutes from './routes/soso.js';
import sodexRoutes from './routes/sodex.js';
import aiRoutes from './routes/ai.js';
import { initSodexWebSocket } from './services/sodexWs.js';

const app = express();
const server = createServer(app);

// ─── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests, slow down.' },
});
app.use('/api', limiter);

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/soso', sosoRoutes);
app.use('/api/sodex', sodexRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

// ─── 404 handler ─────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: 'Not found' }));

// ─── Error handler ───────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`\n🚀 SosiQ backend running on http://localhost:${PORT}`);
  initSodexWebSocket(server);
});

export default app;
