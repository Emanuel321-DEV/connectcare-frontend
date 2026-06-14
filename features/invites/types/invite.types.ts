export interface InviteCode {
  code: string;
  expiresAt: string;
}

export interface PendingInvite {
  id: string;
  patientName: string;
  invitedBy: string;
  relationship: string;
  receivedAt: string;
}
