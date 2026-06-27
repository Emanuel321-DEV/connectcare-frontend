import type { PendingInvite, InviteCode } from '@/features/invites/types/invite.types';

export const MOCK_INVITES: PendingInvite[] = [
  { id: '1', patientName: 'Helena Santos', invitedBy: 'Ricardo', relationship: 'Filho', receivedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '2', patientName: 'João Oliveira', invitedBy: 'Sílvia', relationship: 'Esposa', receivedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const MOCK_INVITE: InviteCode = {
  code: 'C4RE-8X92',
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
};
