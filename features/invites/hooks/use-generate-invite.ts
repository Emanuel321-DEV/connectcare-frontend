import { useState } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface RawUser {
  id: string;
  name: string;
  email: string;
}

export function useGenerateInvite() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Guarda o email pra quem o convite foi enviado com sucesso.
  const [sentTo, setSentTo] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  async function sendInvite() {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Digite o email do cuidador.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        setSentTo(trimmed);
        setEmail('');
        return;
      }

      // Não existe endpoint de busca por email no backend — buscamos todos os
      // usuários e filtramos no cliente. Dívida técnica conhecida: expõe a
      // lista completa de usuários no dispositivo durante a busca.
      const allUsers = await apiClient.get<RawUser[] | null>(API_ROUTES.users.list(), token ?? undefined);
      const found = (allUsers ?? []).find((u) => u.email.toLowerCase() === trimmed.toLowerCase());

      if (!found) {
        setError('Nenhum usuário encontrado com esse email. Peça para o cuidador se cadastrar no CareConnect primeiro.');
        return;
      }

      await apiClient.post(
        API_ROUTES.invites.create(),
        { elderly_id: user?.id ?? '', caregiver_id: found.id },
        token ?? undefined
      );

      setSentTo(trimmed);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar o convite.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSentTo(null);
    setError(null);
  }

  return { email, setEmail, loading, error, sentTo, sendInvite, reset };
}
