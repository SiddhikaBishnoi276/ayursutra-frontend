// src/Doctor/Components/TherapistSelector.tsx
import React from 'react';
import { Therapist } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { UserCheck, Star, Sparkles, CheckCircle2 } from 'lucide-react';

export interface TherapistSelectorProps {
  therapists: (Therapist & { matchScore?: number })[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const TherapistSelector: React.FC<TherapistSelectorProps> = ({
  therapists,
  selectedId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-ayur-primary" />
          Assign Specialized Therapist (Smart Match Algorithm)
        </span>
        <span className="text-[11px] text-gray-500 font-medium">
          Ranked by specialization & gender continuity
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {therapists.map((t, idx) => {
          const isSelected = t.id === selectedId;
          const isTopMatch = idx === 0;

          return (
            <div
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2 relative ${
                isSelected
                  ? 'border-ayur-primary bg-emerald-50/40 shadow-xs'
                  : 'border-ayur-sand/80 bg-white hover:border-ayur-primary/50'
              }`}
            >
              {isTopMatch && (
                <span className="absolute -top-2.5 right-3 bg-amber-500 text-white font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1 border border-amber-600/20">
                  <Sparkles className="w-3 h-3 fill-white" /> Best Match
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#e8ede7] text-ayur-primary font-bold text-xs flex items-center justify-center font-serif border border-ayur-sand/80 shrink-0 shadow-2xs">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 font-serif">
                      {t.name}
                    </h5>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {t.gender} • Active Workload: {t.activeWorkload} sessions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{t.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-1">
                {t.specializations.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[9px] font-semibold bg-[#fbf9f5] text-ayur-green-mid border border-ayur-sand/70 px-2 py-0.5 rounded-md"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
