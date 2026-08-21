// src/Therapist/Components/SessionDetailDrawer.tsx
import React from 'react';
import {
  X,
  Clock,
  MapPin,
  Sparkles,
  Package,
  FileText,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { TherapistSession } from '../types/therapist.types';
import { getStatusBadgeConfig } from '../Services/therapistService';
import { PatientContinuityBanner } from './PatientContinuityBanner';

export interface SessionDetailDrawerProps {
  session: TherapistSession | null;
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (session: TherapistSession) => void;
  onResumeSession: (session: TherapistSession) => void;
  onViewNotes: (session: TherapistSession) => void;
}

export const SessionDetailDrawer: React.FC<SessionDetailDrawerProps> = ({
  session,
  isOpen,
  onClose,
  onStartSession,
  onResumeSession,
  onViewNotes,
}) => {
  if (!isOpen || !session) return null;

  const badgeConfig = getStatusBadgeConfig(session.status);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
      />

      {/* Slide-Over Drawer */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-ayur-sand/80 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-ayur-sand/60 bg-[#fbf9f5] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={badgeConfig.variant} size="sm">
                {badgeConfig.label}
              </Badge>
              <span className="text-[10px] font-bold text-ayur-brown bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {session.patientId}
              </span>
            </div>
            <h3 className="font-serif font-black text-gray-900 text-xl leading-tight">
              {session.patientName}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {session.patientAge} yrs • {session.patientGender} • {session.patientContact}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-white transition cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Patient Continuity & Sensitivity Banner */}
          <PatientContinuityBanner
            isSameTherapist={session.isConsecutiveWithSameTherapist}
            sameGenderMatched={session.sameGenderMatched}
            allergyHistory={session.allergyHistory}
            patientName={session.patientName}
          />

          {/* Procedure Meta Overview */}
          <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/80 space-y-3">
            <div className="flex items-center justify-between border-b border-ayur-sand/60 pb-2">
              <span className="text-xs font-bold text-ayur-primary font-serif flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-ayur-brown" />
                {session.stageName} (Day {session.dayNumber}/{session.totalDays})
              </span>
              <span className="text-[11px] font-semibold text-gray-600">
                {session.stageCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-ayur-green-mid" />
                <span>
                  <strong>Time:</strong> {session.scheduledTime} ({session.durationMinutes}m)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-ayur-green-mid" />
                <span className="truncate">
                  <strong>Room:</strong> {session.roomNumber}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 font-medium">
              <strong>Package Protocol:</strong> {session.packageName}
            </p>
          </div>

          {/* Pre & Post Protocol Instructions */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white border border-ayur-sand/70">
              <span className="font-serif font-bold text-gray-900 text-xs block mb-1">
                Pre-Procedure Instructions
              </span>
              <p className="text-gray-600 leading-relaxed font-medium">
                {session.preInstructions}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-ayur-sand/70">
              <span className="font-serif font-bold text-gray-900 text-xs block mb-1">
                Post-Procedure Care & Observation
              </span>
              <p className="text-gray-600 leading-relaxed font-medium">
                {session.postInstructions}
              </p>
            </div>
          </div>

          {/* Formulations & Materials Required */}
          <div className="p-4 rounded-2xl bg-white border border-ayur-sand/70">
            <span className="font-serif font-bold text-gray-900 text-xs block mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-ayur-primary" />
              Stage Required Materials & Inventory Stock
            </span>
            <div className="space-y-2">
              {session.materials.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60 text-xs"
                >
                  <span className="font-semibold text-gray-800">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ayur-primary font-serif">
                      {m.quantityRequired}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.inStock >= m.threshold
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Stock: {m.inStock} {m.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prior Session Notes for Continuity */}
          {session.priorSessionNotes && (
            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/70">
              <span className="font-serif font-bold text-gray-900 text-xs block mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-ayur-primary" />
                Previous Session Notes (Continuity of Care)
              </span>
              <p className="text-gray-700 leading-relaxed font-medium">
                {session.priorSessionNotes}
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-ayur-sand/60 bg-[#fbf9f5] flex items-center justify-between gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>

          {session.status === 'scheduled' && (
            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onStartSession(session);
              }}
            >
              Start Pre-Flight & Session
            </Button>
          )}

          {(session.status === 'in_progress' || session.status === 'paused_emergency') && (
            <Button
              variant="ayur"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onResumeSession(session);
              }}
            >
              Resume Active Workspace
            </Button>
          )}

          {session.status === 'completed' && (
            <Button
              variant="secondary"
              size="md"
              icon={<FileText className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onViewNotes(session);
              }}
            >
              View Full Clinical Notes
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default SessionDetailDrawer;
