// src/Patient/Services/patientService.ts
// Clinical calculation, date formatting, and calendar utility services for Patient Portal

import { Appointment } from '../types/patient.types';

export interface VASImprovementResult {
  text: string;
  variant: 'success' | 'warning' | 'danger' | 'info';
  delta: number;
  status: 'improved' | 'unchanged' | 'worsened' | 'none';
  percentage?: number;
}

/**
 * Calculates VAS score change between pre-session and post-session.
 * Visual Analog Scale ranges from 0 (no pain) to 10 (worst pain).
 * A decrease in score indicates improvement/relief.
 */
export const calculateVASImprovement = (
  before: number | undefined,
  after: number | undefined
): VASImprovementResult => {
  if (before === undefined || after === undefined || isNaN(before) || isNaN(after)) {
    return {
      text: 'VAS Not Recorded',
      variant: 'info',
      delta: 0,
      status: 'none',
    };
  }

  const delta = after - before;

  if (delta < 0) {
    // Score decreased = clinical improvement
    const reliefPts = Math.abs(delta);
    const reliefPct = before > 0 ? Math.round((reliefPts / before) * 100) : 100;
    return {
      text: `${reliefPct}% Pain Relief (-${reliefPts} pts)`,
      variant: 'success',
      delta,
      percentage: reliefPct,
      status: 'improved',
    };
  } else if (delta === 0) {
    return {
      text: 'Pain Level Stable (No Change)',
      variant: 'warning',
      delta: 0,
      status: 'unchanged',
    };
  } else {
    // Score increased = symptom exacerbation / heightened sensitivity
    return {
      text: `Symptom Score +${delta} pts`,
      variant: 'danger',
      delta,
      status: 'worsened',
    };
  }
};

/**
 * Formats standard ISO or YYYY-MM-DD date string to a human-friendly format
 */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

/**
 * Calculates overall treatment completion progress percentage
 */
export const calculateOverallProgress = (completed: number, total: number): number => {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
};

/**
 * Maps appointment status to badge variants
 */
export const getAppointmentStatusBadge = (
  status: Appointment['status']
): {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'ayur';
} => {
  switch (status) {
    case 'upcoming':
      return { label: 'Upcoming', variant: 'info' };
    case 'completed':
      return { label: 'Completed', variant: 'success' };
    case 'cancelled':
      return { label: 'Cancelled', variant: 'danger' };
    case 'missed':
      return { label: 'Missed', variant: 'warning' };
    default:
      return { label: status, variant: 'info' };
  }
};

/**
 * Generates and triggers browser download of an .ics calendar file for an appointment
 */
export const generateCalendarIcs = (appointment: Appointment): void => {
  try {
    const parseDateTime = (dateStr: string, timeStr: string): Date => {
      const d = new Date(dateStr);
      // parse "10:00 AM" or "09:30 AM"
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        d.setHours(hours, minutes, 0, 0);
      }
      return d;
    };

    const startDate = parseDateTime(appointment.date, appointment.time);
    const durationMins = appointment.durationMinutes || 60;
    const endDate = new Date(startDate.getTime() + durationMins * 60 * 1000);

    const toIcsFormat = (d: Date): string => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AyurSutra Wellness//Patient Appointment//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:ayursutra-apt-${appointment.id}@ayursutra.com`,
      `DTSTAMP:${toIcsFormat(new Date())}`,
      `DTSTART:${toIcsFormat(startDate)}`,
      `DTEND:${toIcsFormat(endDate)}`,
      `SUMMARY:AyurSutra: ${appointment.stageName}`,
      `DESCRIPTION:Panchakarma Procedure with ${appointment.therapistName} in ${appointment.roomNumber}. Duration: ${appointment.durationMinutes} mins.`,
      `LOCATION:AyurSutra Wellness Clinic, ${appointment.roomNumber}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Upcoming AyurSutra Therapy Session in 1 hour',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `ayursutra-${appointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to generate calendar event:', error);
  }
};
