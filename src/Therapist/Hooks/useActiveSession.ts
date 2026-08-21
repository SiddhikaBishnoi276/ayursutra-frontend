// src/Therapist/Hooks/useActiveSession.ts
// Single Source of Truth for live active session state across the Therapist Portal
import { useState, useEffect, useCallback } from 'react';
import {
  useGetSessionDetailQuery,
  useStartSessionMutation,
  useEmergencyPauseSessionMutation,
  useResumeSessionMutation,
  useCompleteSessionMutation,
  useHandoverSessionMutation,
  useSimulateDoctorMidSessionEditMutation,
} from '../apis/therapistApi';
import {
  IncidentReportPayload,
  ObservationPayload,
} from '../types/therapist.types';
import { useOfflineHeartbeat } from './useOfflineHeartbeat';

// Central in-memory state store to maintain synchronization across components
let globalActiveSessionId: string | null = null;
const listeners = new Set<(sessionId: string | null) => void>();

export const setActiveSessionIdGlobal = (id: string | null) => {
  globalActiveSessionId = id;
  listeners.forEach((listener) => listener(id));
  if (id) {
    sessionStorage.setItem('ayursutra_active_session_id', id);
  } else {
    sessionStorage.removeItem('ayursutra_active_session_id');
  }
};

export const getActiveSessionIdGlobal = (): string | null => {
  if (!globalActiveSessionId && typeof sessionStorage !== 'undefined') {
    globalActiveSessionId = sessionStorage.getItem('ayursutra_active_session_id');
  }
  return globalActiveSessionId;
};

export const useActiveSession = (explicitSessionId?: string) => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    explicitSessionId || getActiveSessionIdGlobal()
  );

  useEffect(() => {
    if (explicitSessionId) {
      setActiveSessionIdGlobal(explicitSessionId);
      setCurrentSessionId(explicitSessionId);
    }
  }, [explicitSessionId]);

  useEffect(() => {
    const handleSync = (id: string | null) => {
      if (!explicitSessionId) {
        setCurrentSessionId(id);
      }
    };
    listeners.add(handleSync);
    return () => {
      listeners.delete(handleSync);
    };
  }, [explicitSessionId]);

  const targetId = explicitSessionId || currentSessionId || '';
  const { data: session = null, isLoading, refetch } = useGetSessionDetailQuery(targetId, {
    skip: !targetId,
  });

  const [startSessionMutation, { isLoading: isStarting }] = useStartSessionMutation();
  const [emergencyPauseMutation, { isLoading: isPausing }] = useEmergencyPauseSessionMutation();
  const [resumeMutation, { isLoading: isResuming }] = useResumeSessionMutation();
  const [completeMutation, { isLoading: isCompleting }] = useCompleteSessionMutation();
  const [handoverMutation, { isLoading: isHandingOver }] = useHandoverSessionMutation();
  const [simulateDoctorEditMutation] = useSimulateDoctorMidSessionEditMutation();

  const isSessionRunning = session?.status === 'in_progress';
  const initialSeconds = session?.elapsedSeconds || 0;

  const heartbeat = useOfflineHeartbeat(initialSeconds, isSessionRunning, session?.id);

  // Auto-start heartbeat if session is in_progress
  useEffect(() => {
    if (session?.status === 'in_progress' && !heartbeat.isRunning) {
      heartbeat.startTimer();
    } else if (session?.status !== 'in_progress' && heartbeat.isRunning) {
      heartbeat.pauseTimer();
    }
  }, [session?.status]);

  // Actions
  const handleStart = useCallback(async () => {
    if (!targetId) return;
    try {
      const res = await startSessionMutation({ sessionId: targetId }).unwrap();
      setActiveSessionIdGlobal(res.id);
      heartbeat.startTimer();
      return res;
    } catch (err) {
      console.error('Failed to start session:', err);
      throw err;
    }
  }, [targetId, startSessionMutation, heartbeat]);

  const handleEmergencyPause = useCallback(
    async (incident: IncidentReportPayload) => {
      if (!targetId) return;
      try {
        heartbeat.pauseTimer();
        const res = await emergencyPauseMutation({
          sessionId: targetId,
          incidentReport: incident,
        }).unwrap();
        return res;
      } catch (err) {
        console.error('Failed to pause session for emergency:', err);
        throw err;
      }
    },
    [targetId, emergencyPauseMutation, heartbeat]
  );

  const handleResume = useCallback(async () => {
    if (!targetId) return;
    try {
      const res = await resumeMutation({ sessionId: targetId }).unwrap();
      heartbeat.startTimer();
      return res;
    } catch (err) {
      console.error('Failed to resume session:', err);
      throw err;
    }
  }, [targetId, resumeMutation, heartbeat]);

  const handleComplete = useCallback(
    async (observation: ObservationPayload) => {
      if (!targetId) return;
      try {
        heartbeat.pauseTimer();
        const res = await completeMutation({
          sessionId: targetId,
          observation,
        }).unwrap();
        setActiveSessionIdGlobal(null);
        return res;
      } catch (err) {
        console.error('Failed to complete session:', err);
        throw err;
      }
    },
    [targetId, completeMutation, heartbeat]
  );

  const handleHandover = useCallback(
    async (newTherapistId: string, newTherapistName: string, reason?: string) => {
      if (!targetId) return;
      try {
        heartbeat.pauseTimer();
        const res = await handoverMutation({
          sessionId: targetId,
          newTherapistId,
          newTherapistName,
          reason,
        }).unwrap();
        setActiveSessionIdGlobal(null);
        return res;
      } catch (err) {
        console.error('Failed to handover session:', err);
        throw err;
      }
    },
    [targetId, handoverMutation, heartbeat]
  );

  const handleSimulateDoctorEdit = useCallback(
    async (instructionUpdate: string) => {
      if (!targetId) return;
      try {
        return await simulateDoctorEditMutation({
          sessionId: targetId,
          instructionUpdate,
        }).unwrap();
      } catch (err) {
        console.error('Failed to simulate doctor edit:', err);
      }
    },
    [targetId, simulateDoctorEditMutation]
  );

  return {
    session,
    sessionId: targetId,
    setActiveSessionId: setActiveSessionIdGlobal,
    isLoading: isLoading || isStarting || isPausing || isResuming || isCompleting || isHandingOver,
    heartbeat,
    startSession: handleStart,
    emergencyPause: handleEmergencyPause,
    resumeSession: handleResume,
    completeSession: handleComplete,
    handoverSession: handleHandover,
    simulateDoctorEdit: handleSimulateDoctorEdit,
    refetch,
  };
};
