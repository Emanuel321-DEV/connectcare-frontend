import { useState, useEffect, useCallback } from 'react';
// import { apiClient } from '@/shared/services/api.client';
// import { useAuthStore } from '@/features/auth/store/auth.store';
import type { PendingInvite } from '../types/invite.types';

const MOCK_INVITES: PendingInvite[] = [
  { id: '1', patientName: 'Helena Santos', invitedBy: 'Ricardo', relationship: 'Filho', receivedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '2', patientName: 'João Oliveira', invitedBy: 'Sílvia', relationship: 'Esposa', receivedAt: new Date(Date.now() - 86400000).toISOString() },
];

export function useAcceptInvite() {
  const [code, setCode] = useState('');
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingInvites = useCallback(async () => {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   const response = await apiClient.get<PendingInvite[]>(`/users/${user.id}/invites/pending`, token);
    //   setPendingInvites(response);
    // } catch {
    //   setPendingInvites(MOCK_INVITES);
    // } finally {
    //   setLoading(false);
    // }
    setPendingInvites(MOCK_INVITES);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPendingInvites(); }, [fetchPendingInvites]);

  async function validateCode() {
    if (!code.trim()) { setError('Digite o código de convite.'); return; }
    setValidating(true);
    setError(null);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   await apiClient.post(`/invites/validate`, { code: code.trim() }, token ?? undefined);
    //   await fetchPendingInvites();
    //   setCode('');
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Código inválido.');
    // } finally {
    //   setValidating(false);
    // }
    setCode('');
    setValidating(false);
  }

  async function acceptInvite(inviteId: string) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   await apiClient.post(`/invites/${inviteId}/accept`, {}, token ?? undefined);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao aceitar convite.');
    // }
  }

  async function rejectInvite(inviteId: string) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId));
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   await apiClient.post(`/invites/${inviteId}/reject`, {}, token ?? undefined);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Erro ao recusar convite.');
    // }
  }

  return { code, setCode, pendingInvites, loading, validating, error, validateCode, acceptInvite, rejectInvite };
}
