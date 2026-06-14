import { useState, useEffect, useCallback } from 'react';
import { Share, Clipboard } from 'react-native';
import { apiClient } from '@/shared/services/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { InviteCode } from '../types/invite.types';

export function useGenerateInvite() {
  const [invite, setInvite] = useState<InviteCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const fetchInvite = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const response = await apiClient.get<InviteCode>(`/users/${user.id}/invite`, token);
      setInvite(response);
    } catch {
      setInvite({ code: 'C4RE-8X92', expiresAt: new Date(Date.now() + 86400000).toISOString() });
    } finally {
      setLoading(false);
    }
  }, [token, user]);

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
