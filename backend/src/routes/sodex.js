import { Router } from 'express';
import { getOrderbook, getAccount, placeOrder, cancelOrder } from '../services/sodex.js';

const router = Router();

// GET /api/sodex/orderbook?symbolID=1
router.get('/orderbook', async (req, res, next) => {
  try {
    const symbolID = parseInt(req.query.symbolID) || 1;
    const data = await getOrderbook(symbolID);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/sodex/account?accountID=123
router.get('/account', async (req, res, next) => {
  try {
    const accountID = req.query.accountID || process.env.SODEX_ACCOUNT_ID;
    if (!accountID) return res.status(400).json({ error: 'accountID required' });
    const data = await getAccount(accountID);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /api/sodex/order
// Body: { symbolID, side, type, price, quantity, timeInForce }
router.post('/order', async (req, res, next) => {
  try {
    const { symbolID, side, type, price, quantity, timeInForce } = req.body;
    if (!symbolID || !side || !type || !quantity) {
      return res.status(400).json({ error: 'symbolID, side, type, quantity required' });
    }
    const result = await placeOrder({ symbolID, side, type, price, quantity, timeInForce });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/sodex/order
// Body: { symbolID, clOrdID }
router.delete('/order', async (req, res, next) => {
  try {
    const { symbolID, clOrdID } = req.body;
    if (!symbolID || !clOrdID) {
      return res.status(400).json({ error: 'symbolID and clOrdID required' });
    }
    const result = await cancelOrder({ symbolID, clOrdID });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
