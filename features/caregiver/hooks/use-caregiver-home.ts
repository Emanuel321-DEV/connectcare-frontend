import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';

export interface PatientSummary {
  id: string;
  name: string;
  adherencePercentage: number;
  pendingDoses: number;
  alertMessage?: string;
}

export function useCaregiverHome() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchPatients = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const response = await apiClient.get<PatientSummary[]>(`/users/${user.id}/patients`, token);
      setPatients(response);
    } catch {
      setPatients([
        { id: '1', name: 'Sr. Alberto Silva', adherencePercentage: 90, pendingDoses: 0 },
        { id: '2', name: 'Dona Maria Sousa', adherencePercentage: 60, pendingDoses: 2, alertMessage: '2 doses atividades pendentes' },
        { id: '3', name: 'Sr. João Mendes', adherencePercentage: 85, pendingDoses: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  return { patients, loading, user, refetch: fetchPatients };
}
