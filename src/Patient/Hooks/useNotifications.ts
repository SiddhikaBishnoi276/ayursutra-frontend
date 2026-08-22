// src/Patient/Hooks/useNotifications.ts
// Custom hook for managing patient notifications, appointment reminders, and persistent doctor plan update alerts

import { useState, useEffect, useMemo } from 'react';
import { PatientNotification } from '../types/patient.types';
import { useMyTherapyPlan } from './useMyTherapyPlan';
import { useMyAppointments } from './useMyAppointments';

const DISMISSED_NOTIFICATIONS_KEY = 'ayursutra_dismissed_notifications_patient';

export const useNotifications = (patientId?: string) => {
  const effectivePatientId =
    patientId && patientId !== 'PT-104' && patientId !== 'default'
      ? patientId
      : localStorage.getItem('userId') || '';

  const { plan, isDoctorUpdateVisible } = useMyTherapyPlan(effectivePatientId);
  const { nextSession, pendingFeedbackSessions } = useMyAppointments(effectivePatientId);

  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DISMISSED_NOTIFICATIONS_KEY, JSON.stringify(dismissedIds));
    } catch (e) {
      console.warn('Failed to save dismissed notification IDs', e);
    }
  }, [dismissedIds]);

  const rawNotifications: PatientNotification[] = useMemo(() => {
    const list: PatientNotification[] = [];

    // 1. Doctor Plan Update Notification
    if (plan?.isPlanUpdatedByDoctor && isDoctorUpdateVisible) {
      list.push({
        id: `notif-doc-update-${plan.doctorPlanLastUpdated || '1'}`,
        title: 'Treatment Protocol Updated by Doctor',
        message: `Dr. ${plan.doctorName} modified your protocol: "${plan.doctorUpdateNote || 'Review updated instructions.'}"`,
        time: 'Today, 02:30 PM',
        type: 'doctor_update',
        read: false,
        actionUrl: '/patient/therapy-plan',
        updateId: plan.doctorPlanLastUpdated,
      });
    }

    // 2. Upcoming Session Reminder
    if (nextSession) {
      list.push({
        id: `notif-next-${nextSession.id}`,
        title: `Upcoming Therapy: ${nextSession.stageName}`,
        message: `Scheduled today at ${nextSession.time} in ${nextSession.roomNumber} with ${nextSession.therapistName}. Please arrive 15 minutes early.`,
        time: 'Upcoming Soon',
        type: 'reminder',
        read: false,
        actionUrl: '/patient/appointments',
      });
    }

    // 3. Pending Feedback Prompt
    if (pendingFeedbackSessions.length > 0) {
      const target = pendingFeedbackSessions[0];
      list.push({
        id: `notif-feedback-${target.id}`,
        title: 'Post-Session Feedback Requested',
        message: `How was your "${target.stageName}" session with ${target.therapistName}? Your feedback helps personalize your care.`,
        time: 'Yesterday',
        type: 'feedback_prompt',
        read: false,
        actionUrl: '/patient/feedback',
      });
    }

    // 4. Diet & Hydration Reminder
    list.push({
      id: 'notif-diet-routine',
      title: 'Midday Satvik Hydration Reminder',
      message: 'Remember to sip warm cumin-ginger water. Avoid cold drinks or raw salads.',
      time: '1 hour ago',
      type: 'reminder',
      read: true,
      actionUrl: '/patient/therapy-plan',
    });

    return list;
  }, [plan, isDoctorUpdateVisible, nextSession, pendingFeedbackSessions]);

  // Filter out dismissed items
  const notifications = useMemo(() => {
    return rawNotifications.filter((n) => !dismissedIds.includes(n.id));
  }, [rawNotifications, dismissedIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const dismissNotification = (id: string) => {
    setDismissedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAsRead = (_id: string) => {
    // Read state is transient/prototype
  };

  return {
    notifications,
    unreadCount,
    dismissNotification,
    markAsRead,
  };
};
