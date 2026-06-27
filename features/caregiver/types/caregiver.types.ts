export interface PatientSummary {
  id: string;
  name: string;
  adherencePercentage: number;
  pendingDoses: number;
  alertMessage?: string;
}
