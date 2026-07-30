export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface PendingInvite {
  id: string;
  token: string;
  elderlyId: string;
  caregiverId: string;
  status: InvitationStatus;
  createdAt: string;
  // Resolvido no frontend a partir de GET /users/{elderlyId} — o backend não
  // devolve o nome do paciente na CaregiverInvitation, só o UUID.
  patientName: string;
}
