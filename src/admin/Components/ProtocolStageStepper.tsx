// src/admin/components/ProtocolStageStepper.tsx
import React from 'react';
import { PackageStage } from '../types/admin.types';
import { Badge, BadgeVariant } from '../../Common/Components/Badge';
import { Clock, Calendar } from 'lucide-react';

interface ProtocolStageStepperProps {
  stages: PackageStage[];
  className?: string;
}

export const ProtocolStageStepper: React.FC<ProtocolStageStepperProps> = ({
  stages,
  className = '',
}) => {
  const getCategoryVariant = (cat: PackageStage['stageCategory']): BadgeVariant => {
    switch (cat) {
      case 'Poorvakarma':
        return 'ayur';
      case 'Pradhanakarma':
        return 'warning';
      case 'Paschatkarma':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ayur-green-mid">
        <span>Procedure Stage Timeline</span>
        <span>{stages.length} Structured Phases</span>
      </div>

      <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 overflow-x-auto pb-2">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          return (
            <React.Fragment key={stage.id || idx}>
              <div className="flex-1 min-w-[200px] bg-white p-3.5 rounded-xl border border-ayur-sand/60 shadow-2xs hover:border-ayur-green-mid/40 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#f4f7f4] text-ayur-primary font-bold text-xs flex items-center justify-center font-serif shrink-0">
                    {idx + 1}
                  </span>
                  <Badge variant={getCategoryVariant(stage.stageCategory)} size="sm">
                    {stage.stageCategory}
                  </Badge>
                </div>

                <h4 className="font-bold text-gray-900 text-xs font-serif truncate">
                  {stage.stageName}
                </h4>

                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-ayur-green-mid" />
                    Day {(stage.dayOffset ?? 0) + 1}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-ayur-green-mid" />
                    {stage.durationMinutes} min
                  </span>
                </div>
              </div>

              {!isLast && (
                <div className="hidden md:flex items-center text-ayur-sand">
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
