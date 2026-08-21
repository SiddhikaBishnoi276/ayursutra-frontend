// src/Patient/types/patient.types.ts
// Comprehensive TypeScript interfaces and types for AyurSutra Patient Portal

export type SessionStatus = 'upcoming' | 'completed' | 'cancelled' | 'missed';
export type StageCategory = 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
export type StageStatus = 'completed' | 'in_progress' | 'upcoming';
export type Gender = 'Male' | 'Female' | 'Other';
export type PrakritiType = 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';

export interface DoctorInfo {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface TherapistInfo {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  email: string;
  phone: string;
  gender: Gender;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  email: string;
  address: string;
  prakritiType: PrakritiType;
  vikriti?: string;
  allergies: string[];
  medicalConditions: string[];
  precautions: string[];
  assignedDoctor: DoctorInfo;
  assignedTherapist: TherapistInfo;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  memberSince: string;
}

export interface TherapyStage {
  stageId: string;
  stageName: string;
  stageCategory: StageCategory;
  dayNumber: number;
  totalDays: number;
  status: StageStatus;
  scheduledDate: string;
  scheduledTime: string;
  therapistName: string;
  roomNumber: string;
  durationMinutes: number;
  purpose: string;
  preCareInstructions: string[];
  postCareInstructions: string[];
  herbsAndMaterials: string[];
  statusNote?: string;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  doctorNotesSummary?: string;
}

export interface TherapyPlan {
  planId: string;
  patientId: string;
  patientName: string;
  packageName: string;
  condition: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  completedSessions: number;
  remainingSessions: number;
  progressPercent: number;
  doctorName: string;
  doctorSpecialty: string;
  doctorPlanLastUpdated?: string;
  isPlanUpdatedByDoctor?: boolean;
  doctorUpdateNote?: string;
  stages: TherapyStage[];
  currentStageIndex: number;
  currentStageName: string;
}

export interface Appointment {
  id: string;
  sessionId: string;
  patientId: string;
  date: string;
  time: string;
  durationMinutes: number;
  therapistId: string;
  therapistName: string;
  therapistPhone?: string;
  roomNumber: string;
  stageName: string;
  stageCategory: StageCategory;
  dayNumber: number;
  totalDays: number;
  status: SessionStatus;
  preCareNotes: string[];
  postCareNotes: string[];
  therapistNotesSummary?: string;
  vasScoreBefore?: number;
  vasScoreAfter?: number;
  feedbackSubmitted: boolean;
  feedbackRating?: number;
  cancellationReason?: string;
  canReschedule?: boolean;
}

export interface PatientFeedback {
  id: string;
  appointmentId: string;
  sessionId: string;
  stageName: string;
  date: string;
  therapistName: string;
  rating: number; // 1 to 5
  symptomImprovementScore: number; // 0 to 10 scale (or change in VAS)
  overallExperience: string;
  comments: string;
  therapistPunctualityRating?: number;
  facilityCleanlinessRating?: number;
  submittedAt: string;
}

export interface FeedbackSubmissionPayload {
  appointmentId: string;
  sessionId: string;
  stageName: string;
  therapistName: string;
  rating: number;
  symptomImprovementScore: number;
  overallExperience: string;
  comments: string;
  therapistPunctualityRating?: number;
  facilityCleanlinessRating?: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  sanskritName?: string;
  dosage: string;
  timing: 'Morning' | 'Afternoon' | 'Night' | 'Before Meals' | 'After Meals';
  frequency: string;
  duration: string;
  instructions: string;
  anupana?: string; // Vehicle e.g., Warm water, Honey, Milk
}

export interface MealPlanItem {
  mealTime: string;
  timeRange: string;
  items: string[];
  precautions: string;
}

export interface DietPlan {
  id: string;
  planTitle: string;
  doshaTarget: string;
  assignedByDoctor: string;
  assignedDate: string;
  dietaryGuidelines: string[];
  mealPlan: MealPlanItem[];
  forbiddenFoods: string[];
  permittedDrinks: string[];
  lifestyleTips: string[];
}

export interface PrescriptionData {
  patientId: string;
  patientName: string;
  doctorName: string;
  issuedDate: string;
  validTill: string;
  medications: MedicationItem[];
  dietPlan: DietPlan;
  generalPrecautions: string[];
}

export interface PatientNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'reminder' | 'doctor_update' | 'feedback_prompt' | 'session_completed' | 'alert';
  read: boolean;
  actionUrl?: string;
  updateId?: string; // For persistent dismissal tracking
}

export interface SymptomVASRecord {
  date: string;
  sessionDay: number;
  stageName: string;
  vasBefore: number;
  vasAfter: number;
  improvementPercentage: number;
  status: 'improved' | 'unchanged' | 'worsened';
}
