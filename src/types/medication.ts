
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  userId: string;
  createdAt: string;
}

export interface MedicationTaken {
  medicationId: string;
  takenAt: string;
  userId: string;
}

export interface CreateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
}

export interface UpdateMedicationData {
  name?: string;
  dosage?: string;
  frequency?: string;
}
