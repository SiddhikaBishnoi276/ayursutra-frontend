export interface StaffMember {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: 'doctor' | 'therapist';
    specialization: string;   // e.g., "Basti-trained", "Kaya Chikitsa"
    gender: 'Male' | 'Female';
    registrationNum?: string;  // For doctors
    status: 'Active' | 'Suspended';
    avatarUrl?: string;
}

export type StageCategory = 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';

export interface BaseDietFramework {
    allowed?: string[];
    forbidden?: string[];
    guidelines?: string;
    [key: string]: any;
}

export interface PackageStage {
    id?: string;
    stageName?: string;         // 'Snehana', 'Virechana', etc.
    name?: string;
    stage_type?: StageCategory;
    stageCategory: StageCategory;
    category?: StageCategory;
    sequence_order?: number;
    sequenceOrder?: number;
    day_offset?: number;
    dayOffset?: number;
    duration_days?: number;
    durationDays?: number;
    session_duration_minutes?: number;
    durationMinutes?: number;
    pre_instructions?: string;
    preInstructions?: string;
    post_instructions?: string;
    postInstructions?: string;
    base_diet_framework?: BaseDietFramework | any;
    baseDietGuidelines?: string;
}

export interface TherapyPackage {
    id: string;
    _raw_id?: number;
    clinic_id?: number;
    name: string;               // '7-Day Virechana Protocol'
    therapy_type?: string;
    description: string;
    targetDosha: string;
    base_price?: number;
    durationDays: number;
    duration_days?: number;
    total_duration_days?: number;
    stages: PackageStage[];
    preProcedureInstructions?: string;
    postProcedureInstructions?: string;
    dietFramework?: string;
    createdBy?: 'admin' | 'doctor' | string;
    authorName?: string;
    status?: 'Active' | 'Pending Audit' | 'Inactive';
    is_active?: boolean;
}

export interface Room {
    id: string;
    name: string;               // "Room 101"
    type: string;               // "Droni Special Suite"
    status: 'Available' | 'Occupied' | 'Under Maintenance';
    currentSessionId?: string;
    therapistName?: string;
    patientName?: string;
    doctorName?: string;
    stageName?: string;
    durationMinutes?: number;
    scheduledTime?: string;
}

export interface PrakritiWeightOption {
    text: string;
    vata: number;
    pitta: number;
    kapha: number;
}

export interface PrakritiQuestion {
    id: string;
    attribute: string;          // e.g., "Skin Quality"
    questionText: string;
    options: PrakritiWeightOption[];
    version: number;
    hasHistoricalResponses: boolean;
}

export interface NotificationLog {
    id: string;
    recipientName: string;
    recipientRole: 'patient' | 'staff';
    channel: 'SMS' | 'WhatsApp';
    message: string;
    status: 'Sent' | 'Failed';
    timestamp: string;
}

export interface ActivityLog {
    id: string;
    user: string;
    role: string;
    action: string;
    time: string;
    severity: 'info' | 'warning' | 'critical';
}