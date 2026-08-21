// src/Patient/Components/AppointmentHistoryCard.tsx
// Card for completed sessions displaying simplified therapist summary, VAS score, and instant feedback trigger

import React from 'react';
import { CheckCircle2, MessageSquare, Star, User, MapPin, Activity } from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Appointment } from '../types/patient.types';
import { formatDate, calculateVASImprovement } from '../Services/patientService';

export interface AppointmentHistoryCardProps {
  appointment: Appointment;
  onGiveFeedback?: (appointment: Appointment) => void;
  className?: string;
}

export const AppointmentHistoryCard: React.FC<AppointmentHistoryCardProps> = ({
  appointment,
  onGiveFeedback,
  className = '',
}) => {
  const vasResult = calculateVASImprovement(
    appointment.vasScoreBefore,
    appointment.vasScoreAfter
  );

  return (
    <Card className={`border border-ayur-sand/60 p-4 sm:p-5 hover:border-ayur-green-mid/40 transition-all ${className}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ayur-brown">
              Day {appointment.dayNumber} • {appointment.stageCategory}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 font-medium">
              {formatDate(appointment.date)} at {appointment.time}
            </span>
          </div>
          <h4 className="text-base font-bold text-gray-900 font-serif mt-0.5">
            {appointment.stageName}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3 text-emerald-700" />}>
            Completed
          </Badge>
        </div>
      </div>

      {/* Details Row: Therapist & Room */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-3">
        <div className="flex items-center gap-1.5 font-medium">
          <User className="w-3.5 h-3.5 text-purple-700" />
          <span>Therapist: <strong className="text-gray-900">{appointment.therapistName}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <MapPin className="w-3.5 h-3.5 text-purple-700" />
          <span>{appointment.roomNumber}</span>
        </div>
      </div>

      {/* Simplified Therapist Notes Summary */}
      {appointment.therapistNotesSummary && (
        <div className="mt-3 p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/50 text-xs">
          <span className="font-bold text-gray-900 font-serif block mb-0.5">
            Therapist Session Notes:
          </span>
          <p className="text-gray-700 leading-relaxed text-[11px]">
            {appointment.therapistNotesSummary}
          </p>
        </div>
      )}

      {/* VAS Pain Relief & Feedback Action Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        {/* VAS Relief Badge */}
        <div className="flex items-center gap-2">
          {appointment.vasScoreBefore !== undefined && appointment.vasScoreAfter !== undefined ? (
            <Badge
              variant={vasResult.variant}
              size="md"
              icon={<Activity className="w-3.5 h-3.5" />}
            >
              {vasResult.text} (VAS {appointment.vasScoreBefore} → {appointment.vasScoreAfter})
            </Badge>
          ) : (
            <span className="text-xs text-gray-400 font-medium">VAS not recorded</span>
          )}
        </div>

        {/* Feedback Button or Submitted Tag */}
        <div>
          {appointment.feedbackSubmitted ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold shadow-2xs">
              <Star className="w-3.5 h-3.5 text-purple-700 fill-purple-700" />
              <span>Feedback Submitted ✓</span>
              {appointment.feedbackRating && (
                <span className="text-[11px] text-purple-700 font-bold">
                  ({appointment.feedbackRating}/5)
                </span>
              )}
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onGiveFeedback?.(appointment)}
              icon={<MessageSquare className="w-3.5 h-3.5 text-purple-700" />}
              className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 font-bold"
            >
              Give Session Feedback
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentHistoryCard;
