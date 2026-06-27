import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PRESCRIPTIONS } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Prescription } from '../types/prescription.types';

type Filter = 'all' | 'active' | 'inactive';

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setPrescriptions(MOCK_PRESCRIPTIONS);
        return;
      }
      const active = filter === 'all' ? undefined : filter === 'active';
      const response = await apiClient.get<Prescription[]>(API_ROUTES.prescriptions.list(user?.id ?? '', active), token ?? undefined);
      setPrescriptions(response);
    } catch {
      setPrescriptions(MOCK_PRESCRIPTIONS);
    } finally {
      setLoading(false);
    }
  }, [filter, user?.id, token]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  const filtered = prescriptions
    .filter((p) => filter === 'all' || (filter === 'active' ? p.active : !p.active))
    .filter((p) => p.medicament.name.toLowerCase().includes(search.toLowerCase()));

  return { prescriptions: filtered, filter, setFilter, search, setSearch, loading, refetch: fetchPrescriptions };
}
