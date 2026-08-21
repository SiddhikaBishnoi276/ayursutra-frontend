// src/Therapist/Hooks/usePatientClinicalHistory.ts
import { useMemo } from 'react';
import { TherapistSession } from '../types/therapist.types';

export interface ClinicalSessionRecord {
  id?: string;
  day: number;
  date: string;
  stage: string;
  therapist: string;
  bp: string;
  pulse: number;
  vasScore?: number;
  patientResponse?: 'Normal' | 'Abnormal';
  complicationFlag?: boolean;
  complicationNotes?: string;
  dosageGiven?: string;
  notes: string;
  agniStatus?: string;
}

export interface PatientClinicalSummary {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  diagnosis: string;
  chiefComplaint?: string;
  dominantPrakriti?: string;
  assignedPackageName: string;
  currentDay: number;
  totalDays: number;
  doctorRemarks: string;
  doctorInstructions: string;
  allergyHistory: string[];
  sameGenderMatched: boolean;
  isConsecutiveWithSameTherapist: boolean;
  history: ClinicalSessionRecord[];
}

export const usePatientClinicalHistory = (
  patientId?: string,
  currentSession?: TherapistSession | null
) => {
  const clinicalData = useMemo<PatientClinicalSummary | null>(() => {
    const targetId = patientId || currentSession?.patientId;
    if (!targetId && !currentSession) return null;

    const session = currentSession;
    const allergies: string[] = [];
    if (session?.allergyHistory) {
      session.allergyHistory.forEach((a) => {
        if (!allergies.includes(a)) allergies.push(a);
      });
    }

    return {
      patientId: targetId || session?.patientId || 'PT-UNKNOWN',
      name: session?.patientName || 'Patient',
      age: session?.patientAge || 35,
      gender: session?.patientGender || 'Female',
      contact: session?.patientContact || 'N/A',
      email: session?.patientEmail || 'N/A',
      diagnosis: 'Ayurvedic Classical Therapy Protocol',
      chiefComplaint: session?.chiefComplaint || 'Under structured Panchakarma clinical management.',
      dominantPrakriti: session?.prakriti || 'Vata-Pitta',
      assignedPackageName: session?.packageName || 'Classical Panchakarma Package',
      currentDay: session?.dayNumber || 1,
      totalDays: session?.totalDays || 7,
      doctorRemarks:
        session?.doctorAlertMessage ||
        session?.doctorModifiedNote ||
        'Follow standard AYUSH dosage guidelines. Monitor Agni response and skin tolerance after each steam cycle.',
      doctorInstructions:
        session?.preInstructions ||
        'Administer formulation strictly on empty stomach; warm sesame massage prior to steam.',
      allergyHistory: allergies,
      sameGenderMatched: session?.sameGenderMatched ?? true,
      isConsecutiveWithSameTherapist: session?.isConsecutiveWithSameTherapist ?? true,
      history: [],
    };
  }, [patientId, currentSession]);

  return {
    clinicalData,
    hasHistory: (clinicalData?.history.length || 0) > 0,
    hasAllergies: (clinicalData?.allergyHistory.length || 0) > 0,
  };
};

export default usePatientClinicalHistory;
