import type { AdherenceReport } from '@/features/reports/types/report.types';

export const MOCK_REPORT: AdherenceReport = {
  overallPercentage: 85,
  period: '7d',
  byMedication: [
    { prescriptionId: 'p1', medicamentName: 'Atorvastatina', dosage: '0.90', percentage: 66, taken: 4, scheduled: 6 },
    { prescriptionId: 'p2', medicamentName: 'Vitamina D', dosage: '1 cápsula', percentage: 100, taken: 7, scheduled: 7 },
    { prescriptionId: 'p3', medicamentName: 'Insulina', dosage: '10 unidades', percentage: 60, taken: 3, scheduled: 5 },
    { prescriptionId: 'p4', medicamentName: 'Vitamina B', dosage: '1 comprimido', percentage: 60, taken: 3, scheduled: 5 },
    { prescriptionId: 'p5', medicamentName: 'Lisinapril', dosage: '5mg', percentage: 60, taken: 3, scheduled: 5 },
  ],
};
