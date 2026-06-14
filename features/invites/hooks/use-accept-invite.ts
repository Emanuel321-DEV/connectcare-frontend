import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PendingInvite } from '../types/invite.types';

export function useAcceptInvite() {
  const [code, setCode] = useState('');
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchPendingInvites = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const response = await apiClient.get<PendingInvite[]>(`/users/${user.id}/invites/pending`, token);
      setPendingInvites(response);
    } catch {
      setPendingInvites([
        { id: '1', patientName: 'Helena Santos', invitedBy: 'Ricardo', relationship: 'Filho', receivedAt: new Date(Date.now() - 7200000).toISOString() },
        { id: '2', patientName: 'João Oliveira', invitedBy: 'Sílvia', relationship: 'Esposa', receivedAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => { fetchPendingInvites(); }, [fetchPendingInvites]);

  async function validateCode() {
    if (!code.trim()) { setError('Digite o código de convite.'); return; }
    setValidating(true);
    setError(null);
    try {
      await apiClient.post(`/invites/validate`, { code: code.trim() }, token ?? undefined);
      await fetchPendingInvites();
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido.');
    } finally {
      setValidating(false);
    }
  }

  async function acceptInvite(inviteId: string) {
    try {
      await apiClient.post(`/invites/${inviteId}/accept`, {}, token ?? undefined);
      setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aceitar convite.');
    }
  }

  async function rejectInvite(inviteId: string) {
    try {
      await apiClient.post(`/invites/${inviteId}/reject`, {}, token ?? undefined);
      setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recusar convite.');
    }
  }

  return { code, setCode, pendingInvites, loading, validating, error, validateCode, acceptInvite, rejectInvite };
}
