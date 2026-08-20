// src/Doctor/Hooks/usePatients.ts
import { useState, useMemo } from 'react';
import {
  useGetPatientsQuery,
  useAddPatientIntakeMutation,
} from '../apis/doctorApi';
import { Patient, PatientStatus } from '../types/doctor.types';

export function usePatients() {
  const { data: patients = [], isLoading, refetch } = useGetPatientsQuery();
  const [addPatientMutation, { isLoading: isAdding }] = useAddPatientIntakeMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || patient.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchTerm, selectedStatus]);

  const addPatient = async (patientData: Partial<Patient>) => {
    const res = await addPatientMutation(patientData).unwrap();
    return res;
  };

  return {
    patients: filteredPatients,
    rawPatients: patients,
    isLoading,
    isAdding,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    addPatient,
    refetch,
  };
}
