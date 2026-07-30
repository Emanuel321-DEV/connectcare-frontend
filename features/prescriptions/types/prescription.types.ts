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
  active: boolean;
  // O backend suporta várias medicações por prescrição (ver docs/api.yaml
  // do backend, schema Prescription.medicaments) — nunca é um único item.
  medicaments: Medicament[];
  createdAt: string;
}
