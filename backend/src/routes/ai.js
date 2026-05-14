import { Router } from 'express';
import { getEtfCurrent, getFeaturedNews } from '../services/sosovalue.js';
import { getOrderbook } from '../services/sodex.js';

const router = Router();

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/**
 * POST /api/ai/chat
 * Body: { messages: [{role, content}], symbolID? }
 * Injects live market context into the system prompt
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { messages, symbolID = 1 } = req.body;
    if (!messages?.length) return res.status(400).json({ error: 'messages array required' });

    // Fetch live context in parallel
    const [etfData, newsData, orderbookData] = await Promise.allSettled([
      getEtfCurrent(),
      getFeaturedNews(1, 5),
      getOrderbook(symbolID),
    ]);

    const etf       = etfData.status === 'fulfilled'       ? JSON.stringify(etfData.value,       null, 2) : 'unavailable';
    const news      = newsData.status === 'fulfilled'      ? JSON.stringify(newsData.value,      null, 2) : 'unavailable';
    const orderbook = orderbookData.status === 'fulfilled' ? JSON.stringify(orderbookData.value, null, 2) : 'unavailable';

    const systemPrompt = `You are SosiQ's AI research assistant — a concise, sharp crypto market analyst embedded in a live DeFi trading dashboard.

You have access to real-time market data injected below. Use it to answer the trader's questions accurately. Be direct and specific. Avoid generic advice.

═══ LIVE MARKET DATA ═══

[ETF Metrics]
${etf}

[Latest News (top 5)]
${news}

[SoDEX Orderbook — Symbol ${symbolID}]
${orderbook}

═══════════════════════

Guidelines:
- Reference the live data when relevant (e.g. "ETF inflow is currently X...")
- Keep responses concise — this is a trading terminal, not an essay
- If data shows a notable signal, highlight it clearly
- Do not invent data not present in the context above
- You can suggest trades but always note testnet context`;

    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Claude API error');
    }

    const data = await response.json();
    const text = data.content?.map((b) => b.text || '').join('') || '';

    res.json({ reply: text, usage: data.usage });
  } catch (err) {
    next(err);
  }
});

export default router;
