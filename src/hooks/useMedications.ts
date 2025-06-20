
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Medication, MedicationTaken, CreateMedicationData, UpdateMedicationData } from '@/types/medication';

export function useMedications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationsTaken, setMedicationsTaken] = useState<MedicationTaken[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedMedications = localStorage.getItem(`medications_${user.id}`);
      const storedTaken = localStorage.getItem(`medications_taken_${user.id}`);
      
      if (storedMedications) {
        setMedications(JSON.parse(storedMedications));
      }
      
      if (storedTaken) {
        setMedicationsTaken(JSON.parse(storedTaken));
      }
    }
  }, [user]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`medications_${user.id}`, JSON.stringify(medications));
    }
  }, [medications, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`medications_taken_${user.id}`, JSON.stringify(medicationsTaken));
    }
  }, [medicationsTaken, user]);

  const addMedication = async (data: CreateMedicationData): Promise<Medication> => {
    if (!user) throw new Error('User not authenticated');

    const newMedication: Medication = {
      id: crypto.randomUUID(),
      ...data,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setMedications(prev => [...prev, newMedication]);
    return newMedication;
  };

  const updateMedication = async (id: string, data: UpdateMedicationData): Promise<Medication> => {
    if (!user) throw new Error('User not authenticated');

    const updatedMedication = medications.find(m => m.id === id);
    if (!updatedMedication) throw new Error('Medication not found');

    const updated = { ...updatedMedication, ...data };
    setMedications(prev => prev.map(m => m.id === id ? updated : m));
    return updated;
  };

  const deleteMedication = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setMedications(prev => prev.filter(m => m.id !== id));
    // Also remove any taken records for this medication
    setMedicationsTaken(prev => prev.filter(t => t.medicationId !== id));
  };

  const markMedicationTaken = async (medicationId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const today = new Date().toISOString().split('T')[0];
    const alreadyTaken = medicationsTaken.some(
      t => t.medicationId === medicationId && t.takenAt.startsWith(today)
    );

    if (alreadyTaken) {
      throw new Error('Medication already taken today');
    }

    const takenRecord: MedicationTaken = {
      medicationId,
      takenAt: new Date().toISOString(),
      userId: user.id,
    };

    setMedicationsTaken(prev => [...prev, takenRecord]);
  };

  const getMedicationsTakenToday = (): MedicationTaken[] => {
    const today = new Date().toISOString().split('T')[0];
    return medicationsTaken.filter(t => t.takenAt.startsWith(today));
  };

  const getAdherenceRate = (days: number = 7): number => {
    if (medications.length === 0) return 0;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    let totalDays = 0;
    let takenDays = 0;

    for (let i = 0; i < days; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];

      medications.forEach(() => {
        totalDays++;
        const takenOnDate = medicationsTaken.some(t => 
          t.takenAt.startsWith(dateStr)
        );
        if (takenOnDate) takenDays++;
      });
    }

    return totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0;
  };

  return {
    medications,
    medicationsTaken,
    addMedication,
    updateMedication,
    deleteMedication,
    markMedicationTaken,
    getMedicationsTakenToday,
    getAdherenceRate,
  };
}
