import { useState, useEffect, useCallback } from 'react';
import { Share, Clipboard } from 'react-native';
import { apiClient } from '@/shared/services/api.client';
import { API_ROUTES } from '@/shared/services/api.routes';
import { USE_MOCK } from '@/shared/config/env';
import { MOCK_INVITE } from '@/shared/mocks';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { InviteCode } from '../types/invite.types';

export function useGenerateInvite() {
  const [invite, setInvite] = useState<InviteCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const fetchInvite = useCallback(async () => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        setInvite(MOCK_INVITE);
        return;
      }
      const response = await apiClient.get<InviteCode>(API_ROUTES.users.invite(user?.id ?? ''), token ?? undefined);
      setInvite(response);
    } catch {
      setInvite(MOCK_INVITE);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => { fetchInvite(); }, [fetchInvite]);

  function copyCode() {
    if (!invite) return;
    Clipboard.setString(invite.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareCode() {
    if (!invite) return;
    await Share.share({ message: `Use este código para se conectar comigo no CareConnect: ${invite.code}` });
  }

  return { invite, loading, copied, copyCode, shareCode };
}
