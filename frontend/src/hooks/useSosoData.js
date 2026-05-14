import { useEffect, useCallback } from 'react';
import { sosoApi } from '../services/api.js';
import { useStore } from '../store/index.js';

const POLL_INTERVAL = 60_000; // 1 minute (respect 20 calls/min limit)

export function useSosoData() {
  const { setEtfMetrics, setEtfInflow, setNews } = useStore();

  const fetchAll = useCallback(async () => {
    try {
      const [etf, inflow, news] = await Promise.allSettled([
        sosoApi.getEtfCurrent(),
        sosoApi.getEtfInflow(30),
        sosoApi.getNews(1),
      ]);

      if (etf.status === 'fulfilled')    setEtfMetrics(etf.value);
      if (inflow.status === 'fulfilled') setEtfInflow(inflow.value);
      if (news.status === 'fulfilled')   setNews(news.value?.list || news.value || []);
    } catch (err) {
      console.error('[SoSoValue] Fetch error:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);
}
