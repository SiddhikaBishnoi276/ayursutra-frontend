// src/Patient/Components/SymptomVASTracker.tsx
// Interactive Visual Analog Scale (0-10) pain and wellbeing slider component

import React from 'react';
import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import { getVASDescriptor } from '../Hooks/useSymptomTracker';

export interface SymptomVASTrackerProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  subtitle?: string;
  showDescriptor?: boolean;
  className?: string;
}

export const SymptomVASTracker: React.FC<SymptomVASTrackerProps> = ({
  value,
  onChange,
  label = 'Visual Analog Pain & Stiffness Scale (0-10)',
  subtitle = 'Drag the slider to reflect your current physical comfort level.',
  showDescriptor = true,
  className = '',
}) => {
  const descriptor = getVASDescriptor(value);

  const getEmojiIcon = (val: number) => {
    if (val <= 2) return <Smile className="w-5 h-5 text-emerald-600" />;
    if (val <= 5) return <Meh className="w-5 h-5 text-amber-500" />;
    if (val <= 8) return <Frown className="w-5 h-5 text-orange-500" />;
    return <AlertCircle className="w-5 h-5 text-rose-600" />;
  };

  return (
    <div className={`p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 ${className}`}>
      {/* Label and Current Value Badge */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div>
          <label className="text-xs font-bold text-gray-900 font-serif block">
            {label}
          </label>
          {subtitle && (
            <p className="text-[11px] text-gray-500 font-medium">{subtitle}</p>
          )}
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs"
          style={{
            backgroundColor: `${descriptor.color}15`,
            color: descriptor.color,
            border: `1px solid ${descriptor.color}40`,
          }}
        >
          {getEmojiIcon(value)}
          <span>VAS {value} / 10</span>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="mt-4 mb-2">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-700 focus:outline-none"
        />

        {/* Numeric Track Scale Marks */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold px-0.5 mt-1.5">
          <span>0 (None)</span>
          <span>2</span>
          <span>4</span>
          <span>6</span>
          <span>8</span>
          <span>10 (Worst)</span>
        </div>
      </div>

      {/* Verbal Clinical Interpretation */}
      {showDescriptor && (
        <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-start gap-2">
          <div
            className="w-2 h-2 rounded-full mt-1 shrink-0"
            style={{ backgroundColor: descriptor.color }}
          />
          <div>
            <span className="text-xs font-bold text-gray-900 block">
              {descriptor.label}
            </span>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
              {descriptor.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomVASTracker;
