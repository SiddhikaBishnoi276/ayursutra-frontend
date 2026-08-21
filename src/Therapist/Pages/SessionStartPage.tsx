// src/Therapist/Pages/SessionStartPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  PackageX,
  Sparkles,
  MapPin,
  ShieldCheck,
  AlertOctagon,
} from 'lucide-react';
import { BackButton } from '../../Common/Components/BackButton';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { PreFlightChecklist } from '../Components/PreFlightChecklist';
import { PatientContinuityBanner } from '../Components/PatientContinuityBanner';
import { usePreFlightCheck } from '../Hooks/usePreFlightCheck';
import { useActiveSession } from '../Hooks/useActiveSession';
import { useGetSessionDetailQuery } from '../apis/therapistApi';
import { TherapistSession } from '../types/therapist.types';

export interface SessionStartPageProps {
  session?: TherapistSession;
  onBack?: () => void;
  onStartSuccess?: (session: TherapistSession) => void;
  onStartSession?: () => Promise<any>;
  isLoading?: boolean;
}

export const SessionStartPage: React.FC<SessionStartPageProps> = ({
  session: propSession,
  onBack,
  onStartSuccess,
  onStartSession,
  isLoading: propIsLoading = false,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: fetchedSession, isLoading: isFetching } = useGetSessionDetailQuery(
    sessionId || propSession?.id || '',
    { skip: !!propSession || !sessionId }
  );

  const activeSessionHook = useActiveSession(sessionId || propSession?.id);

  const session = propSession || fetchedSession;

  const {
    checklist,
    toggleCheck,
    setAllChecks,
    materialsCheck,
    hasInventoryShortage,
    isReadyToStart,
  } = usePreFlightCheck(session || null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/therapist/queue');
    }
  };

  const handleStart = async () => {
    if (!isReadyToStart || !session) return;
    setErrorMsg(null);
    try {
      let res;
      if (onStartSession) {
        res = await onStartSession();
      } else {
        res = await activeSessionHook.startSession();
      }

      if (onStartSuccess) {
        onStartSuccess(res || session);
      } else {
        navigate(`/therapist/session/${res?.id || session.id}/active`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to start session. Please retry.');
    }
  };

  if (isFetching || !session) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-gray-500 font-serif">
        Loading session pre-flight checklist...
      </div>
    );
  }

  const isLoading = propIsLoading || activeSessionHook.isLoading;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Top Header with Universal Back Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} label="Back to Queue" />
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-gray-900 tracking-tight">
              Pre-Session Safety & Protocol Validation
            </h1>
            <p className="text-xs text-ayur-green-mid font-medium">
              Chamber entry clearance for {session.patientName} ({session.patientId})
            </p>
          </div>
        </div>

        <Badge variant="ayur" size="md">
          Chamber Check
        </Badge>
      </div>

      {/* Patient & Stage Summary Header Card */}
      <Card className="border border-ayur-sand/80 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-ayur-primary font-serif font-black text-base shrink-0">
              {session.patientName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif font-black text-gray-900 text-lg">
                  {session.patientName}
                </h2>
                <span className="text-xs font-semibold text-gray-500">
                  ({session.patientAge} yrs, {session.patientGender})
                </span>
                <span className="text-[10px] font-bold text-ayur-brown bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {session.patientId}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium">
                <span className="font-bold text-ayur-primary flex items-center gap-1 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-ayur-brown" />
                  Day {session.dayNumber}/{session.totalDays}: {session.stageName} ({session.stageCategory})
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-ayur-green-mid" />
                  {session.roomNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-center">
            <span className="text-xs font-bold text-ayur-green-mid uppercase">Scheduled Time</span>
            <span className="text-base font-serif font-black text-gray-900">
              {session.scheduledTime} ({session.durationMinutes} mins)
            </span>
          </div>
        </div>
      </Card>

      {/* Continuity & Allergy Banner */}
      <PatientContinuityBanner
        isSameTherapist={session.isConsecutiveWithSameTherapist}
        sameGenderMatched={session.sameGenderMatched}
        allergyHistory={session.allergyHistory}
        patientName={session.patientName}
      />

      {/* Interactive Pre-Flight Checklist */}
      <PreFlightChecklist
        session={session}
        checklist={checklist}
        onToggleCheck={toggleCheck}
        onSetAllChecks={setAllChecks}
        hasInventoryShortage={hasInventoryShortage}
        shortages={materialsCheck.shortages}
      />

      {/* Error Message if any */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Bottom Sticky Action Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-ayur-sand/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-gray-600 font-medium">
          {hasInventoryShortage ? (
            <span className="text-rose-700 font-bold flex items-center gap-1.5">
              <PackageX className="w-4 h-4 text-rose-600" />
              Chamber stock shortage. Request replenishment from Pharmacy / Admin before starting.
            </span>
          ) : isReadyToStart ? (
            <span className="text-emerald-800 font-bold flex items-center gap-1.5 font-serif">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              All pre-flight safety criteria satisfied. Ready for live procedure ignition.
            </span>
          ) : (
            <span className="text-amber-800 font-medium">
              Complete all checklist items above to enable procedure start.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="secondary" size="md" onClick={handleBack}>
            Cancel
          </Button>

          {hasInventoryShortage ? (
            <Button
              variant="danger"
              size="md"
              icon={<PackageX className="w-4 h-4" />}
              disabled
              className="font-serif"
            >
              Restock Needed
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4" />}
              disabled={!isReadyToStart || isLoading}
              onClick={handleStart}
              className="font-serif shadow-sm"
            >
              {isLoading ? 'Starting Workspace…' : 'Start Session →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionStartPage;
