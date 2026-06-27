import type { PatientSummary, PatientDetail } from '@/features/caregiver/types/caregiver.types';

export const MOCK_PATIENTS: PatientSummary[] = [
  { id: '1', name: 'Sr. Alberto Silva', adherencePercentage: 90, pendingDoses: 0 },
  { id: '2', name: 'Dona Maria Sousa', adherencePercentage: 60, pendingDoses: 2, alertMessage: '2 doses pendentes' },
  { id: '3', name: 'Sr. João Mendes', adherencePercentage: 85, pendingDoses: 1 },
];

export const MOCK_PATIENT_DETAIL: PatientDetail = {
  id: '2',
  name: 'Dona Maria Sousa',
  age: 74,
  adherencePercentage: 85,
  prescriptions: [
    { id: '1', medication: 'Losartana 50mg', schedule: '08:00 e 20:00', status: 'ok' },
    { id: '2', medication: 'Metformina 500mg', schedule: '07:00, 12:00 e 19:00', status: 'alert' },
    { id: '3', medication: 'AAS 100mg', schedule: '08:00', status: 'ok' },
  ],
  history: [
    { id: '1', date: 'Hoje, 08:00', medication: 'Losartana 50mg', taken: true },
    { id: '2', date: 'Hoje, 07:00', medication: 'Metformina 500mg', taken: false },
    { id: '3', date: 'Ontem, 20:00', medication: 'Losartana 50mg', taken: true },
    { id: '4', date: 'Ontem, 19:00', medication: 'Metformina 500mg', taken: true },
  ],
};
