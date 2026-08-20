// src/Therapist/Pages/ActiveSessionPage.tsx
import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  HeartPulse,
  Package,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ArrowRightLeft,
  RefreshCw,
  Info,
} from 'lucide-react';
import { BackButton } from '../../Common/Components/BackButton';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { LiveSessionTimer } from '../Components/LiveSessionTimer';
import { EmergencyPauseModal } from '../Components/EmergencyPauseModal';
import { ObservationEntryModal } from '../Components/ObservationEntryModal';
import { HandoverPromptModal } from '../Components/HandoverPromptModal';
import { PatientContinuityBanner } from '../Components/PatientContinuityBanner';
import { useActiveSession } from '../Hooks/useActiveSession';
import { TherapistSession, IncidentReportPayload, ObservationPayload } from '../types/therapist.types';

export interface ActiveSessionPageProps {
  session: TherapistSession;
  onBack: () => void;
  onSessionCompleteRedirect: () => void;
}

export const ActiveSessionPage: React.FC<ActiveSessionPageProps> = ({
  session: initialSession,
  onBack,
  onSessionCompleteRedirect,
}) => {
  const {
    session = initialSession,
    heartbeat,
    emergencyPause,
    resumeSession,
    completeSession,
    handoverSession,
    simulateDoctorEdit,
    isLoading,
  } = useActiveSession(initialSession.id);

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [doctorEditBannerDismissed, setDoctorEditBannerDismissed] = useState(false);

  const currentSession = session || initialSession;
  const isEmergencyPaused = currentSession.status === 'paused_emergency';

  // Handle attempt to navigate away mid-session
  const handleAttemptBack = () => {
    if (currentSession.status === 'in_progress') {
      setIsHandoverModalOpen(true);
    } else {
      onBack();
    }
  };

  // Submit Incident Report & freeze
  const handleSubmitIncident = async (incident: IncidentReportPayload) => {
    await emergencyPause(incident);
    setIsEmergencyModalOpen(false);
  };

  // Resume paused emergency session
  const handleResumeSession = async () => {
    await resumeSession();
  };

  // Submit completion & unlock
  const handleSubmitObservation = async (observation: ObservationPayload) => {
    const res = await completeSession(observation);
    setTimeout(() => {
      onSessionCompleteRedirect();
    }, 1200);
    return res;
  };

  // Handover session
  const handleConfirmHandover = async (
    newTherapistId: string,
    newTherapistName: string,
    reason?: string
  ) => {
    await handoverSession(newTherapistId, newTherapistName, reason);
    setIsHandoverModalOpen(false);
    onBack();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      {/* 1. Persistent Sticky Header */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-ayur-sand/80 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Left: Back & Patient Context */}
        <div className="flex items-center gap-3">
          <BackButton onClick={handleAttemptBack} label="Back / Handover" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-gray-900 text-base sm:text-lg">
                {currentSession.patientName}
              </h2>
              <span className="text-[10px] font-bold text-ayur-brown bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {currentSession.patientId}
              </span>
              <Badge
                variant={isEmergencyPaused ? 'danger' : 'ayur'}
                size="sm"
                className={isEmergencyPaused ? 'animate-pulse' : ''}
              >
                {isEmergencyPaused ? 'Emergency Paused' : 'In Progress'}
              </Badge>
            </div>
            <span className="text-xs text-ayur-green-mid font-medium">
              Day {currentSession.dayNumber}/{currentSession.totalDays}: {currentSession.stageName} • {currentSession.roomNumber}
            </span>
          </div>
        </div>

        {/* Right: Urgent Action Controls */}
        <div className="flex items-center gap-3">
          {/* Shift Handover Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
            onClick={() => setIsHandoverModalOpen(true)}
            className="text-xs hidden sm:inline-flex"
          >
            Handover Shift
          </Button>

          {/* 🔴 Emergency Pause Button (Always visible) */}
          {!isEmergencyPaused ? (
            <Button
              variant="danger"
              size="sm"
              icon={<AlertOctagon className="w-4 h-4" />}
              onClick={() => setIsEmergencyModalOpen(true)}
              className="shadow-sm font-serif"
            >
              🔴 Emergency Pause
            </Button>
          ) : (
            <Button
              variant="ayur"
              size="sm"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={handleResumeSession}
              className="shadow-sm font-serif"
            >
              Resume Procedure
            </Button>
          )}

          {/* Mark Complete Trigger */}
          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="w-4 h-4" />}
            disabled={isEmergencyPaused}
            onClick={() => setIsObservationModalOpen(true)}
            className="shadow-sm font-serif"
          >
            Mark Complete →
          </Button>
        </div>
      </div>

      {/* 2. Edge Case Banner: Mid-Session Doctor Edit */}
      {currentSession.doctorModifiedNote && !doctorEditBannerDismissed && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-serif font-bold text-amber-950 text-sm block">
                ⚡ Plan Updated in Real-Time by Doctor ({currentSession.doctorModifiedAt || 'Just now'})
              </span>
              <p className="text-amber-900 font-semibold mt-0.5 leading-relaxed">
                "{currentSession.doctorModifiedNote}"
              </p>
              <span className="text-[11px] text-amber-800 font-medium block mt-1">
                Please review and conform procedure parameters before continuing.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDoctorEditBannerDismissed(true)}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer shrink-0"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Emergency Freeze Alert Banner if in emergency paused status */}
      {isEmergencyPaused && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 flex items-start gap-4 shadow-md animate-in fade-in">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-black text-base text-rose-950">
                Procedure Frozen: Clinical Incident Logged & Doctor Notified
              </h3>
              <Badge variant="danger" size="sm">
                Safety Lock Active
              </Badge>
            </div>
            <p className="text-xs text-rose-900 font-medium mt-1 leading-relaxed">
              {currentSession.doctorAlertMessage ||
                'Adverse symptom registered. Session cannot auto-complete. Awaiting doctor consultation.'}
            </p>
            {currentSession.incidentReport && (
              <div className="mt-3 bg-white/90 p-3 rounded-xl border border-rose-200 text-xs">
                <p>
                  <strong>Reaction:</strong> {currentSession.incidentReport.reactionDescription}
                </p>
                <p className="mt-1">
                  <strong>Action Taken:</strong> {currentSession.incidentReport.actionTaken}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  BP: {currentSession.incidentReport.vitalsAtPause.bloodPressure} • Pulse:{' '}
                  {currentSession.incidentReport.vitalsAtPause.pulseBpm} bpm
                </p>
              </div>
            )}
            <div className="mt-3 flex gap-3">
              <Button variant="secondary" size="sm" onClick={handleResumeSession}>
                Resume Procedure
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsEmergencyModalOpen(true)}
              >
                Update Incident Log
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Client-Side Heartbeat Timer Display */}
      <LiveSessionTimer
        secondsElapsed={heartbeat.secondsElapsed}
        isRunning={heartbeat.isRunning}
        isOnline={heartbeat.isOnline}
        isSyncing={heartbeat.isSyncing}
        targetMinutes={currentSession.durationMinutes}
        onStart={heartbeat.startTimer}
        onPause={heartbeat.pauseTimer}
        onReset={heartbeat.resetTimer}
        onToggleSimulatedOffline={heartbeat.toggleSimulatedOffline}
      />

      {/* Interactive Edge-Case Testing Toolbar (Simulate mid-session edits) */}
      <div className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-ayur-primary font-serif flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Clinical Simulator / Edge-Case Testing:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              simulateDoctorEdit(
                'Doctor Order: Reduce Swedana duration to 15 mins due to elevated room humidity.'
              )
            }
            className="px-2.5 py-1 rounded-lg bg-white border border-ayur-sand/80 text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer shadow-2xs"
          >
            Simulate Mid-Session Doctor Edit
          </button>
          <button
            type="button"
            onClick={heartbeat.toggleSimulatedOffline}
            className="px-2.5 py-1 rounded-lg bg-white border border-ayur-sand/80 text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer shadow-2xs"
          >
            Toggle Network Offline
          </button>
        </div>
      </div>

      {/* 4. Active Procedure Clinical Protocol Instructions & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Pre & Post Protocols */}
        <div className="space-y-4">
          <Card className="border border-ayur-sand/80">
            <h3 className="font-serif font-black text-gray-900 text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ayur-brown" />
              Live Stage Protocol Instructions
            </h3>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="bg-[#fbf9f5] p-3 rounded-xl border border-ayur-sand/60">
                <span className="font-bold text-gray-900 block mb-0.5">
                  Execution Instructions:
                </span>
                <p className="leading-relaxed font-medium">{currentSession.preInstructions}</p>
              </div>

              <div className="bg-[#fbf9f5] p-3 rounded-xl border border-ayur-sand/60">
                <span className="font-bold text-gray-900 block mb-0.5">
                  Post-Procedure Protocol:
                </span>
                <p className="leading-relaxed font-medium">{currentSession.postInstructions}</p>
              </div>
            </div>
          </Card>

          {/* Patient Continuity & Precautions */}
          <PatientContinuityBanner
            isSameTherapist={currentSession.isConsecutiveWithSameTherapist}
            sameGenderMatched={currentSession.sameGenderMatched}
            allergyHistory={currentSession.allergyHistory}
            patientName={currentSession.patientName}
          />
        </div>

        {/* Right: Formulations & Prior Notes */}
        <div className="space-y-4">
          <Card className="border border-ayur-sand/80">
            <h3 className="font-serif font-black text-gray-900 text-sm mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-ayur-primary" />
              Dosage & Formulations In-Chamber
            </h3>
            <div className="space-y-2 text-xs">
              {currentSession.materials.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60"
                >
                  <div>
                    <span className="font-bold text-gray-900 block">{m.name}</span>
                    <span className="text-[10px] text-gray-500">
                      Remaining chamber stock: {m.inStock} {m.unit}
                    </span>
                  </div>
                  <Badge variant="ayur" size="md">
                    {m.quantityRequired}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {currentSession.priorSessionNotes && (
            <Card className="border border-ayur-sand/80 bg-[#fbf9f5]">
              <h3 className="font-serif font-bold text-gray-900 text-xs mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-ayur-primary" />
                Previous Session Clinical Continuity Notes
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {currentSession.priorSessionNotes}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <EmergencyPauseModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        session={currentSession}
        onSubmitIncident={handleSubmitIncident}
        isLoading={isLoading}
      />

      <ObservationEntryModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
        session={currentSession}
        onSubmitObservation={handleSubmitObservation}
        isLoading={isLoading}
      />

      <HandoverPromptModal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        session={currentSession}
        onConfirmHandover={handleConfirmHandover}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ActiveSessionPage;
