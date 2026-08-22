// src/Patient/Hooks/useSymptomTracker.ts
// Custom hook for managing Visual Analog Scale (VAS) pain/wellbeing state and history

import { useState, useMemo } from 'react';
import { useMyAppointments } from './useMyAppointments';
import { SymptomVASRecord } from '../types/patient.types';
import { calculateVASImprovement } from '../Services/patientService';

export interface VASDescriptor {
  label: string;
  category: 'Mild' | 'Moderate' | 'Severe' | 'Extreme';
  color: string;
  badgeVariant: 'success' | 'warning' | 'danger' | 'info';
  description: string;
}

export const getVASDescriptor = (score: number): VASDescriptor => {
  if (score <= 0) {
    return {
      label: 'Zero Discomfort / Optimal',
      category: 'Mild',
      color: '#16a34a',
      badgeVariant: 'success',
      description: 'Complete ease of movement with zero stiffness or discomfort.',
    };
  } else if (score <= 2) {
    return {
      label: 'Mild Sensitivity (1-2)',
      category: 'Mild',
      color: '#22c55e',
      badgeVariant: 'success',
      description: 'Very manageable, noticeable only during deep stretching or exertion.',
    };
  } else if (score <= 4) {
    return {
      label: 'Moderate Discomfort (3-4)',
      category: 'Moderate',
      color: '#eab308',
      badgeVariant: 'warning',
      description: 'Noticeable discomfort, interferes mildly with prolonged sitting or bending.',
    };
  } else if (score <= 6) {
    return {
      label: 'Significant Pain / Stiffness (5-6)',
      category: 'Moderate',
      color: '#f97316',
      badgeVariant: 'warning',
      description: 'Definite limitation in spinal range of motion. Rest required.',
    };
  } else if (score <= 8) {
    return {
      label: 'Severe Discomfort (7-8)',
      category: 'Severe',
      color: '#ef4444',
      badgeVariant: 'danger',
      description: 'Severe sharp or aching pain preventing routine daily activities.',
    };
  } else {
    return {
      label: 'Extreme / Debilitating (9-10)',
      category: 'Extreme',
      color: '#b91c1c',
      badgeVariant: 'danger',
      description: 'Severe incapacitating pain requiring immediate clinical intervention.',
    };
  }
};

export const useSymptomTracker = (patientId?: string) => {
  const effectivePatientId =
    patientId && patientId !== 'PT-104' && patientId !== 'default'
      ? patientId
      : localStorage.getItem('userId') || '';

  const { completed } = useMyAppointments(effectivePatientId);
  const [currentVAS, setCurrentVAS] = useState<number>(4);

  // Derive historical trend records from completed sessions
  const vasHistory: SymptomVASRecord[] = useMemo(() => {
    return completed
      .filter((apt) => apt.vasScoreBefore !== undefined && apt.vasScoreAfter !== undefined)
      .map((apt) => {
        const before = apt.vasScoreBefore || 0;
        const after = apt.vasScoreAfter || 0;
        const result = calculateVASImprovement(before, after);
        const stat: 'improved' | 'unchanged' | 'worsened' =
          result.status === 'improved'
            ? 'improved'
            : result.status === 'worsened'
            ? 'worsened'
            : 'unchanged';
        return {
          date: apt.date,
          sessionDay: apt.dayNumber,
          stageName: apt.stageName,
          vasBefore: before,
          vasAfter: after,
          improvementPercentage: result.percentage || 0,
          status: stat,
        };
      })
      .reverse(); // Chronological for charts/history
  }, [completed]);

  const descriptor = useMemo(() => getVASDescriptor(currentVAS), [currentVAS]);

  // Overall relief across all recorded sessions
  const overallRelief = useMemo(() => {
    if (vasHistory.length === 0) return null;
    const initialScore = vasHistory[0].vasBefore;
    const latestScore = vasHistory[vasHistory.length - 1].vasAfter;
    return calculateVASImprovement(initialScore, latestScore);
  }, [vasHistory]);

  return {
    currentVAS,
    setCurrentVAS,
    descriptor,
    vasHistory,
    overallRelief,
  };
};
