// src/Doctor/Components/GanttTimeline.tsx
import React from 'react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { AlertCircle, CheckCircle2, Clock, Calendar } from 'lucide-react';

export interface GanttTimelineProps {
  currentDay: number;
  totalDays: number;
  currentStage: 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
  complicationAlert?: {
    severity: 'mild' | 'moderate' | 'critical';
    message: string;
    reportedBy: string;
    time: string;
  };
  className?: string;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  currentDay,
  totalDays = 7,
  currentStage,
  complicationAlert,
  className = '',
}) => {
  const stages = [
    { name: 'Poorvakarma', start: 1, end: 3, label: 'Days 1-3: Deepana & Snehana' },
    { name: 'Pradhanakarma', start: 4, end: 6, label: 'Days 4-6: Main Virechana & Swedana' },
    { name: 'Paschatkarma', start: 7, end: totalDays, label: `Day 7${totalDays > 7 ? `-${totalDays}` : ''}: Samsarjana & Rasayana` },
  ];

  return (
    <Card className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div>
          <h4 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ayur-primary" />
            Patient Clinical Therapy Timeline (Gantt Schedule)
          </h4>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Real-time procedure tracking from preparatory oleation to dietary rehabilitation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="ayur" size="sm">
            Day {currentDay} of {totalDays}
          </Badge>
          <Badge variant="info" size="sm">
            Current Stage: {currentStage}
          </Badge>
        </div>
      </div>

      {/* Complication Alert Banner if present */}
      {complicationAlert && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-900 block">
              Therapist Observation Alert ({complicationAlert.time}):
            </span>
            <p className="font-medium mt-0.5">{complicationAlert.message}</p>
            <span className="text-[10px] text-rose-600 mt-1 block">
              Reported by: {complicationAlert.reportedBy} • Severity: {complicationAlert.severity.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Gantt Visualizer */}
      <div className="flex flex-col gap-3 pt-2">
        {stages.map((stg) => {
          const isCompleted = currentDay > stg.end;
          const isActive = currentDay >= stg.start && currentDay <= stg.end;
          const isPending = currentDay < stg.start;

          return (
            <div key={stg.name} className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-gray-700">
                <span className="font-serif">{stg.name} ({stg.label})</span>
                <span className="text-[10px] uppercase tracking-wider">
                  {isCompleted && <span className="text-emerald-700 font-bold">✓ Completed</span>}
                  {isActive && <span className="text-amber-700 font-bold">● Active (In Progress)</span>}
                  {isPending && <span className="text-gray-400 font-medium">Locked / Upcoming</span>}
                </span>
              </div>

              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex border border-gray-200">
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, ((currentDay - stg.start + 1) / (stg.end - stg.start + 1)) * 100))}%`,
                  }}
                  className={`h-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-emerald-700'
                      : isActive
                      ? 'bg-amber-500'
                      : 'bg-transparent'
                  }`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
