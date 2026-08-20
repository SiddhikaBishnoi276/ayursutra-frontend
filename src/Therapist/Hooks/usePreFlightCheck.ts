// src/Therapist/Hooks/usePreFlightCheck.ts
// Hook for managing pre-session safety checks and inventory verification
import { useState, useMemo } from 'react';
import { TherapistSession, PreFlightChecklistState } from '../types/therapist.types';
import { checkMaterialsAvailability } from '../Services/therapistService';

export const usePreFlightCheck = (session: TherapistSession | null) => {
  const [checklist, setChecklist] = useState<PreFlightChecklistState>({
    roomReady: true,
    equipmentSanitized: true,
    materialsVerified: false,
    patientIdentified: false,
    allergyConfirmed: false,
  });

  const materialsCheck = useMemo(() => {
    return checkMaterialsAvailability(session?.materials || []);
  }, [session?.materials]);

  // If inventory has shortages, materials check fails and requires restocking
  const hasInventoryShortage = !materialsCheck.isAllAvailable;

  const toggleCheck = (key: keyof PreFlightChecklistState) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setAllChecks = (value: boolean) => {
    setChecklist({
      roomReady: value,
      equipmentSanitized: value,
      materialsVerified: hasInventoryShortage ? false : value,
      patientIdentified: value,
      allergyConfirmed: value,
    });
  };

  // Readiness calculation
  const isReadyToStart = useMemo(() => {
    if (!session) return false;
    if (hasInventoryShortage) return false;
    return (
      checklist.roomReady &&
      checklist.equipmentSanitized &&
      checklist.materialsVerified &&
      checklist.patientIdentified &&
      checklist.allergyConfirmed
    );
  }, [session, checklist, hasInventoryShortage]);

  return {
    checklist,
    toggleCheck,
    setAllChecks,
    materialsCheck,
    hasInventoryShortage,
    isReadyToStart,
  };
};
