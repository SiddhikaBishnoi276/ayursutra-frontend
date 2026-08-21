// src/Therapist/types/therapist.types.ts
// Comprehensive TypeScript interfaces and types for AyurSutra Therapist Panel

export type SessionStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'flagged'
  | 'no_show'
  | 'paused_emergency';

export type StageCategory = 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';

export interface StageMaterial {
  id: string;
  name: string;
  quantityRequired: string;
  inStock: number;
  unit: string;
  threshold: number;
  isAvailable: boolean;
}

export interface PreFlightChecklistState {
  roomReady: boolean;
  equipmentSanitized: boolean;
  materialsVerified: boolean;
  patientIdentified: boolean;
  allergyConfirmed: boolean;
}

export interface IncidentReportPayload {
  reactionDescription: string;
  actionTaken: string;
  vitalsAtPause: {
    bloodPressure: string;
    pulseBpm: number;
    spo2?: number;
    respirationRate?: number;
  };
  emergencyDoctorNotified: boolean;
  reportedAt: string;
  doctorComments?: string;
}

export interface ObservationPayload {
  dosageGiven: string;
  materialsUsed: {
    name: string;
    quantity: string;
  }[];
  patientResponse: 'Normal' | 'Abnormal';
  bloodPressure: string;
  pulseBpm: number;
  clinicalVASScore: number;
  agniStatus: 'Sama' | 'Manda' | 'Tikshna' | 'Visham';
  complicationFlag: boolean;
  complicationNotes?: string;
  generalObservations?: string;
  submittedAt: string;
}

export interface TherapistSession {
  id: string; // e.g. "SES-101"
  sessionId?: string;
  therapistId: string;
  therapistName: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientContact: string;
  patientEmail?: string;
  packageId: string;
  packageName: string;
  stageId: string;
  stageName: string;
  stageCategory: StageCategory;
  dayNumber: number;
  totalDays: number;
  scheduledTime: string; // e.g. "09:00 AM"
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  scheduledDate: string; // "YYYY-MM-DD"
  durationMinutes: number;
  roomNumber: string;
  roomType?: string;
  prakriti?: string;
  prakritiBadgeColor?: string;
  chiefComplaint?: string;
  sequenceOrder?: number;
  doctorName?: string;
  dietFramework?: string;
  status: SessionStatus;
  sameGenderMatched: boolean;
  isConsecutiveWithSameTherapist: boolean;
  preInstructions: string;
  postInstructions: string;
  materials: StageMaterial[];
  priorSessionNotes?: string;
  allergyHistory?: string[];
  doctorAlertMessage?: string;
  doctorModifiedAt?: string; // Mid-session doctor edit timestamp
  doctorModifiedNote?: string;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  elapsedSeconds?: number;
  incidentReport?: IncidentReportPayload;
  observationResult?: ObservationPayload;
  nextSessionUnlocked?: boolean;
}

export interface TherapistProfile {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  specializations: string[];
  rating: number;
  activeWorkload: number;
  isAvailable: boolean;
  email: string;
  phone: string;
  registrationStatus: 'active' | 'suspended' | 'on_leave';
  shiftHours: string;
  experienceYears: number;
  certificationNumber: string;
  assignedChamber: string;
}

export interface TherapistAvailability {
  therapistId: string;
  date: string; // YYYY-MM-DD
  isAvailable: boolean;
  leaveReason?: string;
  blockedTimeSlots?: string[]; // e.g. ["09:00 AM - 11:00 AM", "02:00 PM - 03:30 PM"]
  isFullDayLeave?: boolean;
}

export interface WorkloadDayStat {
  day: string; // "Mon", "Tue", ...
  date: string;
  sessionsCount: number;
  completedCount: number;
  target: number;
}

export interface TherapistWorkload {
  therapistId: string;
  totalToday?: number;
  completedToday?: number;
  inProgressToday?: number;
  upcomingToday?: number;
  totalWeekSessions?: number;
  activeTreatmentHours?: number;
  weeklyStats: WorkloadDayStat[];
  avgSessionDurationMinutes: number;
  noShowRatePercent: number;
  totalCompletedThisMonth: number;
  punctualityScorePercent: number;
}

export interface SessionQueueFilter {
  status: 'all' | 'today' | 'upcoming' | 'completed' | 'flagged';
  searchQuery: string;
  categoryFilter?: StageCategory | 'all';
}
