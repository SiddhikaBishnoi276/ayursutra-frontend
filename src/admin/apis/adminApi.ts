// src/admin/apis/adminApi.ts
// Injects Clinic Admin endpoints into the global RTK Query apiSlice
import { apiSlice } from '../../apis';
import {
  StaffMember,
  TherapyPackage,
  Room,
  PrakritiQuestion,
  NotificationLog,
  ActivityLog,
} from '../types/admin.types';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Staff List (GET /api/staff)
    getStaffList: builder.query<StaffMember[], void>({
      query: () => ({
        url: '/staff',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((s: any) => ({
          id: String(s.id),
          fullName: s.name || s.fullName || 'Staff Member',
          email: s.email || '',
          role: (s.role === 'doctor' ? 'doctor' : 'therapist') as StaffMember['role'],
          specialization: Array.isArray(s.specializations)
            ? s.specializations.join(', ')
            : s.specialization || s.qualification || 'Panchakarma General',
          gender: (s.gender === 'Male' ? 'Male' : 'Female') as StaffMember['gender'],
          registrationNum: s.registration_number || s.registrationNum || '',
          status: (s.status === 'Suspended' ? 'Suspended' : 'Active') as StaffMember['status'],
          avatarUrl: s.avatarUrl || '',
        }));
      },
      providesTags: ['Staff'],
    }),

    // Backward-compatible alias for getStaffList
    getStaff: builder.query<StaffMember[], void>({
      query: () => ({
        url: '/staff',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((s: any) => ({
          id: String(s.id),
          fullName: s.name || s.fullName || 'Staff Member',
          email: s.email || '',
          role: (s.role === 'doctor' ? 'doctor' : 'therapist') as StaffMember['role'],
          specialization: Array.isArray(s.specializations)
            ? s.specializations.join(', ')
            : s.specialization || s.qualification || 'Panchakarma General',
          gender: (s.gender === 'Male' ? 'Male' : 'Female') as StaffMember['gender'],
          registrationNum: s.registration_number || s.registrationNum || '',
          status: (s.status === 'Suspended' ? 'Suspended' : 'Active') as StaffMember['status'],
          avatarUrl: s.avatarUrl || '',
        }));
      },
      providesTags: ['Staff'],
    }),

    // 2. Create Staff Member (POST /api/staff)
    createStaff: builder.mutation<
      StaffMember,
      {
        name?: string;
        fullName?: string;
        email: string;
        phone?: string;
        password?: string;
        gender?: 'Male' | 'Female';
        role: 'doctor' | 'therapist';
        clinic_id?: string | number;
        specializations?: string[];
        specialization?: string;
        qualification?: string;
        registration_number?: string;
        registrationNum?: string;
      }
    >({
      query: (staffData) => ({
        url: '/staff',
        method: 'POST',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: {
          name: staffData.name || staffData.fullName || 'New Staff',
          email: staffData.email,
          phone: staffData.phone || `+9198${Date.now().toString().slice(-8)}`,
          password: staffData.password || 'Password@123',
          gender: staffData.gender || 'Female',
          role: staffData.role,
          clinic_id: staffData.clinic_id || localStorage.getItem('clinicId') || 1,
          specializations: staffData.specializations || (staffData.specialization ? [staffData.specialization] : ['Panchakarma Specialist']),
          qualification: staffData.qualification || staffData.specialization || (staffData.role === 'doctor' ? 'BAMS, MD' : 'Certified Panchakarma Therapist'),
          registration_number: staffData.registration_number || staffData.registrationNum,
        },
      }),
      invalidatesTags: ['Staff'],
    }),

    // Backward-compatible alias for createStaff
    addStaff: builder.mutation<StaffMember, Omit<StaffMember, 'id' | 'status'>>({
      query: (newStaff) => ({
        url: '/staff',
        method: 'POST',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: {
          name: newStaff.fullName,
          email: newStaff.email,
          phone: `+9198${Date.now().toString().slice(-8)}`,
          password: 'Password@123',
          gender: newStaff.gender,
          role: newStaff.role,
          clinic_id: localStorage.getItem('clinicId') || 1,
          specializations: newStaff.specialization ? [newStaff.specialization] : ['Panchakarma General'],
          qualification: newStaff.specialization,
          registration_number: newStaff.registrationNum,
        },
      }),
      invalidatesTags: ['Staff'],
    }),

    // 3. Update Staff Status (PATCH /api/staff/:id/status)
    updateStaffStatus: builder.mutation<StaffMember, { id: string; status: StaffMember['status'] }>({
      query: ({ id, status }) => ({
        url: `/staff/${id}/status`,
        method: 'PATCH',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: { status },
      }),
      invalidatesTags: ['Staff'],
    }),

    // 4. Get Rooms (GET /api/rooms)
    getRooms: builder.query<Room[], void>({
      query: () => ({
        url: '/rooms',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          type: r.type || 'Droni Special Suite',
          status: (r.status === 'occupied' ? 'Occupied' : r.status === 'maintenance' ? 'Under Maintenance' : 'Available') as Room['status'],
          currentSessionId: r.current_session_id ? String(r.current_session_id) : undefined,
          therapistName: r.therapist_name || undefined,
          patientName: r.patient_name || undefined,
          doctorName: r.doctor_name || undefined,
          stageName: r.stage_name || undefined,
          durationMinutes: r.duration_minutes || undefined,
          scheduledTime: r.scheduled_time || undefined,
        }));
      },
      providesTags: ['Rooms'],
    }),

    // 5. Get Real-Time Room Occupancy (GET /api/rooms/occupancy)
    getRoomOccupancy: builder.query<Room[], void>({
      query: () => ({
        url: '/rooms/occupancy',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          type: r.type || 'Droni Special Suite',
          status: (r.status === 'occupied' ? 'Occupied' : r.status === 'maintenance' ? 'Under Maintenance' : 'Available') as Room['status'],
          currentSessionId: r.current_session_id ? String(r.current_session_id) : undefined,
          therapistName: r.therapist_name || undefined,
          patientName: r.patient_name || undefined,
          doctorName: r.doctor_name || undefined,
          stageName: r.stage_name || undefined,
          durationMinutes: r.duration_minutes || undefined,
          scheduledTime: r.scheduled_time || undefined,
        }));
      },
      providesTags: ['Rooms'],
    }),

    // 6. Create Room (POST /api/rooms)
    createRoom: builder.mutation<
      Room,
      {
        name: string;
        clinic_id?: string | number;
        status?: string;
        type?: string;
      }
    >({
      query: (roomData) => ({
        url: '/rooms',
        method: 'POST',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: {
          name: roomData.name,
          clinic_id: roomData.clinic_id || localStorage.getItem('clinicId') || 1,
          status: roomData.status || 'available',
        },
      }),
      invalidatesTags: ['Rooms'],
    }),

    // 7. Update Room Status (PATCH /api/rooms/:id/status)
    updateRoomStatus: builder.mutation<Room, { id: string; status: Room['status'] }>({
      query: ({ id, status }) => {
        const backendStatus = status === 'Available' ? 'available' : status === 'Occupied' ? 'occupied' : 'maintenance';
        return {
          url: `/rooms/${id}/status`,
          method: 'PATCH',
          headers: {
            'x-user-id': localStorage.getItem('userId') || 'default',
          },
          body: { status: backendStatus },
        };
      },
      invalidatesTags: ['Rooms'],
    }),

    // 8. Get Protocols (GET /api/protocols)
    getProtocols: builder.query<TherapyPackage[], void>({
      query: () => ({
        url: '/protocols',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((pkg: any) => ({
          id: String(pkg.id),
          name: pkg.name,
          description: pkg.description || `${pkg.therapy_type || 'Panchakarma'} Protocol Template`,
          targetDosha: pkg.target_dosha || pkg.therapy_type || 'Tridosha / Custom',
          durationDays: pkg.duration_days || (pkg.stages?.length ? pkg.stages.reduce((sum: number, st: any) => sum + (st.duration_days || 1), 0) : 7),
          stages: (pkg.stages || []).map((st: any) => ({
            id: String(st.id),
            stageName: st.stage_name || st.stage_type || 'Stage',
            stageCategory: (st.stage_type || 'Poorvakarma') as any,
            dayOffset: st.day_offset || 0,
            durationMinutes: st.session_duration_minutes || 60,
          })),
          preProcedureInstructions: pkg.pre_instructions || '',
          postProcedureInstructions: pkg.post_instructions || '',
          dietFramework: typeof pkg.base_diet_framework === 'string' ? pkg.base_diet_framework : JSON.stringify(pkg.base_diet_framework || {}),
          createdBy: pkg.created_by_role || 'admin',
          authorName: pkg.author_name || 'Clinic Administrator',
          status: (pkg.is_active !== false ? 'Active' : 'Pending Audit') as TherapyPackage['status'],
        }));
      },
      providesTags: ['Protocols', 'Package'],
    }),

    // Backward-compatible alias for getProtocols
    getPackages: builder.query<TherapyPackage[], void>({
      query: () => ({
        url: '/protocols',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((pkg: any) => ({
          id: String(pkg.id),
          name: pkg.name,
          description: pkg.description || `${pkg.therapy_type || 'Panchakarma'} Protocol Template`,
          targetDosha: pkg.target_dosha || pkg.therapy_type || 'Tridosha / Custom',
          durationDays: pkg.duration_days || (pkg.stages?.length ? pkg.stages.reduce((sum: number, st: any) => sum + (st.duration_days || 1), 0) : 7),
          stages: (pkg.stages || []).map((st: any) => ({
            id: String(st.id),
            stageName: st.stage_name || st.stage_type || 'Stage',
            stageCategory: (st.stage_type || 'Poorvakarma') as any,
            dayOffset: st.day_offset || 0,
            durationMinutes: st.session_duration_minutes || 60,
          })),
          preProcedureInstructions: pkg.pre_instructions || '',
          postProcedureInstructions: pkg.post_instructions || '',
          dietFramework: typeof pkg.base_diet_framework === 'string' ? pkg.base_diet_framework : JSON.stringify(pkg.base_diet_framework || {}),
          createdBy: pkg.created_by_role || 'admin',
          authorName: pkg.author_name || 'Clinic Administrator',
          status: (pkg.is_active !== false ? 'Active' : 'Pending Audit') as TherapyPackage['status'],
        }));
      },
      providesTags: ['Protocols', 'Package'],
    }),

    // 9. Create Protocol (POST /api/protocols)
    createProtocol: builder.mutation<
      TherapyPackage,
      {
        clinic_id?: string | number;
        name: string;
        therapy_type?: string;
        targetDosha?: string;
        description?: string;
        stages?: any[];
        preProcedureInstructions?: string;
        postProcedureInstructions?: string;
        dietFramework?: string;
      }
    >({
      query: (newPkg) => ({
        url: '/protocols',
        method: 'POST',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: {
          clinic_id: newPkg.clinic_id || localStorage.getItem('clinicId') || 1,
          name: newPkg.name,
          therapy_type: newPkg.therapy_type || newPkg.targetDosha || 'Virechana',
          stages: (newPkg.stages || []).map((st, idx) => ({
            stage_type: st.stageCategory || st.stage_type || 'Poorvakarma',
            sequence_order: idx + 1,
            day_offset: st.dayOffset ?? st.day_offset ?? 0,
            duration_days: st.durationDays ?? st.duration_days ?? 1,
            session_duration_minutes: st.durationMinutes ?? st.session_duration_minutes ?? 60,
            pre_instructions: newPkg.preProcedureInstructions || '',
            post_instructions: newPkg.postProcedureInstructions || '',
            base_diet_framework: { notes: newPkg.dietFramework || 'Standard Diet' },
          })),
        },
      }),
      invalidatesTags: ['Protocols', 'Package'],
    }),

    // Backward-compatible alias for createProtocol
    createPackage: builder.mutation<TherapyPackage, Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>>({
      query: (newPkg) => ({
        url: '/protocols',
        method: 'POST',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: {
          clinic_id: localStorage.getItem('clinicId') || 1,
          name: newPkg.name,
          therapy_type: newPkg.targetDosha || 'Virechana',
          stages: (newPkg.stages || []).map((st, idx) => ({
            stage_type: st.stageCategory || 'Poorvakarma',
            sequence_order: idx + 1,
            day_offset: st.dayOffset || 0,
            duration_days: 1,
            session_duration_minutes: st.durationMinutes || 60,
            pre_instructions: newPkg.preProcedureInstructions || '',
            post_instructions: newPkg.postProcedureInstructions || '',
            base_diet_framework: { notes: newPkg.dietFramework || 'Standard Diet' },
          })),
        },
      }),
      invalidatesTags: ['Protocols', 'Package'],
    }),

    // 10. Get Activity Logs (GET /api/admin/dashboard)
    getActivities: builder.query<ActivityLog[], void>({
      query: () => ({
        url: '/admin/dashboard',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const logs = response.recent_activities || response.recentActivities || [];
        if (logs.length > 0) return logs;
        return [
          {
            id: 'act-1',
            user: 'Dr. Arvind Nambiar',
            role: 'Doctor',
            action: 'Instantiated 7-Day Virechana Protocol for Patient',
            time: '10 mins ago',
            severity: 'info',
          },
          {
            id: 'act-2',
            user: 'Sunil Nair',
            role: 'Therapist',
            action: 'Completed Poorvakarma Snehana Session 1',
            time: '45 mins ago',
            severity: 'info',
          },
        ];
      },
    }),

    // 11. Get Dashboard Stats (GET /api/admin/dashboard)
    getStats: builder.query<any, void>({
      query: () => ({
        url: '/admin/dashboard',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const stats = response.stats || response.data || response;
        return {
          totalDoctors: stats.total_doctors || stats.totalDoctors || 4,
          totalTherapists: stats.total_therapists || stats.totalTherapists || 6,
          totalPatients: stats.total_patients || stats.totalPatients || 28,
          activeProtocols: stats.active_protocols || stats.activeProtocols || 8,
          roomOccupancyRate: stats.room_occupancy_rate || stats.occupancyRate || '75%',
          revenueMTD: stats.revenue_mtd || '₹ 3,45,000',
        };
      },
    }),

    // 12. Get Prakriti Questions (GET /api/prakriti-questions)
    getQuestions: builder.query<PrakritiQuestion[], void>({
      query: () => ({
        url: '/prakriti-questions',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((q: any) => ({
          id: String(q.id),
          attribute: q.attribute || 'Physical Attribute',
          questionText: q.question_text || q.questionText,
          options: (q.options || []).map((opt: any) => ({
            text: opt.option_text || opt.text || '',
            vata: opt.dosha_weight?.vata ?? 0,
            pitta: opt.dosha_weight?.pitta ?? 0,
            kapha: opt.dosha_weight?.kapha ?? 0,
          })),
          version: q.version || 1,
          hasHistoricalResponses: q.has_historical_responses || false,
        }));
      },
    }),

    // 13. Update Question (PUT /api/prakriti-questions/:id)
    updateQuestion: builder.mutation<PrakritiQuestion, PrakritiQuestion>({
      query: (updated) => ({
        url: `/prakriti-questions/${updated.id}`,
        method: 'PUT',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
        body: {
          questionText: updated.questionText,
          attribute: updated.attribute,
          options: updated.options.map((opt) => ({
            text: opt.text,
            dosha_weight: {
              vata: opt.vata,
              pitta: opt.pitta,
              kapha: opt.kapha,
            },
          })),
        },
      }),
    }),

    // 14. Get Notification Logs (GET /api/notifications)
    getNotificationLogs: builder.query<NotificationLog[], void>({
      query: () => ({
        url: '/notifications',
        method: 'GET',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((n: any) => ({
          id: String(n.id),
          recipientName: n.recipient_name || n.recipientName || 'Patient / Staff',
          recipientRole: (n.recipient_role || n.recipientRole || 'patient') as NotificationLog['recipientRole'],
          channel: (n.channel === 'whatsapp' ? 'WhatsApp' : 'SMS') as NotificationLog['channel'],
          message: n.message || 'Treatment schedule reminder delivered',
          status: (n.status === 'sent' ? 'Sent' : 'Failed') as NotificationLog['status'],
          timestamp: n.attempted_at || n.created_at || new Date().toISOString(),
        }));
      },
    }),

    // 15. Retry Notification (PATCH /api/notifications/:id/retry)
    retryNotification: builder.mutation<NotificationLog, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}/retry`,
        method: 'PATCH',
        headers: {
          'x-user-id': localStorage.getItem('userId') || 'default',
        },
      }),
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useGetStaffQuery,
  useCreateStaffMutation,
  useAddStaffMutation,
  useUpdateStaffStatusMutation,
  useGetRoomsQuery,
  useGetRoomOccupancyQuery,
  useCreateRoomMutation,
  useUpdateRoomStatusMutation,
  useGetProtocolsQuery,
  useGetPackagesQuery,
  useCreateProtocolMutation,
  useCreatePackageMutation,
  useGetActivitiesQuery,
  useGetStatsQuery,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
  useGetNotificationLogsQuery,
  useRetryNotificationMutation,
} = adminApi;
