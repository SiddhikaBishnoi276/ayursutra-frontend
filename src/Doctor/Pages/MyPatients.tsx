// src/Doctor/Pages/MyPatients.tsx
import React, { useState } from 'react';
import { usePatients } from '../Hooks/usePatients';
import { useCurrentStage } from '../Hooks/useCurrentStage';
import { Patient, PatientStatus } from '../types/doctor.types';
import { Table, Column } from '../../Common/Components/Table';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { PatientIntakeModal } from '../Components/PatientIntakeModal';
import {
  Search,
  UserPlus,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  FileSpreadsheet,
  BarChart3,
  FileText,
  Clock,
} from 'lucide-react';

export interface MyPatientsProps {
  onSelectPatientForPrakriti?: (patient: Patient) => void;
  onSelectPatientForPlan?: (patient: Patient) => void;
  onSelectPatientForAnalytics?: (patient: Patient) => void;
  onSelectPatientForReports?: (patient: Patient) => void;
}

export const MyPatients: React.FC<MyPatientsProps> = ({
  onSelectPatientForPrakriti,
  onSelectPatientForPlan,
  onSelectPatientForAnalytics,
  onSelectPatientForReports,
}) => {
  const {
    patients,
    rawPatients,
    isLoading,
    isAdding,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    addPatient,
  } = usePatients();

  const [intakeModalOpen, setIntakeModalOpen] = useState(false);

  const statusFilterOptions: { label: string; value: string; count: number }[] = [
    { label: 'All Patients', value: 'all', count: rawPatients.length },
    {
      label: 'New / Intake',
      value: 'new',
      count: rawPatients.filter((p) => p.status === 'new').length,
    },
    {
      label: 'Prakriti Confirmed · Awaiting Plan',
      value: 'prakriti_confirmed',
      count: rawPatients.filter((p) => p.status === 'prakriti_confirmed').length,
    },
    {
      label: 'In Progress',
      value: 'in_progress',
      count: rawPatients.filter((p) => p.status === 'in_progress').length,
    },
    {
      label: 'Flagged (Alert)',
      value: 'flagged',
      count: rawPatients.filter((p) => p.status === 'flagged').length,
    },
    {
      label: 'Completed',
      value: 'completed',
      count: rawPatients.filter((p) => p.status === 'completed').length,
    },
  ];

  const handlePatientIntakeSubmit = async (data: Parameters<typeof addPatient>[0]) => {
    const created = await addPatient(data);
    setIntakeModalOpen(false);
    if (onSelectPatientForPrakriti && created) {
      onSelectPatientForPrakriti(created);
    }
  };

  const columns: Column<Patient>[] = [
    {
      header: 'Patient Details',
      accessorKey: 'name',
      render: (item) => {
        const initials = item.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#e8ede7] text-ayur-primary font-bold text-xs flex items-center justify-center border border-ayur-sand/80 shrink-0 font-serif">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 font-serif text-sm">
                  {item.name}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  ({item.age}y • {item.gender})
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium block mt-0.5">
                ID: {item.id} • {item.contact}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Diagnosis & Chief Complaint',
      accessorKey: 'diagnosis',
      render: (item) => (
        <div className="max-w-md">
          <p className="font-bold text-gray-900 text-xs font-serif leading-snug">
            {item.diagnosis}
          </p>
          <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
            {item.chiefComplaint}
          </p>
        </div>
      ),
    },
    {
      header: 'Prakriti & Protocol',
      render: (item) => (
        <div>
          {item.dominantPrakriti ? (
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="ayur" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                {item.dominantPrakriti}
              </Badge>
            </div>
          ) : (
            <span className="text-amber-700 font-medium text-[11px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
              Prakriti Pending
            </span>
          )}

          {item.assignedPackageName ? (
            <div>
              <p className="font-bold text-gray-800 text-xs">
                {item.assignedPackageName}
              </p>
              <p className="text-[10px] text-ayur-green-mid font-semibold mt-0.5">
                {item.currentStage || 'Poorvakarma'} • Day {item.currentDay || 1} of {item.totalDays || 7}
              </p>
            </div>
          ) : (
            <span className="text-[11px] text-gray-400 font-medium">
              No protocol assigned
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (item) => {
        switch (item.status) {
          case 'new':
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                New / Intake
              </span>
            );
          case 'prakriti_confirmed':
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#f2eee3] text-amber-900 border border-[#e5dec9]">
                Prakriti Confirmed · Awaiting Plan
              </span>
            );
          case 'in_progress':
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                In Progress
              </span>
            );
          case 'flagged':
            return (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Flagged (Alert)
              </span>
            );
          case 'completed':
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Completed
              </span>
            );
          default:
            return (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                {item.status}
              </span>
            );
        }
      },
    },
    {
      header: 'Clinical Actions',
      render: (item) => {
        return (
          <div className="flex items-center justify-end gap-2">
            {item.status === 'new' && onSelectPatientForPrakriti && (
              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => onSelectPatientForPrakriti(item)}
              >
                Start Assessment
              </Button>
            )}

            {item.status === 'prakriti_confirmed' && onSelectPatientForPlan && (
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => onSelectPatientForPlan(item)}
              >
                Create Plan
              </Button>
            )}

            {item.status === 'in_progress' && onSelectPatientForAnalytics && (
              <Button
                variant="primary"
                size="sm"
                icon={<BarChart3 className="w-3.5 h-3.5" />}
                onClick={() => onSelectPatientForAnalytics(item)}
              >
                View Analytics
              </Button>
            )}

            {item.status === 'flagged' && onSelectPatientForAnalytics && (
              <Button
                variant="danger"
                size="sm"
                icon={<AlertTriangle className="w-3.5 h-3.5" />}
                onClick={() => onSelectPatientForAnalytics(item)}
              >
                Review Flag
              </Button>
            )}

            {item.status === 'completed' && onSelectPatientForReports && (
              <Button
                variant="secondary"
                size="sm"
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => onSelectPatientForReports(item)}
              >
                View Report
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
              Patient Clinical Directory
            </h1>
            <Badge variant="ayur" size="sm">
              {rawPatients.length} Active Records
            </Badge>
          </div>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Manage comprehensive clinical lifecycle from diagnostic Prakriti intake to discharge reports.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIntakeModalOpen(true)}
        >
          Add New Patient
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-ayur-sand/80 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, ID, diagnosis..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-ayur-sand/80 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary text-gray-900"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto">
          {statusFilterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedStatus(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedStatus === opt.value
                  ? 'bg-ayur-primary text-white shadow-2xs font-bold'
                  : 'bg-[#fbf9f5] text-gray-600 border border-ayur-sand/80 hover:border-ayur-primary/50'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedStatus === opt.value
                    ? 'bg-white/20 text-white'
                    : 'bg-ayur-sand/40 text-gray-700'
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table */}
      <Table
        columns={columns}
        data={patients}
        keyExtractor={(item) => item.id}
        emptyMessage="No patients match the selected search criteria or status filter."
        mobileView="cards"
      />

      {/* Intake Modal */}
      <PatientIntakeModal
        isOpen={intakeModalOpen}
        onClose={() => setIntakeModalOpen(false)}
        onSubmit={handlePatientIntakeSubmit}
        isLoading={isAdding}
      />
    </div>
  );
};
