// src/Doctor/Components/PatientSwitcher.tsx
import React from 'react';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { Patient } from '../types/doctor.types';
import { User } from 'lucide-react';

export interface PatientSwitcherProps {
  selectedPatientId: string;
  onSelectPatient: (patient: Patient) => void;
  patients?: Patient[];
  className?: string;
  label?: string;
}

export const PatientSwitcher: React.FC<PatientSwitcherProps> = ({
  selectedPatientId,
  onSelectPatient,
  patients: customPatients,
  className = '',
  label = 'Patient Switcher:',
}) => {
  const { data: queryPatients = [] } = useGetPatientsQuery();
  const patients = customPatients || queryPatients;

  return (
    <div
      className={`flex items-center gap-2.5 bg-[#fbf9f5] border border-ayur-sand/80 px-3.5 py-1.5 rounded-xl shadow-2xs shrink-0 ${className}`}
    >
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
        <User className="w-3.5 h-3.5 text-ayur-primary" />
        {label}
      </span>
      <select
        value={selectedPatientId}
        onChange={(e) => {
          const found = patients.find((p) => p.id === e.target.value);
          if (found) {
            onSelectPatient(found);
          }
        }}
        className="rounded-lg bg-transparent text-xs font-bold text-gray-900 focus:outline-none cursor-pointer max-w-[260px] truncate"
      >
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.id}) — {p.status.replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatientSwitcher;
