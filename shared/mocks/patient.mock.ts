import type { PatientHomeData } from '@/features/patient/types/schedule.types';

export const MOCK_PATIENT_HOME: PatientHomeData = {
  adherencePercentage: 85,
  todayDoses: [
    { id: '1', prescriptionId: 'p1', medicamentName: 'Atorvastatina', dosage: '0.90', scheduledTime: '09:00', status: 'taken' },
    { id: '2', prescriptionId: 'p2', medicamentName: 'Vitamina D', dosage: '1 cápsula', scheduledTime: '09:00', status: 'taken' },
    { id: '3', prescriptionId: 'p3', medicamentName: 'Metformina', dosage: '1 comprimido', scheduledTime: '13:00', status: 'pending' },
  ],
  takenCount: 2,
  pendingCount: 1,
  skippedCount: 0,
};
