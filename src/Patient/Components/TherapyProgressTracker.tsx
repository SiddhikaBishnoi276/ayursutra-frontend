// src/Patient/Components/TherapyProgressTracker.tsx
// Visual stage-by-stage interactive timeline and progress tracker for Panchakarma regimen

import React, { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { TherapyStage } from '../types/patient.types';
import { formatDate } from '../Services/patientService';

export interface TherapyProgressTrackerProps {
  stages: TherapyStage[];
  currentStageName?: string;
  onSelectStage?: (stage: TherapyStage) => void;
  className?: string;
}

export const TherapyProgressTracker: React.FC<TherapyProgressTrackerProps> = ({
  stages,
  onSelectStage,
  className = '',
}) => {
  const [activeStageId, setActiveStageId] = useState<string>(() => {
    const current = stages.find((s) => s.status === 'in_progress') || stages[0];
    return current?.stageId || '';
  });

  const selectedStage = stages.find((s) => s.stageId === activeStageId) || stages[0];

  const handleStageClick = (stage: TherapyStage) => {
    setActiveStageId(stage.stageId);
    onSelectStage?.(stage);
  };

  return (
    <Card className={`overflow-hidden border border-ayur-sand/60 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 font-sans">
              Protocol Timeline
            </span>
            <Badge variant="ayur" size="sm">
              {stages.filter((s) => s.status === 'completed').length} of {stages.length} Sessions Complete
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-serif mt-0.5">
            Stage-by-Stage Treatment Journey
          </h3>
        </div>
      </div>

      {/* Horizontal Stage Stepper */}
      <div className="py-5 overflow-x-auto">
        <div className="flex items-center min-w-[620px] justify-between relative px-2">
          {/* Background Connecting Track */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-stone-100 rounded-full z-0" />

          {stages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isSelected = stage.stageId === activeStageId;

            return (
              <button
                key={stage.stageId}
                type="button"
                onClick={() => handleStageClick(stage)}
                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-all duration-200 focus:outline-none`}
              >
                {/* Step Node */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 shadow-2xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                      : isInProgress
                      ? 'bg-purple-700 text-white ring-4 ring-purple-100 animate-pulse'
                      : 'bg-white text-gray-400 border-2 border-stone-200 group-hover:border-ayur-green-mid'
                  } ${isSelected ? 'ring-4 ring-purple-300 scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isInProgress ? (
                    <Sparkles className="w-4.5 h-4.5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Day & Stage Label */}
                <div className="mt-2 text-center max-w-[90px]">
                  <span
                    className={`block text-[11px] font-bold ${
                      isInProgress
                        ? 'text-purple-700'
                        : isCompleted
                        ? 'text-emerald-800'
                        : 'text-gray-500'
                    }`}
                  >
                    Day {stage.dayNumber}
                  </span>
                  <span className="block text-[10px] text-gray-500 font-medium truncate">
                    {stage.stageCategory}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      {selectedStage && (
        <div className="mt-2 p-4 sm:p-5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/70 transition-all">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-ayur-sand/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-ayur-brown uppercase tracking-wider">
                  {selectedStage.stageCategory}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-600 font-medium">
                  {formatDate(selectedStage.scheduledDate)} at {selectedStage.scheduledTime}
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900 font-serif mt-1">
                {selectedStage.stageName}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  selectedStage.status === 'completed'
                    ? 'success'
                    : selectedStage.status === 'in_progress'
                    ? 'ayur'
                    : 'info'
                }
                size="md"
              >
                {selectedStage.status === 'completed'
                  ? 'Completed ✓'
                  : selectedStage.status === 'in_progress'
                  ? 'Current Session'
                  : 'Scheduled'}
              </Badge>
            </div>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed mt-3">
            <span className="font-bold text-gray-900">Therapeutic Purpose: </span>
            {selectedStage.purpose}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3.5 pt-3 border-t border-ayur-sand/30">
            <div className="p-3 bg-white rounded-lg border border-stone-200/80 text-xs">
              <span className="font-bold text-gray-900 block mb-1">Pre-Care Guidelines:</span>
              <ul className="list-disc list-inside text-gray-600 space-y-0.5 text-[11px]">
                {selectedStage.preCareInstructions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200/80 text-xs">
              <span className="font-bold text-gray-900 block mb-1">Post-Care Protocol:</span>
              <ul className="list-disc list-inside text-gray-600 space-y-0.5 text-[11px]">
                {selectedStage.postCareInstructions.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TherapyProgressTracker;
