// src/Doctor/Hooks/useReports.ts
import { useState, useEffect } from 'react';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { sendPatientEmail } from '../Services/emailService';

export function useReports(initialPatientId?: string) {
  const { data: patients = [] } = useGetPatientsQuery();

  const defaultId =
    initialPatientId ||
    patients.find((p) => p.status === 'completed')?.id ||
    patients[0]?.id ||
    'PAT-101';

  const [selectedPatientId, setSelectedPatientId] = useState<string>(defaultId);

  useEffect(() => {
    if (initialPatientId) {
      setSelectedPatientId(initialPatientId);
    } else if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [initialPatientId, patients]);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) ||
    patients[0] || {
      id: 'PAT-101',
      name: 'Rahul Verma',
      age: 42,
      gender: 'Male',
      contact: '+91 98765 43210',
      email: 'rahul.verma@example.com',
      chiefComplaint: 'Chronic lower back stiffness',
      diagnosis: 'Vata-Kaphaja Katigraha',
      status: 'completed',
      onboardedDate: '2026-08-12',
      dominantPrakriti: 'Vata-Pitta',
    };

  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleEmailReport = async () => {
    if (!selectedPatient?.email) {
      alert('Patient has no registered email address on file.');
      return;
    }

    setEmailStatus('sending');
    const res = await sendPatientEmail({
      to: selectedPatient.email,
      patientName: selectedPatient.name,
      subject: `AyurSutra Clinical Discharge Summary & Certificate - ${selectedPatient.name}`,
      templateType: 'CLINICAL_REPORT',
      data: {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        diagnosis: selectedPatient.diagnosis,
      },
    });

    if (res.success) {
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus('idle'), 4000);
    } else {
      setEmailStatus('failed');
      setTimeout(() => setEmailStatus('idle'), 4000);
    }
  };

  return {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatient,
    emailStatus,
    handleDownloadPDF,
    handleEmailReport,
  };
}

export default useReports;
