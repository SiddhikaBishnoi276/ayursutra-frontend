// src/Patient/Components/PostcareInstructionsCard.tsx
// Post-procedure rest, diet, and recovery care instructions card

import React from 'react';
import { ShieldCheck, HeartHandshake, Moon } from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';

export interface PostcareInstructionsCardProps {
  instructions: string[];
  stageName?: string;
  className?: string;
}

export const PostcareInstructionsCard: React.FC<PostcareInstructionsCardProps> = ({
  instructions,
  stageName = 'Therapy Session',
  className = '',
}) => {
  return (
    <Card className={`border border-emerald-200/80 bg-emerald-50/40 p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950 font-serif">
              Post-Care & Integration
            </h4>
            <p className="text-[11px] text-emerald-800 font-medium">
              Care measures following {stageName}
            </p>
          </div>
        </div>

        <Badge variant="success" size="sm">
          Recovery Protocol
        </Badge>
      </div>

      {/* List */}
      <div className="mt-3.5 space-y-2.5">
        {instructions.map((inst, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/90 border border-emerald-200/60 text-xs shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-gray-800 font-medium leading-relaxed">{inst}</span>
          </div>
        ))}
      </div>

      {/* Rest note */}
      <div className="mt-3 pt-3 border-t border-emerald-200/50 flex items-center gap-1.5 text-[11px] text-emerald-900 font-medium">
        <Moon className="w-3.5 h-3.5 text-emerald-700" />
        <span>Rest and warmth permit deeper tissue settling and enhance detox benefits.</span>
      </div>
    </Card>
  );
};

export default PostcareInstructionsCard;
