import { useState, useEffect, useCallback } from 'react';
import { Share, Clipboard } from 'react-native';
// import { apiClient } from '@/shared/services/api.client';
// import { useAuthStore } from '@/features/auth/store/auth.store';
import type { InviteCode } from '../types/invite.types';

const MOCK_INVITE: InviteCode = { code: 'C4RE-8X92', expiresAt: new Date(Date.now() + 86400000).toISOString() };

export function useGenerateInvite() {
  const [invite, setInvite] = useState<InviteCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchInvite = useCallback(async () => {
    setLoading(true);
    // TODO: descomentar quando integração estiver pronta
    // try {
    //   const response = await apiClient.get<InviteCode>(`/users/${user.id}/invite`, token);
    //   setInvite(response);
    // } catch {
    //   setInvite(MOCK_INVITE);
    // } finally {
    //   setLoading(false);
    // }
    setInvite(MOCK_INVITE);
    setLoading(false);
  }, []);

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
