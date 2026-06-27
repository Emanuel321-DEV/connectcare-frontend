import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_INVITES } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PendingInvite } from '../types/invite.types';

export function useAcceptInvite() {
  const [code, setCode] = useState('');
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchPendingInvites = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setPendingInvites(MOCK_INVITES);
        return;
      }
      const response = await apiClient.get<PendingInvite[]>(`/users/${user?.id}/invites/pending`, token ?? undefined);
      setPendingInvites(response);
    } catch {
      setPendingInvites(MOCK_INVITES);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchPendingInvites(); }, [fetchPendingInvites]);

  async function validateCode() {
    if (!code.trim()) { setError('Digite o código de convite.'); return; }
    setValidating(true);
    setError(null);
    try {
      if (!USE_MOCK) {
        await apiClient.post(`/invites/validate`, { code: code.trim() }, token ?? undefined);
        await fetchPendingInvites();
      }
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setValidating(false);
    }
  }

  async function acceptInvite(inviteId: string) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    if (!USE_MOCK) {
      try {
        await apiClient.post(`/invites/${inviteId}/accept`, {}, token ?? undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao aceitar convite.');
      }
    }
  }

  async function rejectInvite(inviteId: string) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    if (!USE_MOCK) {
      try {
        await apiClient.post(`/invites/${inviteId}/reject`, {}, token ?? undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao recusar convite.');
      }
    }
  }

  return { code, setCode, pendingInvites, loading, validating, error, validateCode, acceptInvite, rejectInvite };
}
