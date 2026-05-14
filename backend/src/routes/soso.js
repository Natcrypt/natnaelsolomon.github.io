import { Router } from 'express';
import {
  getEtfCurrent,
  getEtfInflowHistory,
  getCurrencies,
  getFeaturedNews,
  getNewsByCurrency,
} from '../services/sosovalue.js';

const router = Router();

// GET /api/soso/etf/current
// Returns current ETF metrics (AUM, inflow, price etc.)
router.get('/etf/current', async (req, res, next) => {
  try {
    const data = await getEtfCurrent();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/soso/etf/inflow?days=30
// Returns historical ETF inflow chart data
router.get('/etf/inflow', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await getEtfInflowHistory(days);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/soso/currencies
// Returns list of all supported currencies/tokens
router.get('/currencies', async (req, res, next) => {
  try {
    const data = await getCurrencies();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/soso/news?page=1&size=10
// Returns featured AI-curated news feed
router.get('/news', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const data = await getFeaturedNews(page, size);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/soso/news/:currencyId?page=1&size=10
// Returns news filtered by currency
router.get('/news/:currencyId', async (req, res, next) => {
  try {
    const { currencyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const data = await getNewsByCurrency(currencyId, page, size);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
