// src/Patient/Components/PrecareInstructionsCard.tsx
// Structured pre-procedure instructions card with intuitive iconography

import React from 'react';
import { BellRing, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';

export interface PrecareInstructionsCardProps {
  instructions: string[];
  stageName?: string;
  className?: string;
}

export const PrecareInstructionsCard: React.FC<PrecareInstructionsCardProps> = ({
  instructions,
  stageName = 'Therapy Session',
  className = '',
}) => {
  return (
    <Card className={`border border-amber-200/80 bg-amber-50/40 p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950 font-serif">
              Pre-Care Instructions
            </h4>
            <p className="text-[11px] text-amber-800 font-medium">
              Guidelines to prepare your body for {stageName}
            </p>
          </div>
        </div>

        <Badge variant="warning" size="sm">
          Preparation Protocol
        </Badge>
      </div>

      {/* List */}
      <div className="mt-3.5 space-y-2.5">
        {instructions.map((inst, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/90 border border-amber-200/60 text-xs shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-gray-800 font-medium leading-relaxed">{inst}</span>
          </div>
        ))}
      </div>

      {/* Trust Footnote */}
      <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
        <span>Adhering to pre-care ensures maximum therapeutic absorption and comfort.</span>
      </div>
    </Card>
  );
};

export default PrecareInstructionsCard;
