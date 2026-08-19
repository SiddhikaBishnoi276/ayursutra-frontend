import { StaffMember, TherapyPackage, Room, PrakritiQuestion, NotificationLog, ActivityLog } from '../types/admin.types';

export const initialStaff: StaffMember[] = [
    { 
        id: 'S-101', 
        fullName: 'Dr. Ravi Sharma', 
        email: 'dr.sharma@ayursutra.com',
        role: 'doctor', 
        specialization: 'Kaya Chikitsa & Panchakarma Specialist',
        gender: 'Male', 
        registrationNum: 'AYU-2019-1024', 
        status: 'Active'
    },
    { 
        id: 'S-102', 
        fullName: 'Pooja Nair', 
        email: 'pooja.nair@ayursutra.com',
        role: 'therapist', 
        specialization: 'Basti-trained & Abhyanga Specialist', 
        gender: 'Female', 
        status: 'Active'
    },
    { 
        id: 'S-103', 
        fullName: 'Arjun Mehta', 
        email: 'arjun.mehta@ayursutra.com',
        role: 'therapist', 
        specialization: 'Vamana-certified & Udvartana Specialist', 
        gender: 'Male', 
        status: 'Active'
    },
    { 
        id: 'S-104', 
        fullName: 'Meera Pillai', 
        email: 'meera.pillai@ayursutra.com',
        role: 'therapist', 
        specialization: 'Shirodhara expert', 
        gender: 'Female', 
        status: 'Active'
    },
    { 
        id: 'S-105', 
        fullName: 'Vikram Joshi', 
        email: 'vikram.joshi@ayursutra.com',
        role: 'therapist', 
        specialization: 'Potli Massage Specialist', 
        gender: 'Male', 
        status: 'Suspended'
    }
];

export const initialPackages: TherapyPackage[] = [
    {
        id: 'PKG-001',
        name: '7-Day Virechana Protocol',
        description: 'Standard Pitta-dosha purification detox protocol featuring herbal oil ingestion, steam therapy, and controlled purgation.',
        targetDosha: 'Pitta Shodhana',
        durationDays: 7,
        stages: [
            { id: 'STG-11', stageName: 'Snehana (Oleation)', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 45 },
            { id: 'STG-12', stageName: 'Swedana (Sudation)', stageCategory: 'Poorvakarma', dayOffset: 3, durationMinutes: 30 },
            { id: 'STG-13', stageName: 'Virechana (Purgation)', stageCategory: 'Pradhanakarma', dayOffset: 4, durationMinutes: 480 },
            { id: 'STG-14', stageName: 'Samsarjana Krama (Diet)', stageCategory: 'Paschatkarma', dayOffset: 5, durationMinutes: 2880 },
        ],
        preProcedureInstructions: 'Light warm diet, avoid cold beverages, drink lukewarm water.',
        postProcedureInstructions: 'Introduce thin rice gruel gradually, avoid physical strain.',
        dietFramework: 'Peyadi Samsarjana Diet Schedule.',
        createdBy: 'admin',
        authorName: 'Clinic Administrator',
        status: 'Active'
    },
    {
        id: 'PKG-002',
        name: '5-Day Karma Basti Protocol',
        description: 'Vata-balancing therapeutic oil & decoction enema cycle designed for deep tissue lubrication and system rejuvenation.',
        targetDosha: 'Vata Shodhana',
        durationDays: 5,
        stages: [
            { id: 'STG-21', stageName: 'Abhyanga (Oil Massage)', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 60 },
            { id: 'STG-22', stageName: 'Niruha Basti (Decoction)', stageCategory: 'Pradhanakarma', dayOffset: 2, durationMinutes: 45 },
            { id: 'STG-23', stageName: 'Anuvasana Basti (Oil)', stageCategory: 'Pradhanakarma', dayOffset: 3, durationMinutes: 30 },
            { id: 'STG-24', stageName: 'Snehana Food Regimen', stageCategory: 'Paschatkarma', dayOffset: 4, durationMinutes: 1440 },
        ],
        preProcedureInstructions: 'Empty stomach preferred before enemas.',
        postProcedureInstructions: 'Rest for 1 hour after administration.',
        dietFramework: 'Manda-Peya warm soft foods.',
        createdBy: 'admin',
        authorName: 'Clinic Administrator',
        status: 'Active'
    },
    {
        id: 'PKG-003',
        name: '5-Day Nasya Cleansing Template',
        description: 'Doctor-submitted nasal therapy template to clear channels and relieve upper-respiratory congestion.',
        targetDosha: 'Kapha Pacification',
        durationDays: 5,
        stages: [
            { id: 'STG-31', stageName: 'Shiro-Abhyanga & Swedana', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 30 },
            { id: 'STG-32', stageName: 'Nasya (Nasal drop instillation)', stageCategory: 'Pradhanakarma', dayOffset: 2, durationMinutes: 15 },
            { id: 'STG-33', stageName: 'Kavala & Gandusha (Gargling)', stageCategory: 'Paschatkarma', dayOffset: 3, durationMinutes: 15 },
        ],
        preProcedureInstructions: 'Avoid heavy meals 2 hours prior.',
        postProcedureInstructions: 'Do not sleep or drink water immediately after Nasya.',
        dietFramework: 'Warm light foods, ginger water.',
        createdBy: 'doctor',
        authorName: 'Dr. Ravi Sharma',
        status: 'Pending Audit'
    }
];

