// src/Doctor/Components/TherapyStageEditor.tsx
import React from 'react';
import { TherapyStage } from '../types/doctor.types';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import {
  Clock,
  Calendar,
  Plus,
  Minus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

export interface TherapyStageEditorProps {
  stages: TherapyStage[];
  isEditable?: boolean;
  onUpdateStage?: (index: number, updated: Partial<TherapyStage>) => void;
  onRemoveStage?: (index: number) => void;
  onMoveStage?: (index: number, direction: 'up' | 'down') => void;
  onAddStage?: () => void;
  onUpdateDuration?: (stageId: string, deltaDays: number) => void;
  isCustomizable?: boolean;
  errors?: { [stageIndex: number]: { [field: string]: string } };
  className?: string;
}

export const TherapyStageEditor: React.FC<TherapyStageEditorProps> = ({
  stages,
  isEditable = false,
  onUpdateStage,
  onRemoveStage,
  onMoveStage,
  onAddStage,
  onUpdateDuration,
  isCustomizable = false,
  errors = {},
  className = '',
}) => {
  if (!isEditable) {
    // Read-only / Preview mode (used inside package accordion view)
    return (
      <div className={`flex flex-col gap-3.5 ${className}`}>
        {stages.map((stage, idx) => (
          <div
            key={stage.id || `stage-${idx}`}
            className="p-4 rounded-xl bg-[#fbf9f5] border border-ayur-sand/70 flex flex-col gap-2.5 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white text-ayur-primary font-bold text-xs flex items-center justify-center border border-ayur-sand/70 shrink-0 font-serif">
                  {idx + 1}
                </span>
                <div>
                  <h5 className="text-sm font-bold text-gray-900 font-serif">
                    {stage.name}
                  </h5>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {stage.category} • Day {stage.dayOffset} onwards
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Badge variant="ayur" size="sm" icon={<Clock className="w-3 h-3" />}>
                  {stage.durationMinutes} mins/session
                </Badge>

                <div className="flex items-center gap-1.5 bg-white border border-ayur-sand/80 px-2 py-0.5 rounded-lg text-xs font-bold text-ayur-primary">
                  <Calendar className="w-3.5 h-3.5 text-ayur-green-mid" />
                  <span>
                    {stage.durationDays} {stage.durationDays === 1 ? 'Day' : 'Days'}
                  </span>

                  {isCustomizable && onUpdateDuration && (
                    <div className="flex items-center gap-0.5 ml-1.5 border-l border-gray-200 pl-1">
                      <button
                        type="button"
                        onClick={() => onUpdateDuration(stage.id, -1)}
                        disabled={stage.durationDays <= 1}
                        className="p-0.5 hover:bg-gray-100 rounded text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Reduce 1 day"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateDuration(stage.id, 1)}
                        className="p-0.5 hover:bg-gray-100 rounded text-gray-600 cursor-pointer"
                        title="Add 1 day"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pre & Post Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100">
                <span className="font-bold text-ayur-primary uppercase text-[10px] tracking-wider block">
                  Pre-Procedure Protocol:
                </span>
                <p className="text-gray-700 font-medium mt-0.5 leading-snug">
                  {stage.preInstructions || 'Standard pre-procedure preparation.'}
                </p>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-gray-100">
                <span className="font-bold text-ayur-brown uppercase text-[10px] tracking-wider block">
                  Post-Procedure & Diet Care:
                </span>
                <p className="text-gray-700 font-medium mt-0.5 leading-snug">
                  {stage.postInstructions || 'Standard post-procedure Samsarjana care.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full Interactive Authoring & Editing Mode (used inside Package Builder Modal)
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {stages.map((stage, idx) => {
        const stageErrors = errors[idx] || {};
        return (
          <div
            key={stage.id || `stage-${idx}`}
            className="p-4 rounded-2xl bg-white border-2 border-ayur-sand/80 shadow-2xs flex flex-col gap-3 transition-all hover:border-ayur-primary/40"
          >
            {/* Stage Header Toolbar */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-ayur-primary text-white font-bold text-xs flex items-center justify-center font-serif shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold font-serif text-gray-900">
                  Stage {idx + 1} Configuration
                </span>
              </div>

              {/* Reordering & Delete Controls */}
              <div className="flex items-center gap-1">
                {onMoveStage && (
                  <>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveStage(idx, 'up')}
                      className="p-1 rounded-lg text-gray-500 hover:text-ayur-primary hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      title="Move stage earlier"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stages.length - 1}
                      onClick={() => onMoveStage(idx, 'down')}
                      className="p-1 rounded-lg text-gray-500 hover:text-ayur-primary hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                      title="Move stage later"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </>
                )}

                {onRemoveStage && stages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveStage(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 ml-1 cursor-pointer transition"
                    title="Remove this stage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Row 1: Stage Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                  Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={stage.name}
                  onChange={(e) =>
                    onUpdateStage && onUpdateStage(idx, { name: e.target.value })
                  }
                  placeholder="e.g. Deepana & Pachana Priming"
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-ayur-primary ${
                    stageErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-ayur-sand/80 bg-[#fbf9f5]'
                  }`}
                />
                {stageErrors.name && (
                  <span className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {stageErrors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                  Stage Category *
                </label>
                <select
                  value={stage.category}
                  onChange={(e) =>
                    onUpdateStage &&
                    onUpdateStage(idx, {
                      category: e.target.value as 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma',
                    })
                  }
                  className="w-full rounded-xl border border-ayur-sand/80 px-2.5 py-1.5 text-xs font-semibold text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
                >
                  <option value="Poorvakarma">Poorvakarma (Prep)</option>
                  <option value="Pradhanakarma">Pradhanakarma (Main)</option>
                  <option value="Paschatkarma">Paschatkarma (Post)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Day Offset, Duration Days, Duration Minutes */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                  Day Offset (Start) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={stage.dayOffset}
                  onChange={(e) =>
                    onUpdateStage &&
                    onUpdateStage(idx, { dayOffset: Math.max(1, Number(e.target.value)) })
                  }
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-ayur-primary ${
                    stageErrors.dayOffset ? 'border-rose-400 bg-rose-50/50' : 'border-ayur-sand/80 bg-[#fbf9f5]'
                  }`}
                />
                {stageErrors.dayOffset && (
                  <span className="text-[10px] text-rose-600 font-medium">
                    {stageErrors.dayOffset}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={stage.durationDays}
                  onChange={(e) =>
                    onUpdateStage &&
                    onUpdateStage(idx, { durationDays: Math.max(1, Number(e.target.value)) })
                  }
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-ayur-primary ${
                    stageErrors.durationDays ? 'border-rose-400 bg-rose-50/50' : 'border-ayur-sand/80 bg-[#fbf9f5]'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                  Mins / Session *
                </label>
                <input
                  type="number"
                  min={15}
                  step={5}
                  required
                  value={stage.durationMinutes}
                  onChange={(e) =>
                    onUpdateStage &&
                    onUpdateStage(idx, { durationMinutes: Math.max(15, Number(e.target.value)) })
                  }
                  className="w-full rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs font-semibold text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
                />
              </div>
            </div>

            {/* Row 3: Pre-Procedure Protocol & Post-Procedure Care */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-ayur-primary tracking-wider">
                  Pre-Procedure Protocol Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={stage.preInstructions || ''}
                  onChange={(e) =>
                    onUpdateStage &&
                    onUpdateStage(idx, { preInstructions: e.target.value })
                  }
                  placeholder="e.g. Empty stomach, administer Trikatu Churna with warm water..."
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-ayur-primary resize-none ${
                    stageErrors.preInstructions ? 'border-rose-400 bg-rose-50/50' : 'border-ayur-sand/80 bg-[#fbf9f5]'
                  }`}
                />
                {stageErrors.preInstructions && (
                  <span className="text-[10px] text-rose-600 font-medium">
                    {stageErrors.preInstructions}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-ayur-brown tracking-wider">
                  Post-Procedure & Diet Care Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={stage.postInstructions || ''}
                  onChange={(e) =>
                    onUpdateStage &&
                    onUpdateStage(idx, { postInstructions: e.target.value })
                  }
                  placeholder="e.g. Assess Agni, provide warm mung soup, avoid cold breeze..."
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-ayur-primary resize-none ${
                    stageErrors.postInstructions ? 'border-rose-400 bg-rose-50/50' : 'border-ayur-sand/80 bg-[#fbf9f5]'
                  }`}
                />
                {stageErrors.postInstructions && (
                  <span className="text-[10px] text-rose-600 font-medium">
                    {stageErrors.postInstructions}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* [+ Add Another Stage] Button */}
      {onAddStage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<Plus className="w-4 h-4 text-ayur-primary" />}
          onClick={onAddStage}
          className="border-dashed border-2 border-ayur-sand/90 hover:border-ayur-primary py-2.5"
        >
          Add Another Stage
        </Button>
      )}
    </div>
  );
};
