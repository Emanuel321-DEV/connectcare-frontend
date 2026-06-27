import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_REPORT } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AdherenceReport, ReportPeriod } from '../types/report.types';

export function useAdherence() {
  const [report, setReport] = useState<AdherenceReport | null>(null);
  const [period, setPeriod] = useState<ReportPeriod>('7d');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setReport({ ...MOCK_REPORT, period });
        return;
      }
      const response = await apiClient.get<AdherenceReport>(`/users/${user?.id}/adherence?period=${period}`, token ?? undefined);
      setReport(response);
    } catch {
      setReport({ ...MOCK_REPORT, period });
    } finally {
      setLoading(false);
    }
  }, [period, user?.id, token]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return { report, period, setPeriod, loading };
}
