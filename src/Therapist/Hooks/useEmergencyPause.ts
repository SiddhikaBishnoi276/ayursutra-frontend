// src/Therapist/Hooks/useEmergencyPause.ts
// Hook for managing emergency pause state and incident report dispatch
import { useState } from 'react';
import { IncidentReportPayload } from '../types/therapist.types';

export const useEmergencyPause = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reactionDescription, setReactionDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [bloodPressure, setBloodPressure] = useState('130/85');
  const [pulseBpm, setPulseBpm] = useState(88);
  const [spo2, setSpo2] = useState<number | undefined>(98);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setReactionDescription('');
    setActionTaken('');
    setBloodPressure('130/85');
    setPulseBpm(88);
    setSpo2(98);
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!reactionDescription.trim()) {
      errs.reactionDescription = 'Please describe the patient adverse reaction / symptom.';
    }
    if (!actionTaken.trim()) {
      errs.actionTaken = 'Please state clinical action immediately taken (e.g. wiped oil, administered warm water).';
    }
    if (!bloodPressure.trim()) {
      errs.bloodPressure = 'Blood pressure is required at pause.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getIncidentPayload = (): IncidentReportPayload => {
    return {
      reactionDescription: reactionDescription.trim(),
      actionTaken: actionTaken.trim(),
      vitalsAtPause: {
        bloodPressure: bloodPressure.trim(),
        pulseBpm,
        spo2,
      },
      emergencyDoctorNotified: true,
      reportedAt: new Date().toISOString(),
    };
  };

  return {
    isModalOpen,
    setIsModalOpen,
    reactionDescription,
    setReactionDescription,
    actionTaken,
    setActionTaken,
    bloodPressure,
    setBloodPressure,
    pulseBpm,
    setPulseBpm,
    spo2,
    setSpo2,
    errors,
    validate,
    getIncidentPayload,
    resetForm,
  };
};
