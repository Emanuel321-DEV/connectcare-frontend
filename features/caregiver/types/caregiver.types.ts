export interface PatientSummary {
  id: string;
  name: string;
  adherencePercentage: number;
  pendingDoses: number;
  alertMessage?: string;
}

export interface PatientPrescription {
  id: string;
  medication: string;
  schedule: string;
  status: 'ok' | 'alert' | 'neutral';
}

export interface PatientHistoryEntry {
  id: string;
  date: string;
  medication: string;
  taken: boolean;
}

export interface PatientDetail {
  id: string;
  name: string;
  adherencePercentage: number;
  prescriptions: PatientPrescription[];
  history: PatientHistoryEntry[];
}
