export type ReportPeriod = '7d' | '30d';

export interface MedicationAdherence {
  prescriptionId: string;
  medicamentName: string;
  dosage: string;
  percentage: number;
  taken: number;
  scheduled: number;
}

export interface AdherenceReport {
  overallPercentage: number;
  period: ReportPeriod;
  byMedication: MedicationAdherence[];
}
