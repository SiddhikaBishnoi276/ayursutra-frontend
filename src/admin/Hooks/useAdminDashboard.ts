import { useState, useEffect } from 'react';
import { 
    useGetStaffQuery, 
    useGetPackagesQuery, 
    useGetRoomsQuery, 
    useGetQuestionsQuery, 
    useGetNotificationsQuery, 
    useGetActivitiesQuery 
} from '../apis/adminApi';
import { StaffMember, TherapyPackage, Room, PrakritiQuestion, NotificationLog, ActivityLog } from '../types/admin.types';

export const useAdminDashboard = () => {
    // 1. Fetch data from RTK Query
    const { data: staffData, isLoading: isStaffLoading } = useGetStaffQuery();
    const { data: packagesData, isLoading: isPackagesLoading } = useGetPackagesQuery();
    const { data: roomsData, isLoading: isRoomsLoading } = useGetRoomsQuery();
    const { data: questionsData, isLoading: isQuestionsLoading } = useGetQuestionsQuery();
    const { data: notificationsData, isLoading: isNotificationsLoading } = useGetNotificationsQuery();
    const { data: activitiesData, isLoading: isActivitiesLoading } = useGetActivitiesQuery();

    // 2. Initialize local state for interactive demo mutations
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [packages, setPackages] = useState<TherapyPackage[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [questions, setQuestions] = useState<PrakritiQuestion[]>([]);
    const [notifications, setNotifications] = useState<NotificationLog[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);

    // Sync query data to local state once loaded
    useEffect(() => { if (staffData) setStaff(staffData); }, [staffData]);
    useEffect(() => { if (packagesData) setPackages(packagesData); }, [packagesData]);
    useEffect(() => { if (roomsData) setRooms(roomsData); }, [roomsData]);
    useEffect(() => { if (questionsData) setQuestions(questionsData); }, [questionsData]);
    useEffect(() => { if (notificationsData) setNotifications(notificationsData); }, [notificationsData]);
    useEffect(() => { if (activitiesData) setActivities(activitiesData); }, [activitiesData]);

    const isLoading = isStaffLoading || isPackagesLoading || isRoomsLoading || isQuestionsLoading || isNotificationsLoading || isActivitiesLoading;

    // Helper: Add activity log
    const logActivity = (action: string, user = 'Admin', role = 'Admin', severity: ActivityLog['severity'] = 'info') => {
        const newLog: ActivityLog = {
            id: `AL-${Date.now()}`,
            user,
            role,
            action,
            time: 'Just now',
            severity
        };
        setActivities(prev => [newLog, ...prev]);
    };

    // --- Staff Actions ---
    const addStaff = (member: Omit<StaffMember, 'id' | 'status'>) => {
        const newMember: StaffMember = {
            ...member,
            id: `S-${Date.now().toString().slice(-4)}`,
            status: 'Active'
        };
        setStaff(prev => [...prev, newMember]);
        logActivity(`Onboarded new ${member.role}: ${member.fullName}`);
        return newMember;
    };

    const suspendStaff = (id: string): { success: boolean; error?: string } => {
        const member = staff.find(s => s.id === id);
        if (!member) return { success: false, error: 'Staff member not found.' };

        // Conflict check: Pooja Nair (S-102) is currently on an active session in Room 102
        if (id === 'S-102') {
            return {
                success: false,
                error: 'Active sessions must complete before suspension. Pooja Nair is currently scheduled in Room 102.'
            };
        }

        setStaff(prev => prev.map(s => s.id === id ? { ...s, status: 'Suspended' } : s));
        logActivity(`Suspended ${member.role} ${member.fullName}`, 'Admin', 'Admin', 'warning');
        return { success: true };
    };

    const activateStaff = (id: string) => {
        setStaff(prev => prev.map(s => s.id === id ? { ...s, status: 'Active' } : s));
        const member = staff.find(s => s.id === id);
        if (member) logActivity(`Activated ${member.role} ${member.fullName}`);
    };

    const editStaff = (updatedMember: StaffMember) => {
        setStaff(prev => prev.map(s => s.id === updatedMember.id ? updatedMember : s));
        logActivity(`Updated practitioner profile: ${updatedMember.fullName}`);
    };

    // --- Package Actions ---
    const addPackage = (newPkg: Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>) => {
        const createdPkg: TherapyPackage = {
            ...newPkg,
            id: `PKG-${Date.now().toString().slice(-3)}`,
            status: 'Active',
            createdBy: 'admin',
            authorName: 'Clinic Administrator'
        };
        setPackages(prev => [...prev, createdPkg]);
        logActivity(`Created new protocol template "${newPkg.name}"`);
        return createdPkg;
    };

    const approvePackage = (id: string) => {
        setPackages(prev => prev.map(p => p.id === id ? { ...p, status: 'Active' } : p));
        const pkg = packages.find(p => p.id === id);
        if (pkg) logActivity(`Approved doctor-created protocol template "${pkg.name}"`);
    };

    // --- Room Actions ---
    const addRoom = (room: Omit<Room, 'id'>) => {
        const newRoom: Room = {
            ...room,
            id: `R-${Date.now().toString().slice(-4)}`
        };
        setRooms(prev => [...prev, newRoom]);
        logActivity(`Added new therapy chamber: ${room.name} (${room.type})`);
        return newRoom;
    };

    const setRoomStatus = (id: string, status: Room['status']): { success: boolean; error?: string } => {
        const room = rooms.find(r => r.id === id);
        if (!room) return { success: false, error: 'Room not found.' };

        // Conflict check: Room 102 is Occupied
        if (id === '102' && status === 'Under Maintenance') {
            return {
                success: false,
                error: 'This room has a booking at 2 PM — reschedule before marking under maintenance.'
            };
        }

        setRooms(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        logActivity(`Updated ${room.name} status to ${status}`, 'Admin', 'Admin', status === 'Under Maintenance' ? 'warning' : 'info');
        return { success: true };
    };

    // --- Notification Actions ---
    const retryNotification = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'Sent' } : n));
        const log = notifications.find(n => n.id === id);
        if (log) logActivity(`Retried sending credentials to ${log.recipientName}`);
    };

    // --- Questionnaire Actions ---
    const addQuestion = (q: Omit<PrakritiQuestion, 'id' | 'version' | 'hasHistoricalResponses'>) => {
        const newQ: PrakritiQuestion = {
            ...q,
            id: `Q-${Date.now().toString().slice(-2)}`,
            version: 1.0,
            hasHistoricalResponses: false
        };
        setQuestions(prev => [...prev, newQ]);
        logActivity(`Added Prakriti assessment question: "${q.attribute}"`);
    };

    const editQuestion = (updatedQ: PrakritiQuestion) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === updatedQ.id) {
                // Increment version if it has historical responses
                const newVersion = q.hasHistoricalResponses ? parseFloat((q.version + 0.1).toFixed(1)) : q.version;
                return {
                    ...updatedQ,
                    version: newVersion,
                    hasHistoricalResponses: true // now it locks
                };
            }
            return q;
        }));
        logActivity(`Updated Prakriti question version for attribute "${updatedQ.attribute}"`, 'Admin', 'Admin', 'warning');
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
        logActivity(`Removed Prakriti question ${id}`, 'Admin', 'Admin', 'warning');
    };

    return {
        staff,
        packages,
        rooms,
        questions,
        notifications,
        activities,
        isLoading,
        addStaff,
        suspendStaff,
        activateStaff,
        editStaff,
        addPackage,
        approvePackage,
        addRoom,
        setRoomStatus,
        retryNotification,
        addQuestion,
        editQuestion,
        removeQuestion
    };
};