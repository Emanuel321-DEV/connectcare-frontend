import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_REPORT } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AdherenceReport, MedicationAdherence, ReportPeriod } from '../types/report.types';

// Não existe endpoint /adherence no backend. Montamos o relatório a partir de
// GET /users/{userId}/dose-records (ver docs/api.yaml, schema DoseRecord),
// filtrando pela janela de dias do período e calculando os percentuais aqui.
interface RawDoseRecord {
  id: string;
  prescription_id: string;
  medicament_name: string;
  dosage: string;
  scheduled_at: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  confirmed_at: string | null;
}

const PERIOD_DAYS: Record<ReportPeriod, number> = {
  '7d': 7,
  '30d': 30,
};

function buildReport(records: RawDoseRecord[], period: ReportPeriod): AdherenceReport {
  const days = PERIOD_DAYS[period];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const windowed = records.filter((r) => new Date(r.scheduled_at) >= cutoff);

  const byPrescription = new Map<string, RawDoseRecord[]>();
  for (const record of windowed) {
    const list = byPrescription.get(record.prescription_id) ?? [];
    list.push(record);
    byPrescription.set(record.prescription_id, list);
  }

  const byMedication: MedicationAdherence[] = Array.from(byPrescription.entries()).map(
    ([prescriptionId, recs]) => {
      const taken = recs.filter((r) => r.status === 'TAKEN').length;
      const scheduled = recs.filter((r) => r.status === 'TAKEN' || r.status === 'MISSED').length;
      const percentage = scheduled > 0 ? Math.round((taken / scheduled) * 100) : 100;
      return {
        prescriptionId,
        medicamentName: recs[0].medicament_name,
        dosage: recs[0].dosage,
        percentage,
        taken,
        scheduled,
      };
    }
  );

  const totalTaken = windowed.filter((r) => r.status === 'TAKEN').length;
  const totalScheduled = windowed.filter((r) => r.status === 'TAKEN' || r.status === 'MISSED').length;
  const overallPercentage = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 100;

  return { overallPercentage, period, byMedication };
}

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
      const records = await apiClient.get<RawDoseRecord[]>(
        API_ROUTES.users.doseRecords(user?.id ?? ''),
        token ?? undefined
      );
      setReport(buildReport(records, period));
    } catch {
      setReport({ ...MOCK_REPORT, period });
    } finally {
      setLoading(false);
    }
  }, [period, user?.id, token]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return { report, period, setPeriod, loading };
}
