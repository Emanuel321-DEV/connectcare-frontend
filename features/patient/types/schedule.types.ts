export type DoseStatus = 'pending' | 'taken' | 'skipped';

export interface DoseItem {
  id: string;
  prescriptionId: string;
  medicamentName: string;
  dosage: string;
  scheduledTime: string;
  status: DoseStatus;
  takenAt?: string;
}

export interface ScheduleSection {
  label: string;
  timeRange: string;
  doses: DoseItem[];
}
