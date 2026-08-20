// src/Doctor/Pages/ProgressAnalyticsPage.tsx
import React, { useState, useEffect } from 'react';
import { useProgressAnalytics } from '../Hooks/useProgressAnalytics';
import { useCurrentStage } from '../Hooks/useCurrentStage';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { VitalsTrendChart } from '../Components/VitalsTrendChart';
import { GanttTimeline } from '../Components/GanttTimeline';
import { ComparativeOutcomeCard } from '../Components/ComparativeOutcomeCard';
import { RecordTherapyVitalsModal } from '../Components/RecordTherapyVitalsModal';
import { StatCard } from '../../Common/Components/StatCard';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import {
  User,
  PlusCircle,
  MessageSquare,
  FileEdit,
  Stethoscope,
  Calendar,
  Activity,
  Award,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

import { PatientSwitcher } from '../Components/PatientSwitcher';
import { Patient } from '../types/doctor.types';

export interface ProgressAnalyticsPageProps {
  initialPatientId?: string;
  onModifyPlan?: (patientId: string) => void;
  onSelectPatient?: (patient: Patient) => void;
}

export const ProgressAnalyticsPage: React.FC<ProgressAnalyticsPageProps> = ({
  initialPatientId = 'PAT-101',
  onModifyPlan,
  onSelectPatient,
}) => {
  const { data: patients = [] } = useGetPatientsQuery();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);

  useEffect(() => {
    if (initialPatientId) {
      setSelectedPatientId(initialPatientId);
    }
  }, [initialPatientId]);

  const { comparativeReport, progressTimeline, metrics } = useProgressAnalytics(selectedPatientId);
  const currentStageInfo = useCurrentStage(selectedPatientId);
  const [selectedTab, setSelectedTab] = useState<'vitals' | 'timeline' | 'comparative'>('vitals');

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || {
    id: selectedPatientId,
    name: 'Rahul Verma',
    diagnosis: 'Vata-Kaphaja Katigraha',
    dominantPrakriti: 'Vata-Pitta',
    status: 'in_progress',
    complicationAlert: undefined,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Persistent Pinned Header with Patient Name & Live Stage */}
      <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-ayur-sand/80 shadow-2xs flex flex-col gap-4 sticky top-0 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
                Progress & Analytics
              </h1>
              <Badge variant="ayur" size="md" icon={<User className="w-3.5 h-3.5" />}>
                Patient: {activePatient.name} ({activePatient.id})
              </Badge>
              <Badge variant="info" size="md" icon={<Calendar className="w-3.5 h-3.5" />}>
                {currentStageInfo.stageDisplayLabel}
              </Badge>
              {currentStageInfo.isFlagged && (
                <Badge variant="danger" size="md" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                  Flag Alert
                </Badge>
              )}
            </div>
            <p className="text-xs text-ayur-green-mid font-medium mt-1">
              Merged therapist clinical observations and patient subjective telemetry across Panchakarma stages.
            </p>
          </div>

          {/* Integrated Patient Switcher Dropdown */}
          <PatientSwitcher
            selectedPatientId={selectedPatientId}
            onSelectPatient={(p) => {
              setSelectedPatientId(p.id);
              if (onSelectPatient) {
                onSelectPatient(p);
              }
            }}
          />
        </div>

        {/* 3 Sub-Tabs & Action Triggers Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 bg-[#fbf9f5] border border-ayur-sand/80 p-1 rounded-full shadow-2xs self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setSelectedTab('vitals')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'vitals'
                  ? 'bg-ayur-primary text-white shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-ayur-primary'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Session Vitals & Dual Pain Trends
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('timeline')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'timeline'
                  ? 'bg-ayur-primary text-white shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-ayur-primary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Gantt Timeline & Procedure Logs
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('comparative')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'comparative'
                  ? 'bg-ayur-primary text-white shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-ayur-primary'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Pre vs. Post Comparative Outcomes
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            <Button
              variant="outline"
              size="sm"
              icon={<Stethoscope className="w-3.5 h-3.5 text-ayur-primary" />}
              onClick={() => setVitalsModalOpen(true)}
            >
              Record Vitals
            </Button>

            {onModifyPlan && (
              <Button
                variant="outline"
                size="sm"
                icon={<FileEdit className="w-3.5 h-3.5 text-slate-700" />}
                onClick={() => onModifyPlan(selectedPatientId)}
              >
                Modify Plan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <StatCard
          label="Average Symptom Relief"
          value={metrics.painReliefPercent > 0 ? `${metrics.painReliefPercent}.0% Relief` : '82.0% Relief'}
          context="Based on active Panchakarma sessions"
          trend={{ text: '+14% vs baseline', variant: 'success' }}
        />

        <StatCard
          label="Pain Score Reduction"
          value={`${metrics.initialPain || 8}.0 → ${metrics.currentPain || 1.5}`}
          context="Visual Analogue Scale (VAS)"
          trend={{ text: `-${metrics.painReliefPercent || 75}% Reduction`, variant: 'success' }}
        />

        <StatCard
          label="Protocol Adherence"
          value="96.5% Rate"
          context="Diet regimen & attendance"
          trend={{ text: 'Excellent', variant: 'ayur' }}
        />

        <StatCard
          label="Abnormal Observations"
          value={`${metrics.flaggedPoints.length} Logged`}
          context={metrics.flaggedPoints.length > 0 ? 'Review flagged markers below' : 'Zero complications'}
          trend={{
            text: metrics.flaggedPoints.length > 0 ? 'Action Required' : 'Optimal',
            variant: metrics.flaggedPoints.length > 0 ? 'danger' : 'info',
          }}
        />
      </div>

      {/* Tab 1: Vitals & Pain Trends */}
      {selectedTab === 'vitals' && (
        <VitalsTrendChart progressPoints={progressTimeline} />
      )}

      {/* Tab 2: Gantt Timeline & Procedure Logs */}
      {selectedTab === 'timeline' && (
        <GanttTimeline
          currentDay={currentStageInfo.currentDay}
          totalDays={currentStageInfo.totalDays}
          currentStage={currentStageInfo.currentStage}
          complicationAlert={activePatient.complicationAlert}
        />
      )}

      {/* Tab 3: Comparative Outcome Report */}
      {selectedTab === 'comparative' && comparativeReport && (
        <ComparativeOutcomeCard report={comparativeReport} />
      )}

      {/* Record Vitals Modal */}
      <RecordTherapyVitalsModal
        isOpen={vitalsModalOpen}
        onClose={() => setVitalsModalOpen(false)}
        patientId={selectedPatientId}
        patientName={activePatient.name}
      />
    </div>
  );
};