export const initialRooms: Room[] = [
    {
        id: '101',
        name: 'Room 101',
        type: 'Droni Special Suite',
        status: 'Available',
        equipment: [
            { id: 'EQ-101-1', name: 'Neem-wood Droni bed', status: 'Operational' },
            { id: 'EQ-101-2', name: 'Ayurvedic Oil Warmer', status: 'Operational' },
            { id: 'EQ-101-3', name: 'Shirodhara Stand', status: 'Operational' }
        ]
    },
    {
        id: '102',
        name: 'Room 102',
        type: 'Swedana Steam Chamber',
        status: 'Occupied',
        currentSessionId: 'SESS-9081',
        equipment: [
            { id: 'EQ-102-1', name: 'Steam Ingestion Cabinet', status: 'Operational' },
            { id: 'EQ-102-2', name: 'Electric Herb Boiler', status: 'Operational' }
        ]
    },
    {
        id: '103',
        name: 'Room 103',
        type: 'Nasya & Shirodhara Room',
        status: 'Available',
        equipment: [
            { id: 'EQ-103-1', name: 'Shirodhara Copper Urn', status: 'Operational' },
            { id: 'EQ-103-2', name: 'Herbal Steamer (Mini)', status: 'Requires Service' }
        ]
    },
    {
        id: '104',
        name: 'Room 104',
        type: 'Abhyanga Therapy Chamber',
        status: 'Under Maintenance',
        equipment: [
            { id: 'EQ-104-1', name: 'Droni Wooden Table', status: 'Operational' },
            { id: 'EQ-104-2', name: 'Oil Filtration Pump', status: 'Requires Service' }
        ]
    }
];

export const initialQuestions: PrakritiQuestion[] = [
    {
        id: 'Q-01',
        attribute: 'Body Frame & Joint Prominence',
        questionText: 'Which statement best describes your body frame and skeletal build?',
        version: 1.1,
        hasHistoricalResponses: true,
        options: [
            { text: 'Thin, tall or short, lean, joints easily click or crack', vata: 3, pitta: 0, kapha: 0 },
            { text: 'Medium build, good muscle tone, joints are moderate', vata: 0, pitta: 3, kapha: 0 },
            { text: 'Broad, heavy skeletal frame, tends to gain weight easily, joints are hidden', vata: 0, pitta: 0, kapha: 3 }
        ]
    },
    {
        id: 'Q-02',
        attribute: 'Skin Texture & Temperature',
        questionText: 'Touch your arm and face. What describes your skin quality best?',
        version: 1.0,
        hasHistoricalResponses: true,
        options: [
            { text: 'Dry, rough, cool to the touch, easily chapped', vata: 3, pitta: 0, kapha: 0 },
            { text: 'Warm, soft, oily in T-zone, prone to redness, moles/freckles', vata: 0, pitta: 3, kapha: 0 },
            { text: 'Thick, smooth, soft, cool, oily, remains moist', vata: 0, pitta: 0, kapha: 3 }
        ]
    },
    {
        id: 'Q-03',
        attribute: 'Digestion & Appetite',
        questionText: 'How would you characterize your daily digestion and appetite levels?',
        version: 1.2,
        hasHistoricalResponses: false,
        options: [
            { text: 'Irregular. Sometimes hungry, sometimes forget to eat. Frequent gas/bloating', vata: 3, pitta: 1, kapha: 0 },
            { text: 'Intense and strong. Cannot skip meals without getting irritable or acidic', vata: 0, pitta: 3, kapha: 0 },
            { text: 'Slow but steady. Can skip meals easily, digestion takes time', vata: 0, pitta: 0, kapha: 3 }
        ]
    },
    {
        id: 'Q-04',
        attribute: 'Sleep Quality',
        questionText: 'What type of sleep pattern do you experience most regularly?',
        version: 1.0,
        hasHistoricalResponses: true,
        options: [
            { text: 'Light, fitful, easily disturbed by noises, awake in early morning', vata: 3, pitta: 0, kapha: 0 },
            { text: 'Sound and moderate. 6-7 hours is sufficient. Fall back to sleep quickly', vata: 0, pitta: 3, kapha: 0 },
            { text: 'Deep, heavy, hard to wake up, feel groggy even after 8+ hours', vata: 0, pitta: 0, kapha: 3 }
        ]
    }
];

