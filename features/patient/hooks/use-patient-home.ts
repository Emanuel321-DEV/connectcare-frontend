import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENT_HOME } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { DoseItem, PatientHomeData } from '../types/schedule.types';

// Não existe endpoint /home no backend. Montamos o resumo a partir de
// GET /users/{userId}/dose-records (ver docs/api.yaml, schema DoseRecord).
interface RawDoseRecord {
  id: string;
  prescription_id: string;
  medicament_name: string;
  dosage: string;
  scheduled_at: string;
  status: 'PENDING' | 'TAKEN' | 'MISSED';
  confirmed_at: string | null;
}

function buildHomeData(records: RawDoseRecord[]): PatientHomeData {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter((r) => r.scheduled_at.startsWith(todayStr));

  const todayDoses: DoseItem[] = todayRecords.map((r) => ({
    id: r.id,
    prescriptionId: r.prescription_id,
    medicamentName: r.medicament_name,
    dosage: r.dosage,
    scheduledTime: new Date(r.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    status: r.status === 'TAKEN' ? 'taken' : r.status === 'MISSED' ? 'skipped' : 'pending',
    takenAt: r.confirmed_at ?? undefined,
  }));

  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;
  const pendingCount = todayDoses.filter((d) => d.status === 'pending').length;
  const skippedCount = todayDoses.filter((d) => d.status === 'skipped').length;

  const totalTaken = records.filter((r) => r.status === 'TAKEN').length;
  const totalFinished = records.filter((r) => r.status === 'TAKEN' || r.status === 'MISSED').length;
  const adherencePercentage = totalFinished > 0 ? Math.round((totalTaken / totalFinished) * 100) : 100;

  return { adherencePercentage, todayDoses, takenCount, pendingCount, skippedCount };
}

export function usePatientHome() {
  const [data, setData] = useState<PatientHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setData(MOCK_PATIENT_HOME);
        return;
      }
      const records = await apiClient.get<RawDoseRecord[]>(
        API_ROUTES.users.doseRecords(user?.id ?? ''),
        token ?? undefined
      );
      setData(buildHomeData(records));
    } catch {
      setData(MOCK_PATIENT_HOME);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refetch: fetchData, user };
}
