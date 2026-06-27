import type { ScheduleSection } from '@/features/patient/types/schedule.types';

export const MOCK_SCHEDULE: ScheduleSection[] = [
  {
    label: 'Manhã',
    timeRange: '09:00',
    doses: [
      { id: '1', prescriptionId: 'p1', medicamentName: 'Atorvastatina', dosage: '0.90', scheduledTime: '09:00', status: 'taken' },
    ],
  },
  {
    label: 'Tarde',
    timeRange: '13:00',
    doses: [
      { id: '2', prescriptionId: 'p3', medicamentName: 'Metformina', dosage: '1 comprimido', scheduledTime: '13:00', status: 'pending' },
      { id: '3', prescriptionId: 'p4', medicamentName: 'Insulina', dosage: '10 unidades', scheduledTime: '13:00', status: 'pending' },
    ],
  },
  {
    label: 'Noite',
    timeRange: '20:00',
    doses: [
      { id: '4', prescriptionId: 'p5', medicamentName: 'Gliosatidase', dosage: '1 comprimido', scheduledTime: '20:00', status: 'pending' },
    ],
  },
];
