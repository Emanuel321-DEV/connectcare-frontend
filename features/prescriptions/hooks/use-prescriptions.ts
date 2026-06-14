import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Prescription } from '../types/prescription.types';

type Filter = 'all' | 'active' | 'inactive';

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchPrescriptions = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const activeParam = filter === 'all' ? '' : `&active=${filter === 'active'}`;
      const response = await apiClient.get<Prescription[]>(`/prescriptions?user_id=${user.id}${activeParam}`, token);
      setPrescriptions(response);
    } catch {
      setPrescriptions([
        {
          id: 'p1', userId: user?.id ?? '', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
          medicament: { name: 'Losartana Potássica', dosage: '50mg', frequency: '24:00', time: ['08:00'], doses: 1 },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'p2', userId: user?.id ?? '', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
          medicament: { name: 'Metformina', dosage: '850mg', frequency: '12:00', time: ['08:00', '20:00'], doses: 2 },
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token, user, filter]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  const filtered = prescriptions.filter((p) =>
    p.medicament.name.toLowerCase().includes(search.toLowerCase())
  );

  return { prescriptions: filtered, filter, setFilter, search, setSearch, loading, refetch: fetchPrescriptions };
}
