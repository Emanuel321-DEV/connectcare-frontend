import { useState, useEffect, useCallback } from 'react';
// import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Prescription } from '../types/prescription.types';

type Filter = 'all' | 'active' | 'inactive';

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'p1', userId: '1', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
    medicament: { name: 'Losartana Potássica', dosage: '50mg', frequency: '24:00', time: ['08:00'], doses: 1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2', userId: '1', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
    medicament: { name: 'Metformina', dosage: '850mg', frequency: '12:00', time: ['08:00', '20:00'], doses: 2 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3', userId: '1', medicId: 'm2', medicName: 'Dra. Ana Paula', active: false,
    medicament: { name: 'Atorvastatina', dosage: '0.90mg', frequency: '24:00', time: ['09:00'], doses: 1 },
    createdAt: new Date().toISOString(),
  },
];

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   const activeParam = filter === 'all' ? '' : `&active=${filter === 'active'}`;
    //   const response = await apiClient.get<Prescription[]>(`/prescriptions?user_id=${user.id}${activeParam}`, token);
    //   setPrescriptions(response);
    // } catch {
    //   setPrescriptions(MOCK_PRESCRIPTIONS);
    // } finally {
    //   setLoading(false);
    // }
    setPrescriptions(MOCK_PRESCRIPTIONS);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  const filtered = prescriptions
    .filter((p) => filter === 'all' || (filter === 'active' ? p.active : !p.active))
    .filter((p) => p.medicament.name.toLowerCase().includes(search.toLowerCase()));

  return { prescriptions: filtered, filter, setFilter, search, setSearch, loading, refetch: fetchPrescriptions };
}
