// src/Doctor/Hooks/useCurrentStage.ts
// Single source of truth for computing active stage, day count, and flag state for any patient
import { useGetPatientsQuery } from '../apis/doctorApi';

export interface CurrentStageInfo {
  patientId: string;
  patientName: string;
  currentDay: number;
  totalDays: number;
  currentStage: 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
  stageDisplayLabel: string;
  isFlagged: boolean;
  status: string;
}

export function useCurrentStage(patientId?: string): CurrentStageInfo {
  const { data: patients = [] } = useGetPatientsQuery();

  const patient = patients.find((p) => p.id === patientId) || patients[0] || {
    id: patientId || 'PAT-101',
    name: 'Rahul Verma',
    currentDay: 4,
    totalDays: 7,
    currentStage: 'Pradhanakarma' as const,
    status: 'in_progress',
    complicationAlert: undefined,
  };

  const currentDay = patient.currentDay || 1;
  const totalDays = patient.totalDays || 7;
  const currentStage = patient.currentStage || 'Poorvakarma';
  const isFlagged = patient.status === 'flagged' || !!patient.complicationAlert;

  const stageDisplayLabel = `${currentStage} · Day ${currentDay} of ${totalDays}`;

  return {
    patientId: patient.id,
    patientName: patient.name,
    currentDay,
    totalDays,
    currentStage,
    stageDisplayLabel,
    isFlagged,
    status: patient.status,
  };
}
