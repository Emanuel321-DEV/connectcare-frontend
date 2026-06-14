export interface Medicament {
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  doses: number;
}

export interface Prescription {
  id: string;
  userId: string;
  medicId: string;
  medicName: string;
  active: boolean;
  medicament: Medicament;
  createdAt: string;
}
