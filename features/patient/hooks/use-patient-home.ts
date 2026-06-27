import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PATIENT_HOME } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PatientHomeData } from '../types/schedule.types';

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
      const response = await apiClient.get<PatientHomeData>(API_ROUTES.users.home(user?.id ?? ''), token ?? undefined);
      setData(response);
    } catch {
      setData(MOCK_PATIENT_HOME);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, refetch: fetchData, user };
}
