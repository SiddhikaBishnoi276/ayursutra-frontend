// src/Therapist/Services/therapistService.ts
// Clinical calculation and formatting utilities for Therapist procedures

import { TherapistSession, StageMaterial } from '../types/therapist.types';

export const formatDurationSeconds = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const checkMaterialsAvailability = (materials: StageMaterial[]): {
  isAllAvailable: boolean;
  shortages: StageMaterial[];
} => {
  if (!materials || materials.length === 0) {
    return { isAllAvailable: true, shortages: [] };
  }

  const shortages = materials.filter((m) => {
    const requiredNum = parseFloat(m.quantityRequired.replace(/[^0-9.]/g, '')) || 0;
    return m.inStock < requiredNum || m.inStock < m.threshold || !m.isAvailable;
  });

  return {
    isAllAvailable: shortages.length === 0,
    shortages,
  };
};

export const getStatusBadgeConfig = (
  status: TherapistSession['status']
): {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'ayur';
  isPulsing?: boolean;
} => {
  switch (status) {
    case 'scheduled':
      return { label: 'Scheduled', variant: 'info' };
    case 'in_progress':
      return { label: 'In Progress', variant: 'ayur', isPulsing: true };
    case 'completed':
      return { label: 'Completed', variant: 'success' };
    case 'flagged':
      return { label: 'Doctor Flagged', variant: 'danger', isPulsing: true };
    case 'paused_emergency':
      return { label: 'Emergency Paused', variant: 'danger', isPulsing: true };
    case 'no_show':
      return { label: 'No Show', variant: 'warning' };
    default:
      return { label: status, variant: 'info' };
  }
};
