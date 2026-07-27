import type { PendingInvite } from '@/features/invites/types/invite.types';

export const MOCK_INVITES: PendingInvite[] = [
  {
    id: '1',
    token: 'mock-token-1',
    elderlyId: 'mock-elderly-1',
    caregiverId: 'mock-caregiver',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    patientName: 'Helena Santos',
  },
  {
    id: '2',
    token: 'mock-token-2',
    elderlyId: 'mock-elderly-2',
    caregiverId: 'mock-caregiver',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    patientName: 'João Oliveira',
  },
];
