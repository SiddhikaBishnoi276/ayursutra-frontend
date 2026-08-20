// src/Therapist/Components/SessionQueueCard.tsx
import React from 'react';
import {
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Play,
  RotateCcw,
  AlertCircle,
  FileText,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { TherapistSession } from '../types/therapist.types';
import { getStatusBadgeConfig } from '../Services/therapistService';

export interface SessionQueueCardProps {
  session: TherapistSession;
  onSelect: (session: TherapistSession) => void;
  onStartSession: (session: TherapistSession) => void;
  onResumeSession: (session: TherapistSession) => void;
  onViewAlert: (session: TherapistSession) => void;
  onViewNotes: (session: TherapistSession) => void;
}

export const SessionQueueCard: React.FC<SessionQueueCardProps> = ({
  session,
  onSelect,
  onStartSession,
  onResumeSession,
  onViewAlert,
  onViewNotes,
}) => {
  const badgeConfig = getStatusBadgeConfig(session.status);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    switch (session.status) {
      case 'scheduled':
        onStartSession(session);
        break;
      case 'in_progress':
      case 'paused_emergency':
        onResumeSession(session);
        break;
      case 'flagged':
        onViewAlert(session);
        break;
      case 'completed':
        onViewNotes(session);
        break;
      default:
        onSelect(session);
    }
  };

  return (
    <Card
      onClick={() => onSelect(session)}
      hoverable
      className="group transition-all duration-200 hover:border-ayur-green-mid/50 border border-ayur-sand/80"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Time, Patient Info & Stage */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Time Badge Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#fbf9f5] border border-ayur-sand/70 p-3 min-w-[5.5rem] shrink-0 text-center">
            <span className="text-xs font-black text-ayur-primary font-serif flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-ayur-green-mid" />
              {session.scheduledTime}
            </span>
            <span className="text-[10px] font-bold text-gray-500 mt-1">
              {session.durationMinutes} mins
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-serif font-black text-gray-900 text-base group-hover:text-ayur-primary transition-colors truncate">
                {session.patientName}
              </h3>
              <span className="text-xs font-medium text-gray-500">
                ({session.patientAge}y, {session.patientGender})
              </span>
              <span className="text-[10px] font-bold text-ayur-brown bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {session.patientId}
              </span>
              {session.sameGenderMatched && (
                <Badge
                  variant="success"
                  size="sm"
                  icon={<ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />}
                  className="hidden sm:inline-flex"
                >
                  Gender Matched
                </Badge>
              )}
            </div>

            {/* Stage and Procedure */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-700 mt-0.5">
              <span className="font-bold text-ayur-primary flex items-center gap-1 font-serif">
                <Sparkles className="w-3.5 h-3.5 text-ayur-brown" />
                Day {session.dayNumber}/{session.totalDays}: {session.stageName}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 truncate max-w-xs">{session.packageName}</span>
            </div>

            {/* Room Location */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <MapPin className="w-3.5 h-3.5 text-ayur-green-mid shrink-0" />
              <span className="truncate">{session.roomNumber}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Status Pill & Contextual Action Button */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
          {/* Status Badge with Pulsing Red Dot for Flagged/Paused */}
          <div className="flex items-center gap-2">
            {badgeConfig.isPulsing && (
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    session.status === 'flagged' || session.status === 'paused_emergency'
                      ? 'bg-rose-400'
                      : 'bg-emerald-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    session.status === 'flagged' || session.status === 'paused_emergency'
                      ? 'bg-rose-600'
                      : 'bg-emerald-600'
                  }`}
                ></span>
              </span>
            )}
            <Badge variant={badgeConfig.variant} size="md">
              {badgeConfig.label}
            </Badge>
          </div>

          {/* Contextual Action Button */}
          {session.status === 'scheduled' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={handleActionClick}
            >
              Start Session
            </Button>
          )}

          {session.status === 'in_progress' && (
            <Button
              variant="ayur"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleActionClick}
            >
              Resume / Complete
            </Button>
          )}

          {session.status === 'paused_emergency' && (
            <Button
              variant="danger"
              size="sm"
              icon={<AlertCircle className="w-3.5 h-3.5" />}
              onClick={handleActionClick}
            >
              Review Incident
            </Button>
          )}

          {session.status === 'flagged' && (
            <Button
              variant="danger"
              size="sm"
              icon={<AlertCircle className="w-3.5 h-3.5" />}
              onClick={handleActionClick}
            >
              View Alert
            </Button>
          )}

          {session.status === 'completed' && (
            <Button
              variant="secondary"
              size="sm"
              icon={<FileText className="w-3.5 h-3.5" />}
              onClick={handleActionClick}
            >
              View Notes
            </Button>
          )}

          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-ayur-primary transition-transform group-hover:translate-x-0.5 hidden sm:block" />
        </div>
      </div>
    </Card>
  );
};

export default SessionQueueCard;
