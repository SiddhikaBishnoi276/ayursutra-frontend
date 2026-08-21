// src/Patient/Components/UpcomingSessionCard.tsx
// Featured Spotlight Card for the chronologically nearest upcoming therapy session

import React from 'react';
import { Calendar, Clock, MapPin, User, Download, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Appointment } from '../types/patient.types';
import { formatDate, generateCalendarIcs } from '../Services/patientService';

export interface UpcomingSessionCardProps {
  session: Appointment | null;
  onViewDetails?: (session: Appointment) => void;
  className?: string;
}

export const UpcomingSessionCard: React.FC<UpcomingSessionCardProps> = ({
  session,
  onViewDetails,
  className = '',
}) => {
  if (!session) {
    return (
      <Card className={`border border-ayur-sand/60 bg-white p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-gray-900 font-serif">
            No Upcoming Sessions Scheduled
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            You have completed all active sessions in this protocol stage. Your doctor will review your next course of treatment.
          </p>
        </div>
      </Card>
    );
  }

  const handleDownloadCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateCalendarIcs(session);
  };

  return (
    <Card className={`border-2 border-purple-200/80 bg-gradient-to-br from-white via-[#fbf9f5] to-purple-50/20 p-5 sm:p-6 shadow-sm ${className}`}>
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            Next Scheduled Session
          </span>
          <Badge variant="ayur" size="sm">
            Day {session.dayNumber} of {session.totalDays}
          </Badge>
        </div>

        <span className="text-xs font-semibold text-gray-500">
          {session.stageCategory}
        </span>
      </div>

      {/* Session Title & Info */}
      <div className="mt-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif leading-tight">
          {session.stageName}
        </h3>
      </div>

      {/* Quick Details Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Date */}
        <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium mb-1">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            <span>Date</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {formatDate(session.date)}
          </p>
        </div>

        {/* Time */}
        <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-purple-700" />
            <span>Time</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {session.time}
          </p>
        </div>

        {/* Chamber */}
        <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-purple-700" />
            <span>Location</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {session.roomNumber}
          </p>
        </div>

        {/* Therapist */}
        <div className="p-3 bg-white rounded-xl border border-stone-200/70 shadow-2xs">
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium mb-1">
            <User className="w-3.5 h-3.5 text-purple-700" />
            <span>Therapist</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
            {session.therapistName}
          </p>
        </div>
      </div>

      {/* Pre-Care Preparation Checklist Preview */}
      {session.preCareNotes && session.preCareNotes.length > 0 && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
          <span className="font-bold text-amber-900 font-serif block mb-1.5">
            Pre-Procedure Checklist for Today:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-amber-800 font-medium">
            {session.preCareNotes.map((note, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-gray-500 font-medium">
          Duration: <span className="font-bold text-gray-800">{session.durationMinutes} mins</span>
        </span>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadCalendar}
            icon={<Download className="w-3.5 h-3.5 text-purple-700" />}
            className="hover:border-purple-300"
          >
            Add to Calendar (.ics)
          </Button>

          {onViewDetails && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewDetails(session)}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Session Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UpcomingSessionCard;
