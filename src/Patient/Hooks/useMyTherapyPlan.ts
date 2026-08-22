// src/Patient/Hooks/useMyTherapyPlan.ts
// Custom hook for managing active therapy plan, stage progress, and doctor plan updates

import { useMemo, useState, useEffect } from 'react';
import { useGetMyTherapyPlanQuery } from '../apis/patientApi';
import { calculateOverallProgress } from '../Services/patientService';

const DISMISSED_DOCTOR_UPDATES_KEY = 'ayursutra_dismissed_doctor_updates';

export const useMyTherapyPlan = (patientId?: string) => {
  const effectivePatientId =
    patientId && patientId !== 'PT-104' && patientId !== 'default'
      ? patientId
      : localStorage.getItem('userId') || '';

  const { data: plan, isLoading, error, refetch } = useGetMyTherapyPlanQuery(effectivePatientId);

  // Persistent dismissal tracking for doctor plan updates
  const [dismissedUpdates, setDismissedUpdates] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_DOCTOR_UPDATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DISMISSED_DOCTOR_UPDATES_KEY, JSON.stringify(dismissedUpdates));
    } catch (e) {
      console.warn('Could not persist dismissed updates to localStorage', e);
    }
  }, [dismissedUpdates]);

  const updateId = plan?.doctorPlanLastUpdated || 'default_update';
  const isDoctorUpdateVisible = Boolean(
    plan?.isPlanUpdatedByDoctor && !dismissedUpdates.includes(updateId)
  );

  const dismissDoctorUpdate = () => {
    if (updateId) {
      setDismissedUpdates((prev) => (prev.includes(updateId) ? prev : [...prev, updateId]));
    }
  };

  const stats = useMemo(() => {
    if (!plan) {
      return {
        completed: 0,
        remaining: 0,
        total: 0,
        progressPercent: 0,
        currentStage: null,
        nextStage: null,
      };
    }

    const stages = plan.stages || [];
    const completed = stages.filter((s) => s.status === 'completed').length;
    const total = stages.length;
    const remaining = Math.max(0, total - completed);
    const progressPercent = calculateOverallProgress(completed, total);

    const inProgressStage = stages.find((s) => s.status === 'in_progress');
    const upcomingStage = stages.find((s) => s.status === 'upcoming');
    const currentStage = inProgressStage || upcomingStage || stages[stages.length - 1] || null;
    const nextStage = upcomingStage || null;

    return {
      completed,
      remaining,
      total,
      progressPercent,
      currentStage,
      nextStage,
    };
  }, [plan]);

  return {
    plan,
    isLoading,
    error,
    refetch,
    stats,
    isDoctorUpdateVisible,
    dismissDoctorUpdate,
  };
};
