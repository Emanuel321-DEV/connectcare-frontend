import type { PatientSummary } from '@/features/caregiver/types/caregiver.types';

export const MOCK_PATIENTS: PatientSummary[] = [
  { id: '1', name: 'Sr. Alberto Silva', adherencePercentage: 90, pendingDoses: 0 },
  { id: '2', name: 'Dona Maria Sousa', adherencePercentage: 60, pendingDoses: 2, alertMessage: '2 doses pendentes' },
  { id: '3', name: 'Sr. João Mendes', adherencePercentage: 85, pendingDoses: 1 },
];
