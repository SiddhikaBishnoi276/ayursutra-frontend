// src/Doctor/types/doctor.types.ts
// Single source of truth for Doctor Module data contracts

export type PatientStatus =
  | 'new'
  | 'prakriti_confirmed'
  | 'in_progress'
  | 'flagged'
  | 'completed';

export type PrakritiDosha =
  | 'Vata'
  | 'Pitta'
  | 'Kapha'
  | 'Vata-Pitta'
  | 'Pitta-Vata'
  | 'Kapha-Vata'
  | 'Vata-Kapha'
  | 'Pitta-Kapha'
  | 'Tridoshic (Vata-Pitta-Kapha)';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  email?: string;
  chiefComplaint: string;
  diagnosis: string;
  status: PatientStatus;
  dominantPrakriti?: string;
  assignedPackageId?: string;
  assignedPackageName?: string;
  currentDay?: number;
  currentStage?: 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
  totalDays?: number;
  onboardedDate: string;
  complicationAlert?: {
    severity: 'mild' | 'moderate' | 'critical';
    message: string;
    reportedBy: string;
    time: string;
  };
}

export interface PrakritiQuestionOption {
  id: string;
  text: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  vataWeight: number;
  pittaWeight: number;
  kaphaWeight: number;
}

export interface PrakritiQuestion {
  id: string;
  category: string;
  text: string;
  sanskritTerm?: string;
  options: PrakritiQuestionOption[];
}

export interface DoshaScores {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: string;
}

export interface TherapyStage {
  id: string;
  name: string;
  category: 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
  dayOffset: number; // 1-indexed start day
  durationDays: number;
  durationMinutes: number;
  preInstructions?: string;
  postInstructions?: string;
  isSkipped?: boolean;
}

export interface TherapyPackage {
  id: string;
  name: string;
  description: string;
  targetDosha: string;
  durationDays: number;
  stages: TherapyStage[];
  baseDietGuidelines?: string;
  contraindications?: string[];
  isStandard?: boolean;
  matchScore?: number;
}

export interface Therapist {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  specializations: string[];
  rating: number;
  activeWorkload: number; // current assigned sessions
  isAvailable: boolean;
}

export interface MedicinePrescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string; // e.g. "Twice Daily (Morning, Night)"
  timing: 'Before Meals' | 'After Meals' | 'Empty Stomach' | 'With Warm Water' | 'Bedtime';
  instructions?: string;
}

export interface TherapyPlan {
  id: string;
  patientId: string;
  packageId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  stages: TherapyStage[];
  assignedTherapistId: string;
  medicines: MedicinePrescription[];
  customDietNotes: string;
  mode: 'clinic' | 'solo';
  createdAt: string;
}

export interface StageDietPlan {
  stageName: string;
  stageCategory: 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
  pathyaFoods: string[]; // Recommended
  apathyaFoods: string[]; // Strictly prohibited
  yogaAsanas: string[];
  pranayama: string[];
  hydrationNotes: string;
}

export interface AIDietCarePlan {
  id: string;
  patientId: string;
  isApproved: boolean;
  generatedDate: string;
  caloricTarget?: number;
  stages: StageDietPlan[];
}

export interface ProgressPoint {
  day: number;
  date: string;
  stage: 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';
  sessionName: string;
  clinicalVASScore: number; // 0 - 10 (Therapist measured)
  patientReportedVASScore: number; // 0 - 10 (Patient subjective feedback)
  pulseBpm: number;
  bloodPressure: string;
  agniStatus: 'Manda' | 'Teekshna' | 'Visham' | 'Sama';
  sleepQualityRating: number; // 1 - 5 stars
  therapistNotes?: string;
  complicationFlag?: boolean;
  flagSeverity?: 'mild' | 'moderate' | 'critical';
}

export interface ComparativeOutcomeReport {
  patientId: string;
  patientName: string;
  diagnosis: string;
  treatmentDurationDays: number;
  preTreatment: {
    vasPainScore: number;
    bloodPressure: string;
    radialPulse: number;
    mobilityIndex: string;
    sleepHours: number;
    agniStatus: string;
  };
  postTreatment: {
    vasPainScore: number;
    bloodPressure: string;
    radialPulse: number;
    mobilityIndex: string;
    sleepHours: number;
    agniStatus: string;
  };
  reliefPercentage: number;
  adherencePercentage: number;
  prognosisSummary: string;
}
