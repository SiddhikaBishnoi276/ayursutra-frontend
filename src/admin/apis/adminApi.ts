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
    getStaff: builder.query<StaffMember[], void>({
      query: () => '/staff',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((s: any) => ({
          id: s.id,
          fullName: s.name || s.fullName || 'Staff Member',
          email: s.email || '',
          role: s.role || 'therapist',
          specialization: Array.isArray(s.specializations)
            ? s.specializations.join(', ')
            : s.specialization || s.qualification || 'Panchakarma General',
          gender: s.gender || 'Female',
          registrationNum: s.registration_number || s.registrationNum || '',
          status: s.status === 'Suspended' ? 'Suspended' : 'Active',
          avatarUrl: s.avatarUrl || '',
        }));
      },
      providesTags: ['Staff'],
    }),

    addStaff: builder.mutation<StaffMember, Omit<StaffMember, 'id' | 'status'>>({
      query: (newStaff) => ({
        url: '/staff',
        method: 'POST',
        body: {
          name: newStaff.fullName,
          email: newStaff.email,
          phone: `+9198${Date.now().toString().slice(-8)}`,
          password: 'Password@123',
          gender: newStaff.gender,
          role: newStaff.role,
          clinic_id: localStorage.getItem('clinicId') || 1,
          specializations: newStaff.specialization ? [newStaff.specialization] : [],
          qualification: newStaff.specialization,
          registration_number: newStaff.registrationNum,
        },
      }),
      invalidatesTags: ['Staff'],
    }),

    updateStaffStatus: builder.mutation<StaffMember, { id: string; status: StaffMember['status'] }>({
      query: ({ id, status }) => ({
        url: `/staff/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Staff'],
    }),

    getPackages: builder.query<TherapyPackage[], void>({
      query: () => '/protocols',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((pkg: any) => ({
          id: String(pkg.id),
          name: pkg.name,
          description: pkg.description || `${pkg.therapy_type || 'Panchakarma'} Protocol Template`,
          targetDosha: pkg.target_dosha || pkg.targetDosha || 'Tridosha / Custom',
          durationDays: pkg.duration_days || (pkg.stages?.length ? pkg.stages.reduce((sum: number, st: any) => sum + (st.duration_days || 1), 0) : 7),
          stages: (pkg.stages || []).map((st: any) => ({
            id: String(st.id),
            stageName: st.stage_name || st.stage_type || 'Stage',
            stageCategory: st.stage_type || 'Poorvakarma',
            dayOffset: st.day_offset || 0,
            durationMinutes: st.session_duration_minutes || 60,
          })),
          preProcedureInstructions: pkg.pre_instructions || '',
          postProcedureInstructions: pkg.post_instructions || '',
          dietFramework: typeof pkg.base_diet_framework === 'string' ? pkg.base_diet_framework : JSON.stringify(pkg.base_diet_framework || {}),
          createdBy: pkg.created_by_role || 'admin',
          authorName: pkg.author_name || 'Clinic Administrator',
          status: pkg.is_active !== false ? 'Active' : 'Pending Audit',
        }));
      },
      providesTags: ['Package', 'Protocols'],
    }),

    createPackage: builder.mutation<TherapyPackage, Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>>({
      query: (newPkg) => ({
        url: '/protocols',
        method: 'POST',
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
      invalidatesTags: ['Package', 'Protocols'],
    }),

    getRooms: builder.query<Room[], void>({
      query: () => '/rooms/occupancy',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          type: r.type || 'Droni Treatment Suite',
          status: r.status === 'occupied' ? 'Occupied' : r.status === 'maintenance' ? 'Under Maintenance' : 'Available',
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

    updateRoomStatus: builder.mutation<Room, { id: string; status: Room['status'] }>({
      query: ({ id, status }) => {
        const backendStatus = status === 'Available' ? 'available' : status === 'Occupied' ? 'occupied' : 'maintenance';
        return {
          url: `/rooms/${id}/status`,
          method: 'PATCH',
          body: { status: backendStatus },
        };
      },
      invalidatesTags: ['Rooms'],
    }),

    getActivities: builder.query<ActivityLog[], void>({
      query: () => '/admin/dashboard',
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

    getStats: builder.query<any, void>({
      query: () => '/admin/dashboard',
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

    getQuestions: builder.query<PrakritiQuestion[], void>({
      query: () => '/prakriti-questions',
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

    updateQuestion: builder.mutation<PrakritiQuestion, PrakritiQuestion>({
      query: (updated) => ({
        url: `/prakriti-questions/${updated.id}`,
        method: 'PUT',
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

    getNotificationLogs: builder.query<NotificationLog[], void>({
      query: () => '/notifications',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((n: any) => ({
          id: String(n.id),
          recipientName: n.recipient_name || n.recipientName || 'Patient / Staff',
          recipientRole: n.recipient_role || n.recipientRole || 'patient',
          channel: n.channel === 'whatsapp' ? 'WhatsApp' : 'SMS',
          message: n.message || 'Treatment schedule reminder delivered',
          status: n.status === 'sent' ? 'Sent' : 'Failed',
          timestamp: n.attempted_at || n.created_at || new Date().toISOString(),
        }));
      },
    }),

    retryNotification: builder.mutation<NotificationLog, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}/retry`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffStatusMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useGetRoomsQuery,
  useUpdateRoomStatusMutation,
  useGetActivitiesQuery,
  useGetStatsQuery,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
  useGetNotificationLogsQuery,
  useRetryNotificationMutation,
} = adminApi;