export const initialNotifications: NotificationLog[] = [
    {
        id: 'NL-01',
        recipientName: 'Rahul Verma',
        recipientRole: 'patient',
        channel: 'SMS',
        message: 'Your AyurSutra login: User ID: rahulv, Temp Pin: 9812. Login at portal.ayursutra.com',
        status: 'Failed',
        timestamp: '2026-08-19 18:45'
    },
    {
        id: 'NL-02',
        recipientName: 'Meera Pillai',
        recipientRole: 'staff',
        channel: 'WhatsApp',
        message: 'Onboarding complete! Your credentials: meerap@ayursutra.com. Welcome to clinical system.',
        status: 'Sent',
        timestamp: '2026-08-19 17:30'
    },
    {
        id: 'NL-03',
        recipientName: 'Priya Nair',
        recipientRole: 'staff',
        channel: 'SMS',
        message: 'Urgent Alert: Session scheduled in Room 102 with Patient Sandeep at 2:00 PM.',
        status: 'Sent',
        timestamp: '2026-08-19 13:15'
    },
    {
        id: 'NL-04',
        recipientName: 'Anil Kadam',
        recipientRole: 'patient',
        channel: 'WhatsApp',
        message: 'AyurSutra alert: Complication reported during Swedana session has been logged by Dr. Ravi.',
        status: 'Failed',
        timestamp: '2026-08-19 11:00'
    }
];

export const initialActivities: ActivityLog[] = [
    { id: 'AL-01', user: 'Dr. Ravi Sharma', role: 'Doctor', action: 'Created new package template "5-Day Nasya Cleansing"', time: '2 hours ago', severity: 'info' },
    { id: 'AL-02', user: 'Therapist Pooja Nair', role: 'Therapist', action: 'Flagged complication on Patient Anil (mild rash during Swedana)', time: '3 hours ago', severity: 'critical' },
    { id: 'AL-03', user: 'Admin', role: 'Admin', action: 'Set Room 104 to Maintenance for oil pump repair', time: '5 hours ago', severity: 'warning' },
    { id: 'AL-04', user: 'System Service', role: 'System', action: 'Failed to deliver credentials SMS to Patient Rahul Verma', time: 'Yesterday', severity: 'critical' },
    { id: 'AL-05', user: 'Dr. Ravi Sharma', role: 'Doctor', action: 'Authorized Basti treatment completion in Room 101', time: 'Yesterday', severity: 'info' }
];

export const occupancyTrend = [
    { date: 'Aug 13', rate: 70 },
    { date: 'Aug 14', rate: 75 },
    { date: 'Aug 15', rate: 68 },
    { date: 'Aug 16', rate: 85 },
    { date: 'Aug 17', rate: 80 },
    { date: 'Aug 18', rate: 90 },
    { date: 'Aug 19', rate: 82 }
];

export const sessionVolumeTrend = [
    { date: 'Aug 13', volume: 18 },
    { date: 'Aug 14', volume: 22 },
    { date: 'Aug 15', volume: 15 },
    { date: 'Aug 16', volume: 29 },
    { date: 'Aug 17', volume: 25 },
    { date: 'Aug 18', volume: 32 },
    { date: 'Aug 19', volume: 28 }
];
