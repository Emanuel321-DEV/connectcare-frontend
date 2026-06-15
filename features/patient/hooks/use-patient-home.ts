import { useState, useEffect, useCallback } from 'react';
// import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { DoseItem } from '../types/schedule.types';

interface PatientHomeData {
  adherencePercentage: number;
  todayDoses: DoseItem[];
  takenCount: number;
  pendingCount: number;
  skippedCount: number;
}

const MOCK_DATA: PatientHomeData = {
  adherencePercentage: 85,
  todayDoses: [
    { id: '1', prescriptionId: 'p1', medicamentName: 'Atorvastatina', dosage: '0.90', scheduledTime: '09:00', status: 'taken' },
    { id: '2', prescriptionId: 'p2', medicamentName: 'Vitamina D', dosage: '1 cápsula', scheduledTime: '09:00', status: 'taken' },
    { id: '3', prescriptionId: 'p3', medicamentName: 'Metformina', dosage: '1 comprimido', scheduledTime: '13:00', status: 'pending' },
  ],
  takenCount: 2,
  pendingCount: 1,
  skippedCount: 0,
};

export function usePatientHome() {
  const [data, setData] = useState<PatientHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  const fetchData = useCallback(async () => {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   const response = await apiClient.get<PatientHomeData>(`/users/${user.id}/home`, token);
    //   setData(response);
    // } catch {
    //   setData(MOCK_DATA);
    // } finally {
    //   setLoading(false);
    // }
    setData(MOCK_DATA);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refetch: fetchData, user };
}
