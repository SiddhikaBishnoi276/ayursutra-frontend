// src/Therapist/Hooks/usePatientClinicalHistory.ts
import { useMemo } from 'react';
import rawPatientHistory from '../data/patientHistory.json';
import rawSessionsQueue from '../data/sessionsQueue.json';
import rawDoctorPatients from '../../Doctor/data/patients.json';
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
    if (!targetId) return null;

    // 1. Doctor Patient Record lookup
    const doctorPatient = (rawDoctorPatients as any[]).find((p) => p.id === targetId);

    // 2. Queue Sessions for this patient
    const queueSessions = (rawSessionsQueue as TherapistSession[]).filter(
      (s) => s.patientId === targetId
    );
    const activeOrLatestSession = currentSession || queueSessions[0];

    // 3. Historical log lookup
    const historyObj = (rawPatientHistory as Record<string, any>)[targetId];
    const historicalLogs: ClinicalSessionRecord[] = historyObj?.history
      ? historyObj.history.map((h: any) => ({
          day: h.day,
          date: h.date,
          stage: h.stage,
          therapist: h.therapist,
          bp: h.bp,
          pulse: h.pulse,
          vasScore: h.vasScore,
          patientResponse: h.notes?.toLowerCase().includes('flagged') ? 'Abnormal' : 'Normal',
          complicationFlag: h.notes?.toLowerCase().includes('flagged') || false,
          complicationNotes: h.notes?.toLowerCase().includes('flagged') ? h.notes : undefined,
          dosageGiven: h.dosageGiven || (h.stage?.includes('Snehapana') ? '30ml Mahatiktaka Ghrita' : 'Standard Decoction'),
          notes: h.notes,
          agniStatus: h.agniStatus || (h.vasScore && h.vasScore > 6 ? 'Visham' : 'Sama'),
        }))
      : [];

    // Also include any completed sessions in queue not already in historical logs
    queueSessions.forEach((qs) => {
      if (qs.status === 'completed' && !historicalLogs.some((h) => h.day === qs.dayNumber)) {
        historicalLogs.push({
          id: qs.id,
          day: qs.dayNumber,
          date: qs.scheduledDate,
          stage: qs.stageName,
          therapist: qs.therapistName,
          bp: '120/80',
          pulse: 72,
          vasScore: 3.5,
          patientResponse: 'Normal',
          complicationFlag: false,
          dosageGiven: qs.materials?.map((m) => `${m.quantityRequired} ${m.name}`).join(', '),
          notes: qs.priorSessionNotes || 'Session successfully administered without adverse event.',
          agniStatus: 'Sama',
        });
      }
    });

    // Sort history descending by day/date (most recent first)
    const sortedHistory = [...historicalLogs].sort((a, b) => {
      if (b.day !== a.day) return b.day - a.day;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Allergy collection
    const allergies: string[] = [];
    if (activeOrLatestSession?.allergyHistory) {
      activeOrLatestSession.allergyHistory.forEach((a) => {
        if (!allergies.includes(a)) allergies.push(a);
      });
    }
    if (doctorPatient?.complicationAlert?.message) {
      allergies.push(`Clinical Precaution: ${doctorPatient.complicationAlert.message}`);
    }

    return {
      patientId: targetId,
      name: activeOrLatestSession?.patientName || doctorPatient?.name || 'Patient',
      age: activeOrLatestSession?.patientAge || doctorPatient?.age || 40,
      gender: activeOrLatestSession?.patientGender || doctorPatient?.gender || 'Unknown',
      contact: activeOrLatestSession?.patientContact || doctorPatient?.contact || 'N/A',
      email: activeOrLatestSession?.patientEmail || doctorPatient?.email || 'N/A',
      diagnosis: doctorPatient?.diagnosis || 'Ayurvedic Classical Therapy Protocol',
      chiefComplaint: doctorPatient?.chiefComplaint || 'Under structured Panchakarma management.',
      dominantPrakriti: doctorPatient?.dominantPrakriti || 'Vata-Pitta',
      assignedPackageName:
        activeOrLatestSession?.packageName ||
        doctorPatient?.assignedPackageName ||
        'Classical Panchakarma Package',
      currentDay: activeOrLatestSession?.dayNumber || doctorPatient?.currentDay || 1,
      totalDays: activeOrLatestSession?.totalDays || doctorPatient?.totalDays || 7,
      doctorRemarks:
        activeOrLatestSession?.doctorAlertMessage ||
        activeOrLatestSession?.doctorModifiedNote ||
        'Follow standard AYUSH dosage guidelines. Monitor Agni response and skin tolerance after each steam cycle.',
      doctorInstructions:
        activeOrLatestSession?.preInstructions ||
        'Administer formulation strictly on empty stomach; warm sesame massage prior to steam.',
      allergyHistory: allergies,
      sameGenderMatched: activeOrLatestSession?.sameGenderMatched ?? true,
      isConsecutiveWithSameTherapist: activeOrLatestSession?.isConsecutiveWithSameTherapist ?? true,
      history: sortedHistory,
    };
  }, [patientId, currentSession]);

  return {
    clinicalData,
    hasHistory: (clinicalData?.history.length || 0) > 0,
    hasAllergies: (clinicalData?.allergyHistory.length || 0) > 0,
  };
};

export default usePatientClinicalHistory;
