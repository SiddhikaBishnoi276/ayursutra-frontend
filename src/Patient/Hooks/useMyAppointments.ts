// src/Patient/Hooks/useMyAppointments.ts
// Custom hook for managing patient appointments, status bucketing, and nearest next session

import { useMemo } from 'react';
import { useGetMyAppointmentsQuery } from '../apis/patientApi';
import { Appointment } from '../types/patient.types';

const parseDateTimeToEpoch = (dateStr: string, timeStr: string): number => {
  try {
    const d = new Date(dateStr);
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      d.setHours(hours, minutes, 0, 0);
    }
    return d.getTime();
  } catch {
    return 0;
  }
};

export const useMyAppointments = (patientId?: string) => {
  const effectivePatientId =
    patientId && patientId !== 'PT-104' && patientId !== 'default'
      ? patientId
      : localStorage.getItem('userId') || '';

  const { data: appointments = [], isLoading, error, refetch } = useGetMyAppointmentsQuery(effectivePatientId);

  const bucketed = useMemo(() => {
    const upcoming: Appointment[] = [];
    const completed: Appointment[] = [];
    const cancelled: Appointment[] = [];

    appointments.forEach((apt) => {
      if (apt.status === 'upcoming' || apt.status === 'in_progress') {
        upcoming.push(apt);
      } else if (apt.status === 'completed') {
        completed.push(apt);
      } else if (apt.status === 'cancelled' || apt.status === 'missed') {
        cancelled.push(apt);
      }
    });

    // Chronologically sort upcoming appointments (in_progress first, then nearest date/time)
    upcoming.sort((a, b) => {
      if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
      if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
      const timeA = parseDateTimeToEpoch(a.date, a.time);
      const timeB = parseDateTimeToEpoch(b.date, b.time);
      return timeA - timeB;
    });

    // Sort completed appointments in reverse chronological order (most recent first)
    completed.sort((a, b) => {
      const timeA = parseDateTimeToEpoch(a.date, a.time);
      const timeB = parseDateTimeToEpoch(b.date, b.time);
      return timeB - timeA;
    });

    // Sort cancelled appointments (most recent first)
    cancelled.sort((a, b) => {
      const timeA = parseDateTimeToEpoch(a.date, a.time);
      const timeB = parseDateTimeToEpoch(b.date, b.time);
      return timeB - timeA;
    });

    // Nearest active / upcoming session
    const nextSession = upcoming.length > 0 ? upcoming[0] : null;

    // Completed sessions pending patient feedback
    const pendingFeedbackSessions = completed.filter((apt) => !apt.feedbackSubmitted);

    return {
      upcoming,
      completed,
      cancelled,
      nextSession,
      pendingFeedbackSessions,
      totalCount: appointments.length,
    };
  }, [appointments]);

  return {
    appointments,
    isLoading,
    error,
    refetch,
    ...bucketed,
  };
};
