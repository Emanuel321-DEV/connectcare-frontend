export type DoseStatus = 'pending' | 'taken' | 'skipped';

export interface DoseItem {
  id: string;
  prescriptionId: string;
  medicamentName: string;
  dosage: string;
  scheduledTime: string;
  status: DoseStatus;
  takenAt?: string;
  // Ausente = dose futura só prevista (calculada a partir da prescrição),
  // ainda sem dose_record real criado no backend — não dá pra confirmar/
  // pular uma dose que ainda não venceu.
  doseRecordId?: string;
}

export interface ScheduleSection {
  label: string;
  timeRange: string;
  doses: DoseItem[];
}

export interface PatientHomeData {
  adherencePercentage: number;
  todayDoses: DoseItem[];
  takenCount: number;
  pendingCount: number;
  skippedCount: number;
}
