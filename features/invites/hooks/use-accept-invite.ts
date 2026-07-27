import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_INVITES } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { InvitationStatus, PendingInvite } from '../types/invite.types';

interface RawInvitation {
  id: string;
  token: string;
  elderly_id: string;
  caregiver_id: string;
  status: InvitationStatus;
  created_at: string;
}

interface RawUser {
  id: string;
  name: string;
}

export function useAcceptInvite() {
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchPendingInvites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setPendingInvites(MOCK_INVITES);
        return;
      }
      const invitations = await apiClient.get<RawInvitation[] | null>(
        API_ROUTES.users.invitations(user?.id ?? ''),
        token ?? undefined
      );
      const pending = (invitations ?? []).filter((i) => i.status === 'PENDING');

      // O backend não devolve o nome do paciente na invitation, só o
      // elderly_id — resolvemos com uma chamada extra por convite.
      const resolved: PendingInvite[] = await Promise.all(
        pending.map(async (inv) => {
          let patientName = 'Paciente';
          try {
            const elderly = await apiClient.get<RawUser>(API_ROUTES.patients.detail(inv.elderly_id), token ?? undefined);
            patientName = elderly.name;
          } catch { /* mantém o fallback */ }
          return {
            id: inv.id,
            token: inv.token,
            elderlyId: inv.elderly_id,
            caregiverId: inv.caregiver_id,
            status: inv.status,
            createdAt: inv.created_at,
            patientName,
          };
        })
      );

      setPendingInvites(resolved);
    } catch (err) {
      // Erro real do backend — não mascarar com dado mockado.
      setPendingInvites([]);
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os convites pendentes.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchPendingInvites(); }, [fetchPendingInvites]);

  async function acceptInvite(invite: PendingInvite) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== invite.id));
    if (!USE_MOCK) {
      try {
        await apiClient.post(API_ROUTES.invites.accept(invite.token), {}, token ?? undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao aceitar convite.');
      }
    }
  }

  async function rejectInvite(invite: PendingInvite) {
    setPendingInvites((prev) => prev.filter((i) => i.id !== invite.id));
    if (!USE_MOCK) {
      try {
        await apiClient.post(API_ROUTES.invites.reject(invite.token), {}, token ?? undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao recusar convite.');
      }
    }
  }

  return { pendingInvites, loading, error, acceptInvite, rejectInvite, refetch: fetchPendingInvites };
}
