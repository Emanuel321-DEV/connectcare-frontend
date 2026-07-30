import { useState } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface CaregiverInvitationResponse {
  accept_url: string;
}

export function useGenerateInvite() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Link que o paciente pode copiar/compartilhar com o cuidador — não há
  // envio automático por email/SMS/push (sem SMTP configurado no backend).
  const [acceptUrl, setAcceptUrl] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
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
        setAcceptUrl('https://careconnect.app/accept-invite?token=mock-token');
        setSentTo(trimmed);
        setEmail('');
        return;
      }

      // O backend busca o cuidador pelo email e deriva o elderly_id do
      // próprio token de quem está logado — não precisamos mais buscar
      // usuários manualmente.
      const response = await apiClient.post<CaregiverInvitationResponse>(
        API_ROUTES.invites.create(),
        { caregiver_email: trimmed },
        token ?? undefined
      );

      setAcceptUrl(response.accept_url);
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
    setAcceptUrl(null);
    setError(null);
  }

  return { email, setEmail, loading, error, sentTo, acceptUrl, sendInvite, reset };
}
