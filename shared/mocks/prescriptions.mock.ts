import type { Prescription } from '@/features/prescriptions/types/prescription.types';

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'p1', userId: '1', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
    medicament: { name: 'Losartana Potássica', dosage: '50mg', frequency: '24:00', time: ['08:00'], doses: 1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2', userId: '1', medicId: 'm1', medicName: 'Dr. Carlos Andrade', active: true,
    medicament: { name: 'Metformina', dosage: '850mg', frequency: '12:00', time: ['08:00', '20:00'], doses: 2 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3', userId: '1', medicId: 'm2', medicName: 'Dra. Ana Paula', active: false,
    medicament: { name: 'Atorvastatina', dosage: '0.90mg', frequency: '24:00', time: ['09:00'], doses: 1 },
    createdAt: new Date().toISOString(),
  },
];
