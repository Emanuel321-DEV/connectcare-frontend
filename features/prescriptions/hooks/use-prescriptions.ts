import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_PRESCRIPTIONS } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Prescription } from '../types/prescription.types';

type Filter = 'all' | 'active' | 'inactive';

// patientId: usado pelo cuidador pra ver as prescrições de um paciente
// vinculado. Quando omitido, usa o próprio usuário logado (fluxo do paciente).
export function usePrescriptions(patientId?: string) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const targetUserId = patientId ?? user?.id;

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      if (USE_MOCK) {
        setPrescriptions(MOCK_PRESCRIPTIONS);
        return;
      }
      const active = filter === 'all' ? undefined : filter === 'active';
      const response = await apiClient.get<Prescription[] | null>(API_ROUTES.prescriptions.list(targetUserId ?? '', active), token ?? undefined);
      // Backend retorna null (não []) quando o usuário não tem nenhuma prescrição.
      setPrescriptions(response ?? []);
    } catch (err) {
      setPrescriptions([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar as prescrições.');
    } finally {
      setLoading(false);
    }
  }, [filter, targetUserId, token]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  // Refaz a busca sempre que a tela ganha foco (ex: ao voltar de outra tela),
  // já que o efeito de mount não roda de novo nesse caso e o estado ficaria desatualizado.
  useFocusEffect(
    useCallback(() => { fetchPrescriptions(); }, [fetchPrescriptions])
  );

  const filtered = prescriptions
    .filter((p) => filter === 'all' || (filter === 'active' ? p.active : !p.active))
    .filter((p) =>
      search.trim() === '' ||
      p.medicaments.some((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    );

  return { prescriptions: filtered, filter, setFilter, search, setSearch, loading, error, refetch: fetchPrescriptions };
}
