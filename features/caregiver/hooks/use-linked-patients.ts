import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface LinkedPatient {
  id: string;
  name: string;
}

interface RawUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Usado pelas telas de Agenda/Relatórios do cuidador pra saber de qual
// paciente mostrar os dados (GET /users/{caregiverId}/charges).
export function useLinkedPatients() {
  const [patients, setPatients] = useState<LinkedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const charges = await apiClient.get<RawUser[] | null>(
        API_ROUTES.users.charges(user?.id ?? ''),
        token ?? undefined
      );
      setPatients((charges ?? []).map((c) => ({ id: c.id, name: c.name })));
    } catch (err) {
      setPatients([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar seus pacientes.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  return { patients, loading, error };
}
