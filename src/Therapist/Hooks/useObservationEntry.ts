// src/Therapist/Hooks/useObservationEntry.ts
// Hook for managing observation entry form state, vitals, and completion mutation
import { useState, useEffect } from 'react';
import { TherapistSession, ObservationPayload } from '../types/therapist.types';

export const useObservationEntry = (
  session: TherapistSession | null
) => {
  const [dosageGiven, setDosageGiven] = useState<string>('');
  const [patientResponse, setPatientResponse] = useState<'Normal' | 'Abnormal'>('Normal');
  const [bloodPressure, setBloodPressure] = useState<string>('120/80');
  const [pulseBpm, setPulseBpm] = useState<number>(72);
  const [clinicalVASScore, setClinicalVASScore] = useState<number>(3.0);
  const [agniStatus, setAgniStatus] = useState<'Sama' | 'Manda' | 'Tikshna' | 'Visham'>('Sama');
  const [complicationFlag, setComplicationFlag] = useState<boolean>(false);
  const [complicationNotes, setComplicationNotes] = useState<string>('');
  const [generalObservations, setGeneralObservations] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill dosage suggestions from materials on session load
  useEffect(() => {
    if (session?.materials && session.materials.length > 0) {
      const suggestions = session.materials
        .map((m) => `${m.quantityRequired} ${m.name}`)
        .join(', ');
      setDosageGiven(suggestions);
    }
  }, [session]);

  // Auto-flag complication if Abnormal response is selected
  useEffect(() => {
    if (patientResponse === 'Abnormal') {
      setComplicationFlag(true);
    }
  }, [patientResponse]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!dosageGiven.trim()) {
      errs.dosageGiven = 'Please enter or confirm dosage / materials administered.';
    }

    if (patientResponse === 'Abnormal' && !complicationNotes.trim()) {
      errs.complicationNotes = 'Complication notes are required when response is marked Abnormal.';
    }

    if (!bloodPressure.trim() || !/^\d{2,3}\/\d{2,3}$/.test(bloodPressure.trim())) {
      errs.bloodPressure = 'Please enter valid blood pressure format (e.g. 120/80).';
    }

    if (!pulseBpm || pulseBpm < 40 || pulseBpm > 200) {
      errs.pulseBpm = 'Please enter realistic pulse rate between 40 and 200 bpm.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getPayload = (): ObservationPayload => {
    return {
      dosageGiven: dosageGiven.trim(),
      materialsUsed: (session?.materials || []).map((m) => ({
        name: m.name,
        quantity: m.quantityRequired,
      })),
      patientResponse,
      bloodPressure: bloodPressure.trim(),
      pulseBpm,
      clinicalVASScore,
      agniStatus,
      complicationFlag,
      complicationNotes: complicationNotes.trim(),
      generalObservations: generalObservations.trim(),
      submittedAt: new Date().toISOString(),
    };
  };

  return {
    dosageGiven,
    setDosageGiven,
    patientResponse,
    setPatientResponse,
    bloodPressure,
    setBloodPressure,
    pulseBpm,
    setPulseBpm,
    clinicalVASScore,
    setClinicalVASScore,
    agniStatus,
    setAgniStatus,
    complicationFlag,
    setComplicationFlag,
    complicationNotes,
    setComplicationNotes,
    generalObservations,
    setGeneralObservations,
    errors,
    validate,
    getPayload,
  };
};
