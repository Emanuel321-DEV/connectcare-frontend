import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENTS } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PatientSummary } from '../types/caregiver.types';

export type { PatientSummary };

export function useCaregiverHome() {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setPatients(MOCK_PATIENTS);
        return;
      }
      const response = await apiClient.get<PatientSummary[]>(API_ROUTES.users.patients(user?.id ?? ''), token ?? undefined);
      setPatients(response);
    } catch {
      setPatients(MOCK_PATIENTS);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  return { patients, loading, user, refetch: fetchPatients };
}
