import axios from 'axios';

const client = axios.create({
  baseURL: process.env.SOSOVALUE_BASE_URL || 'https://openapi.sosovalue.com/api/v1',
  headers: {
    'x-soso-api-key': process.env.SOSOVALUE_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercept responses — surface API errors clearly
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.msg || err.message;
    const status = err.response?.status || 500;
    const error = new Error(`SoSoValue API error ${status}: ${msg}`);
    error.status = status;
    throw error;
  }
);

// ─── ETF ─────────────────────────────────────────────────────

/**
 * Get current ETF metrics (AUM, net inflow, price, etc.)
 * Endpoint: GET /etf/current
 */
export async function getEtfCurrent() {
  return client.get('/etf/current');
}

/**
 * Get historical ETF inflow chart data
 * Endpoint: GET /etf/history/inflow
 * @param {number} days - number of days to look back (default 30)
 */
export async function getEtfInflowHistory(days = 30) {
  return client.get('/etf/history/inflow', { params: { days } });
}

// ─── Currencies ──────────────────────────────────────────────

/**
 * Get list of all listed currencies
 * Endpoint: GET /currency/list
 */
export async function getCurrencies() {
  return client.get('/currency/list');
}

// ─── News ────────────────────────────────────────────────────

/**
 * Get featured AI-curated news feed
 * Endpoint: GET /news/featured
 * @param {number} pageNum
 * @param {number} pageSize
 */
export async function getFeaturedNews(pageNum = 1, pageSize = 10) {
  return client.get('/news/featured', {
    params: { pageNum, pageSize },
  });
}

/**
 * Get featured news filtered by currency
 * Endpoint: GET /news/featured/currency
 * @param {string} currencyId
 * @param {number} pageNum
 * @param {number} pageSize
 */
export async function getNewsByCurrency(currencyId, pageNum = 1, pageSize = 10) {
  return client.get('/news/featured/currency', {
    params: { currencyId, pageNum, pageSize },
  });
}
