// src/Doctor/Pages/AIDietExerciseReviewPage.tsx
import React, { useState, useEffect } from 'react';
import { useAIDietReview } from '../Hooks/useAIDietReview';
import { useApproveAndDispatch } from '../Hooks/useApproveAndDispatch';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { Patient } from '../types/doctor.types';
import { AIDietCard } from '../Components/AIDietCard';
import { PatientSwitcher } from '../Components/PatientSwitcher';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { BackButton } from '../../Common/Components/BackButton';
import {
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Mail,
  KeyRound,
  Users,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

export interface AIDietExerciseReviewPageProps {
  patient?: Patient;
  patientId?: string;
  patientName?: string;
  patientContact?: string;
  patientEmail?: string;
  assignedPackageName?: string;
  onPlanApproved?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onBack?: () => void;
}

export const AIDietExerciseReviewPage: React.FC<AIDietExerciseReviewPageProps> = ({
  patient,
  patientId,
  patientName,
  patientContact,
  patientEmail,
  assignedPackageName,
  onPlanApproved,
  onSelectPatient,
  onBack,
}) => {
  const { data: patients = [] } = useGetPatientsQuery();

  const initialId =
    patient?.id ||
    patientId ||
    patients.find((p) => p.status === 'in_progress' || p.status === 'prakriti_confirmed')?.id ||
    patients[0]?.id ||
    'PAT-101';

  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialId);

  useEffect(() => {
    if (patient?.id) {
      setSelectedPatientId(patient.id);
    } else if (patientId) {
      setSelectedPatientId(patientId);
    }
  }, [patient?.id, patientId]);

  const activePatient: Patient =
    patients.find((p) => p.id === selectedPatientId) ||
    patient || {
      id: selectedPatientId,
      name: patientName || 'Rahul Verma',
      contact: patientContact || '+91 98765 43210',
      email: patientEmail || 'rahul.verma@example.com',
      gender: 'Male',
      age: 42,
      chiefComplaint: 'Chronic lower back stiffness',
      diagnosis: 'Vata-Kaphaja Katigraha',
      status: 'in_progress',
      onboardedDate: '2026-08-12',
      dominantPrakriti: 'Vata-Pitta',
      assignedPackageName: assignedPackageName || '7-Day Virechana Protocol',
    };

  const {
    dietPlan,
    isEditing,
    setIsEditing,
    updateStageDietRecommendation,
    updateStageYogaAsana,
    triggerMidCourseRegeneration,
  } = useAIDietReview(selectedPatientId);

  const {
    approveAndDispatch,
    retryEmail,
    dispatchResult,
    isDispatching,
  } = useApproveAndDispatch();

  const [showDispatchBanner, setShowDispatchBanner] = useState(false);

  const handleApprove = async () => {
    if (!dietPlan) return;
    await approveAndDispatch({
      patientId: activePatient.id,
      patientName: activePatient.name,
      patientContact: activePatient.contact,
      patientEmail: activePatient.email,
      assignedPackageName: activePatient.assignedPackageName || assignedPackageName || 'Panchakarma Protocol',
      dietPlan,
    });
    setShowDispatchBanner(true);
  };

  const isApproved = dietPlan?.isApproved || !!dispatchResult;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && <BackButton onClick={onBack} label="Back" className="mt-0.5" />}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
                AI Diet & Exercise Protocol Review
              </h1>
              <Badge variant="ayur" size="sm">
                Patient: {activePatient.name} ({activePatient.id})
              </Badge>
              {activePatient.dominantPrakriti && (
                <Badge variant="info" size="sm">
                  {activePatient.dominantPrakriti}
                </Badge>
              )}
            </div>
            <p className="text-sm text-ayur-green-mid font-medium mt-1">
              Personalized dietary therapy & yogic exercise regimens computed from confirmed Prakriti ({activePatient.dominantPrakriti || 'Equilibrium'}) and diagnosis ({activePatient.diagnosis}).
            </p>
          </div>
        </div>

        {/* Dynamic Patient Switcher */}
        <PatientSwitcher
          selectedPatientId={selectedPatientId}
          onSelectPatient={(p: Patient) => {
            setSelectedPatientId(p.id);
            setShowDispatchBanner(false);
            if (onSelectPatient) {
              onSelectPatient(p);
            }
          }}
        />
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-ayur-sand/80 shadow-2xs flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-serif text-gray-900">
            Prescribed Protocol: <strong className="text-ayur-primary font-bold">{activePatient.assignedPackageName || assignedPackageName || '7-Day Panchakarma Protocol'}</strong>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-600 font-medium">
            Daily Calorie Benchmark: <strong>{dietPlan?.caloricTarget || 1850} kcal</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done Editing' : 'Edit Prescribed Foods'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<RotateCw className="w-3.5 h-3.5" />}
            onClick={triggerMidCourseRegeneration}
          >
            Mid-Course Re-Adapt
          </Button>

          {!isApproved ? (
            <Button
              variant="primary"
              size="sm"
              icon={<Send className="w-4 h-4" />}
              onClick={handleApprove}
              disabled={isDispatching || !dietPlan}
            >
              {isDispatching ? 'Approving & Dispatching...' : 'Approve & Send to Patient'}
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Approved & Sent
            </span>
          )}
        </div>
      </div>

      {/* Dispatch Feedback Banner */}
      {showDispatchBanner && dispatchResult && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 ${
            dispatchResult.emailSent
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                dispatchResult.emailSent ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            >
              {dispatchResult.emailSent ? <CheckCircle2 className="w-4 h-4" /> : '!'}
            </div>
            <div>
              <h4 className="text-sm font-bold font-serif">
                {dispatchResult.statusText}
              </h4>
              <p className="text-xs mt-0.5 opacity-90">
                Patient: <strong>{activePatient.name}</strong> • Mobile: <strong>{activePatient.contact}</strong> • Email: <strong>{activePatient.email || 'None registered'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!dispatchResult.emailSent && activePatient.email && dietPlan && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => retryEmail(activePatient.email!, activePatient.name, dietPlan)}
              >
                Retry Email
              </Button>
            )}

            {onPlanApproved && (
              <Button type="button" variant="primary" size="sm" onClick={onPlanApproved}>
                Return to Directory
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 3 Stage Diet Cards */}
      {dietPlan ? (
        <div className="flex flex-col gap-6">
          {dietPlan.stages.map((stage, idx) => (
            <AIDietCard
              key={`${selectedPatientId}-${idx}`}
              stage={stage}
              stageIndex={idx}
              isEditing={isEditing}
              onUpdateDiet={updateStageDietRecommendation}
              onUpdateYoga={updateStageYogaAsana}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-ayur-sand/60">
          <p className="text-sm font-bold text-gray-700 font-serif">
            Loading AI Diet & Exercise Protocol for {activePatient.name}...
          </p>
        </div>
      )}
    </div>
  );
};

export default AIDietExerciseReviewPage;
