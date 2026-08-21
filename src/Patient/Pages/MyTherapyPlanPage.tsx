// src/Patient/Pages/MyTherapyPlanPage.tsx
// Screen 2: Full Package Details, Stage-by-Stage Breakdown, and Pre/Post Care Instructions

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Pill,
  Leaf,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { EmptyState } from '../../Common/Components/EmptyState';
import { Skeleton } from '../../Common/Components/Skeleton';
import { BackButton } from '../../Common/Components/BackButton';

import { useMyTherapyPlan } from '../Hooks/useMyTherapyPlan';
import { useGetMyPrescriptionsQuery } from '../apis/patientApi';
import { formatDate } from '../Services/patientService';
import { DietPlanCard } from '../Components/DietPlanCard';
import { PrecareInstructionsCard } from '../Components/PrecareInstructionsCard';
import { PostcareInstructionsCard } from '../Components/PostcareInstructionsCard';
import { PrescriptionDrawer } from '../Components/PrescriptionDrawer';

export const MyTherapyPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { plan, stats, isLoading: isPlanLoading } = useMyTherapyPlan();
  const { data: prescriptions, isLoading: isPrescLoading } = useGetMyPrescriptionsQuery();

  const [expandedStageId, setExpandedStageId] = useState<string | null>(() => {
    return 'STG-105'; // Default to in_progress Day 5
  });
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  const toggleStage = (stageId: string) => {
    setExpandedStageId(expandedStageId === stageId ? null : stageId);
  };

  if (isPlanLoading || isPrescLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-44" />
        <Skeleton variant="card" className="h-64" />
        <Skeleton variant="card" className="h-64" />
      </div>
    );
  }

  // Edge Case 1: No active therapy plan
  if (!plan) {
    return (
      <div className="py-12">
        <EmptyState
          title="No Active Treatment Plan Found"
          message="You do not have an active Panchakarma protocol assigned yet. Please consult with your Ayurvedic doctor."
          action={
            <Button variant="primary" onClick={() => navigate('/patient/profile')}>
              View Doctor Information
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Back Button and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/dashboard" label="Dashboard" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif tracking-tight">
              My Therapy Plan & Protocol
            </h1>
            <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
              Comprehensive Panchakarma breakdown prescribed by {plan.doctorName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPrescriptionOpen(true)}
            icon={<Pill className="w-3.5 h-3.5 text-purple-700" />}
          >
            View Prescriptions
          </Button>
        </div>
      </div>

      {/* 2. Package Overview Card */}
      <Card className="border border-ayur-sand/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="ayur" size="sm">
                Active Protocol
              </Badge>
              <Badge variant="info" size="sm">
                ID: {plan.planId}
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              {plan.packageName}
            </h2>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Primary Diagnosis: <strong className="text-gray-900">{plan.condition}</strong>
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Protocol Progress
            </span>
            <span className="text-2xl font-black text-gray-900 font-serif">
              {stats.progressPercent}%
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
              {stats.completed} of {stats.total} sessions finished
            </span>
          </div>
        </div>

        {/* Doctor & Schedule Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-1">
          <div className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">
              Supervising Physician
            </span>
            <span className="text-xs font-bold text-gray-900 font-serif block mt-0.5">
              {plan.doctorName}
            </span>
            <span className="text-[11px] text-gray-500 font-medium truncate block">
              {plan.doctorSpecialty}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">
              Treatment Window
            </span>
            <span className="text-xs font-bold text-gray-900 font-serif block mt-0.5">
              {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
            </span>
            <span className="text-[11px] text-gray-500 font-medium block">
              {plan.totalSessions} Total Daily Cycles
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">
              Active Stage
            </span>
            <span className="text-xs font-bold text-purple-800 font-serif block mt-0.5 truncate">
              {plan.currentStageName}
            </span>
            <span className="text-[11px] text-purple-700 font-medium block">
              Day {stats.completed + 1} of {stats.total}
            </span>
          </div>
        </div>
      </Card>

      {/* 3. Stage-by-Stage Breakdown Accordion */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900 font-serif">
            Stage-by-Stage Clinical Regimen ({plan.stages.length} Days)
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Click any stage to view pre/post care details
          </span>
        </div>

        <div className="space-y-3">
          {plan.stages.map((stage) => {
            const isExpanded = expandedStageId === stage.stageId;
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';

            return (
              <Card
                key={stage.stageId}
                className={`border transition-all overflow-hidden p-0 ${
                  isInProgress
                    ? 'border-purple-300 ring-2 ring-purple-50'
                    : isCompleted
                    ? 'border-emerald-200/80 bg-white'
                    : 'border-stone-200/80 bg-white'
                }`}
              >
                {/* Header Clickable Row */}
                <button
                  type="button"
                  onClick={() => toggleStage(stage.stageId)}
                  className="w-full flex flex-wrap items-center justify-between p-4 sm:p-5 text-left hover:bg-[#fbf9f5]/70 transition-colors cursor-pointer gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-purple-100 text-purple-800 animate-pulse'
                          : 'bg-stone-100 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <span>D{stage.dayNumber}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-ayur-brown uppercase tracking-wider">
                          {stage.stageCategory}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {formatDate(stage.scheduledDate)} at {stage.scheduledTime}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 font-serif mt-0.5 truncate">
                        {stage.stageName}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={isCompleted ? 'success' : isInProgress ? 'ayur' : 'info'}
                      size="sm"
                    >
                      {isCompleted
                        ? 'Completed ✓'
                        : isInProgress
                        ? 'Current Session'
                        : 'Scheduled'}
                    </Badge>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Accordion Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#fdfdfa] space-y-4">
                    {/* Purpose & Therapist summary */}
                    <div>
                      <span className="text-xs font-bold text-gray-900 font-serif block mb-0.5">
                        Clinical Purpose:
                      </span>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                        {stage.purpose}
                      </p>
                    </div>

                    {/* Herbs & Formulation Used */}
                    {stage.herbsAndMaterials && stage.herbsAndMaterials.length > 0 && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-900 font-bold mb-1.5 font-serif">
                          <Leaf className="w-3.5 h-3.5 text-ayur-brown" />
                          <span>Herbal Formulations & Therapeutic Oils Used:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {stage.herbsAndMaterials.map((herb, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-gray-800 text-[11px] font-semibold"
                            >
                              {herb}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pre-care and Post-care cards grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <PrecareInstructionsCard
                        instructions={stage.preCareInstructions}
                        stageName={stage.stageName}
                      />
                      <PostcareInstructionsCard
                        instructions={stage.postCareInstructions}
                        stageName={stage.stageName}
                      />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. AI & Doctor Prescribed Diet Plan */}
      {prescriptions?.dietPlan && (
        <div className="pt-2">
          <DietPlanCard dietPlan={prescriptions.dietPlan} />
        </div>
      )}

      {/* Prescription Drawer */}
      <PrescriptionDrawer
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        prescription={prescriptions || null}
      />
    </div>
  );
};

export default MyTherapyPlanPage;
