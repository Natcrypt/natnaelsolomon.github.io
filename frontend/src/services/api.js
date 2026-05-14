import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message;
    throw new Error(msg);
  }
);

// ─── SoSoValue ───────────────────────────────────────────────
export const sosoApi = {
  getEtfCurrent:    ()             => api.get('/soso/etf/current'),
  getEtfInflow:     (days = 30)    => api.get(`/soso/etf/inflow?days=${days}`),
  getCurrencies:    ()             => api.get('/soso/currencies'),
  getNews:          (page = 1)     => api.get(`/soso/news?page=${page}&size=20`),
  getNewsByCurrency:(id, page = 1) => api.get(`/soso/news/${id}?page=${page}`),
};

// ─── SoDEX ───────────────────────────────────────────────────
export const sodexApi = {
  getOrderbook: (symbolID = 1) => api.get(`/sodex/orderbook?symbolID=${symbolID}`),
  getAccount:   (accountID)    => api.get(`/sodex/account?accountID=${accountID}`),
  placeOrder:   (order)        => api.post('/sodex/order', order),
  cancelOrder:  (params)       => api.delete('/sodex/order', { data: params }),
};

// ─── AI ──────────────────────────────────────────────────────
export const aiApi = {
  chat: (messages, symbolID = 1) =>
    api.post('/ai/chat', { messages, symbolID }),
};
