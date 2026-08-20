export interface StaffMember {
    id: string;
    fullName: string;
    email: string;
    role: 'doctor' | 'therapist';
    specialization: string;   // e.g., "Basti-trained", "Kaya Chikitsa"
    gender: 'Male' | 'Female';
    registrationNum?: string;  // For doctors
    status: 'Active' | 'Suspended';
    avatarUrl?: string;
}

export type StageCategory = 'Poorvakarma' | 'Pradhanakarma' | 'Paschatkarma';

export interface PackageStage {
    id: string;
    stageName: string;         // 'Snehana', 'Virechana', etc.
    stageCategory: StageCategory;
    dayOffset: number;
    durationMinutes: number;
}

export interface TherapyPackage {
    id: string;
    name: string;               // '7-Day Virechana Protocol'
    description: string;
    targetDosha: string;
    durationDays: number;
    stages: PackageStage[];
    preProcedureInstructions?: string;
    postProcedureInstructions?: string;
    dietFramework?: string;
    createdBy: 'admin' | 'doctor';
    authorName: string;
    status: 'Active' | 'Pending Audit';
}

export interface Room {
    id: string;
    name: string;               // "Room 101"
    type: string;               // "Droni Special Suite"
    status: 'Available' | 'Occupied' | 'Under Maintenance';
    currentSessionId?: string;
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