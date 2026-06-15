import { useState, useEffect, useCallback } from 'react';
// import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AdherenceReport, ReportPeriod } from '../types/report.types';

const MOCK_REPORT: AdherenceReport = {
  overallPercentage: 85,
  period: '7d',
  byMedication: [
    { prescriptionId: 'p1', medicamentName: 'Atorvastatina', dosage: '0.90', percentage: 66, taken: 4, scheduled: 6 },
    { prescriptionId: 'p2', medicamentName: 'Vitamina D', dosage: '1 cápsula', percentage: 100, taken: 7, scheduled: 7 },
    { prescriptionId: 'p3', medicamentName: 'Insulina', dosage: '10 unidades', percentage: 60, taken: 3, scheduled: 5 },
    { prescriptionId: 'p4', medicamentName: 'Vitamina B', dosage: '1 comprimido', percentage: 60, taken: 3, scheduled: 5 },
    { prescriptionId: 'p5', medicamentName: 'Lisinapril', dosage: '5mg', percentage: 60, taken: 3, scheduled: 5 },
  ],
};

export function useAdherence() {
  const [report, setReport] = useState<AdherenceReport | null>(null);
  const [period, setPeriod] = useState<ReportPeriod>('7d');
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   const response = await apiClient.get<AdherenceReport>(`/users/${user.id}/adherence?period=${period}`, token);
    //   setReport(response);
    // } catch {
    //   setReport({ ...MOCK_REPORT, period });
    // } finally {
    //   setLoading(false);
    // }
    setReport({ ...MOCK_REPORT, period });
    setLoading(false);
  }, [period]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return { report, period, setPeriod, loading };
}
