// src/Therapist/Components/PatientContinuityBanner.tsx
import React from 'react';
import { ShieldCheck, AlertTriangle, UserCheck, HeartHandshake } from 'lucide-react';
import { Badge } from '../../Common/Components/Badge';

export interface PatientContinuityBannerProps {
  isSameTherapist?: boolean;
  sameGenderMatched?: boolean;
  allergyHistory?: string[];
  patientName?: string;
  className?: string;
}

export const PatientContinuityBanner: React.FC<PatientContinuityBannerProps> = ({
  isSameTherapist = true,
  sameGenderMatched = true,
  allergyHistory = [],
  patientName = 'Patient',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {/* Continuity & Gender Match Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100/80 text-ayur-primary shrink-0">
            <HeartHandshake className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-bold text-gray-900 font-serif block">
              {isSameTherapist
                ? 'Therapeutic Continuity Confirmed'
                : 'Assigned Clinical Handover'}
            </span>
            <span className="text-[11px] text-ayur-green-mid font-medium">
              {isSameTherapist
                ? `You conducted the previous session with ${patientName}.`
                : `Cross-therapist rotation verified per protocol.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSameTherapist && (
            <Badge variant="ayur" size="sm" icon={<UserCheck className="w-3 h-3 text-ayur-brown" />}>
              Same Therapist
            </Badge>
          )}
          {sameGenderMatched && (
            <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-700" />}>
              Gender Matched
            </Badge>
          )}
        </div>
      </div>

      {/* Allergy / Clinical Sensitivity Alerts if present */}
      {allergyHistory && allergyHistory.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-900 font-serif block">
              Clinical Sensitivities & Precautions:
            </span>
            <ul className="list-disc list-inside text-[11px] text-amber-800 font-medium mt-1 space-y-0.5">
              {allergyHistory.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientContinuityBanner;
