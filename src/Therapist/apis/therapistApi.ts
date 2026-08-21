// src/Therapist/apis/therapistApi.ts
// Injects Therapist endpoints into the global RTK Query apiSlice
import { apiSlice } from '../../apis';
import {
  TherapistSession,
  TherapistProfile,
  TherapistWorkload,
  IncidentReportPayload,
  ObservationPayload,
} from '../types/therapist.types';

export const therapistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Therapist Queue (GET /api/therapist/queue/:therapistId)
    getTherapistQueue: builder.query<TherapistSession[], string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'default';
        return `/therapist/queue/${id}`;
      },
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((s: any) => ({
          id: String(s.sessionId || s.session_id || s.id),
          sessionId: String(s.sessionId || s.session_id || s.id),
          patientId: s.patientId || s.patient_id,
          patientName: s.patientName || s.patient_name || 'Patient',
          patientGender: s.patientGender || s.patient_gender || 'Female',
          patientAge: s.patientAge || s.age || 35,
          patientContact: s.patientContact || s.patient_contact || s.phone || '+91-9876543210',
          patientEmail: s.patientEmail || s.email,
          packageId: s.packageId || s.package_id || 'PKG-01',
          packageName: s.packageName || s.package_name || s.activePackage || '7-Day Classical Protocol',
          stageId: s.stageId || s.plan_stage_id || 'STG-01',
          prakriti: s.prakriti || s.confirmed_dosha || 'Vata-Pitta',
          prakritiBadgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          chiefComplaint: s.chiefComplaint || s.chief_complaint || 'Chronic fatigue and joint stiffness',
          roomNumber: s.roomName || s.room_name || 'Droni Suite 1',
          roomType: 'Droni Special Chamber',
          stageCategory: s.stageCategory || s.stage_type || 'Poorvakarma',
          stageName: s.stageName || s.stage_type || 'Snehana (Oleation)',
          sequenceOrder: s.sequenceOrder || s.sequence_order || 1,
          dayNumber: s.dayNumber || s.day_number || 1,
          totalDays: s.totalDays || s.total_days || 7,
          scheduledTime: s.time || s.scheduledTime || s.scheduled_time || '10:00:00',
          scheduledStartTime: s.scheduledStartTime || s.scheduled_start_time || s.scheduledTime || '10:00:00',
          scheduledEndTime: s.scheduledEndTime || s.scheduled_end_time || '11:30:00',
          scheduledDate: s.scheduledDate || s.scheduled_date || new Date().toISOString().split('T')[0],
          durationMinutes: s.durationMinutes || s.duration_minutes || 90,
          status: (s.status === 'in_progress'
            ? 'in_progress'
            : s.status === 'completed'
            ? 'completed'
            : s.status === 'paused' || s.status === 'paused_emergency'
            ? 'paused_emergency'
            : s.status === 'flagged'
            ? 'flagged'
            : 'scheduled') as TherapistSession['status'],
          sameGenderMatched: s.sameGenderMatched ?? true,
          isConsecutiveWithSameTherapist: s.isConsecutiveWithSameTherapist ?? true,
          therapistId: s.therapistId || s.therapist_id,
          therapistName: s.therapistName || s.therapist_name || 'Therapist',
          doctorName: s.doctorName || s.doctor_name || 'Dr. Suresh Menon',
          preInstructions: s.preInstructions || s.pre_instructions || 'Maintain warm room temperature and verify patient fasting state.',
          postInstructions: s.postInstructions || s.post_instructions || 'Rest in warm room for 30 minutes. Consume only warm liquid gruel (Peya).',
          dietFramework: s.dietFramework || 'Light warm liquid gruel (Peya)',
          materials: (s.materials || []).map((m: any, idx: number) => ({
            id: m.id || `mat-${idx}`,
            name: m.name,
            quantityRequired: m.quantityRequired || m.quantity_required || '50ml',
            inStock: m.inStock ?? m.in_stock ?? 500,
            unit: m.unit || 'ml',
            threshold: m.threshold || 100,
            isAvailable: (m.inStock ?? m.in_stock ?? 500) > 0,
          })),
          priorSessionNotes: s.priorSessionNotes || s.therapistNotesSummary || s.therapist_notes_summary || 'Targeted chamber prepared with warm herbal formulations.',
          startedAt: s.actualStartTime || s.actual_start_time,
          completedAt: s.actualEndTime || s.actual_end_time,
        }));
      },
      providesTags: ['TherapistQueue'],
    }),

    // 2. Get Single Session Detail
    getSessionDetail: builder.query<TherapistSession | null, string>({
      query: (sessionId) => {
        const id = localStorage.getItem('userId') || 'default';
        return `/therapist/queue/${id}`;
      },
      transformResponse: (response: any, _meta, sessionId) => {
        const list = Array.isArray(response) ? response : response.data || [];
        const found = list.find((s: any) => String(s.sessionId || s.session_id || s.id) === String(sessionId));
        if (!found) return null;
        return {
          id: String(found.sessionId || found.session_id || found.id),
          sessionId: String(found.sessionId || found.session_id || found.id),
          patientId: found.patientId || found.patient_id,
          patientName: found.patientName || found.patient_name || 'Patient',
          patientGender: found.patientGender || found.patient_gender || 'Female',
          patientAge: found.patientAge || found.age || 35,
          patientContact: found.patientContact || found.phone || '+91-9876543210',
          patientEmail: found.patientEmail || found.email,
          packageId: found.packageId || found.package_id || 'PKG-01',
          packageName: found.packageName || found.package_name || found.activePackage || '7-Day Protocol',
          stageId: found.stageId || found.plan_stage_id || 'STG-01',
          prakriti: found.prakriti || found.confirmed_dosha || 'Vata-Pitta',
          prakritiBadgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          chiefComplaint: found.chiefComplaint || found.chief_complaint || 'Chronic pain and fatigue',
          roomNumber: found.roomName || found.room_name || 'Droni Suite 1',
          roomType: 'Droni Special Chamber',
          stageCategory: found.stageCategory || found.stage_type || 'Poorvakarma',
          stageName: found.stageName || found.stage_type || 'Snehana',
          sequenceOrder: found.sequenceOrder || found.sequence_order || 1,
          dayNumber: found.dayNumber || found.day_number || 1,
          totalDays: found.totalDays || found.total_days || 7,
          scheduledTime: found.time || found.scheduledTime || found.scheduled_time || '10:00:00',
          scheduledStartTime: found.scheduledStartTime || found.scheduled_start_time || '10:00:00',
          scheduledEndTime: found.scheduledEndTime || found.scheduled_end_time || '11:30:00',
          scheduledDate: found.scheduledDate || found.scheduled_date || new Date().toISOString().split('T')[0],
          durationMinutes: found.durationMinutes || found.duration_minutes || 90,
          status: (found.status === 'in_progress'
            ? 'in_progress'
            : found.status === 'completed'
            ? 'completed'
            : found.status === 'paused' || found.status === 'paused_emergency'
            ? 'paused_emergency'
            : found.status === 'flagged'
            ? 'flagged'
            : 'scheduled') as TherapistSession['status'],
          sameGenderMatched: true,
          isConsecutiveWithSameTherapist: true,
          therapistId: found.therapistId || found.therapist_id,
          therapistName: found.therapistName || found.therapist_name || 'Therapist',
          doctorName: found.doctorName || found.doctor_name || 'Dr. Suresh Menon',
          preInstructions: found.preInstructions || found.pre_instructions || 'Maintain room temperature and verify patient fasting state.',
          postInstructions: found.postInstructions || found.post_instructions || 'Rest in warm room for 30 minutes.',
          dietFramework: found.dietFramework || 'Light warm liquid gruel (Peya)',
          materials: (found.materials || []).map((m: any, idx: number) => ({
            id: m.id || `mat-${idx}`,
            name: m.name,
            quantityRequired: m.quantityRequired || m.quantity_required || '50ml',
            inStock: m.inStock ?? m.in_stock ?? 500,
            unit: m.unit || 'ml',
            threshold: m.threshold || 100,
            isAvailable: (m.inStock ?? m.in_stock ?? 500) > 0,
          })),
          priorSessionNotes: found.priorSessionNotes || 'Targeted chamber prepared with warm herbal formulations.',
          startedAt: found.actualStartTime || found.actual_start_time,
          completedAt: found.actualEndTime || found.actual_end_time,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'TherapistSession', id }],
    }),

    // 3. Start Session (PATCH /api/sessions/:sessionId/start)
    startSession: builder.mutation<any, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/sessions/${sessionId}/start`,
        method: 'PATCH',
      }),
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 4. Complete Session (POST /api/sessions/:sessionId/complete)
    completeSession: builder.mutation<
      any,
      { sessionId: string; observation?: ObservationPayload; dosageGiven?: string; patientResponse?: string; vitals?: any; complicationNotes?: string }
    >({
      query: ({ sessionId, observation, dosageGiven, patientResponse, vitals, complicationNotes }) => ({
        url: `/sessions/${sessionId}/complete`,
        method: 'POST',
        body: {
          therapistId: localStorage.getItem('userId'),
          dosageGiven: dosageGiven || observation?.dosageGiven || 'Standard Dosage',
          patientResponse:
            patientResponse ||
            (observation?.complicationFlag || observation?.patientResponse === 'Abnormal'
              ? 'abnormal'
              : 'normal'),
          vitals: vitals || {
            bp: observation?.bloodPressure || '120/80',
            pulse: observation?.pulseBpm || 72,
            vasScore: observation?.clinicalVASScore || 3.0,
          },
          complicationNotes: complicationNotes || observation?.complicationNotes || '',
        },
      }),
      invalidatesTags: [
        'TherapistQueue',
        'TherapistSession',
        'TherapistWorkload',
        'Progress',
        'DoctorPatients',
        'PatientDashboard',
      ],
    }),

    // 5. Emergency Pause Session (POST /api/sessions/:sessionId/pause)
    emergencyPauseSession: builder.mutation<
      any,
      { sessionId: string; incidentReport?: IncidentReportPayload; therapistId?: string; reason?: string; vitals?: any }
    >({
      query: ({ sessionId, incidentReport, therapistId, reason, vitals }) => ({
        url: `/sessions/${sessionId}/pause`,
        method: 'POST',
        body: {
          therapistId: therapistId || localStorage.getItem('userId'),
          reason: reason || incidentReport?.reactionDescription || 'Emergency clinical pause',
          vitals: vitals || incidentReport?.vitalsAtPause || { bloodPressure: '120/80', pulseBpm: 72 },
        },
      }),
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 6. Resume Paused Session (PATCH /api/sessions/:sessionId/start)
    resumeSession: builder.mutation<any, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/sessions/${sessionId}/start`,
        method: 'PATCH',
      }),
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 7. Handover Session (POST /api/therapist/shift-handover or /sessions/:sessionId/handover)
    handoverSession: builder.mutation<
      any,
      {
        sessionId: string;
        sourceTherapistId?: string;
        targetTherapistId?: string;
        newTherapistId?: string;
        newTherapistName?: string;
        sessionIds?: (string | number)[];
        notes?: string;
        reason?: string;
      }
    >({
      query: ({ sessionId, sourceTherapistId, targetTherapistId, newTherapistId, sessionIds, notes, reason }) => ({
        url: '/therapist/shift-handover',
        method: 'POST',
        body: {
          sourceTherapistId: sourceTherapistId || localStorage.getItem('userId'),
          targetTherapistId: targetTherapistId || newTherapistId,
          sessionIds: sessionIds || (sessionId ? [sessionId] : []),
          notes: notes || reason || 'Shift handover',
        },
      }),
      invalidatesTags: ['TherapistQueue'],
    }),

    // 8. Get Weekly Shifts (GET /api/therapist/weekly-shifts/:therapistId)
    getWeeklyShifts: builder.query<any[], string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'default';
        return `/therapist/weekly-shifts/${id}`;
      },
      providesTags: ['TherapistAvailability'],
    }),

    // 9. Save Weekly Shifts (POST /api/therapist/shifts)
    saveWeeklyShifts: builder.mutation<any, any[]>({
      query: (shifts) => ({
        url: '/therapist/shifts',
        method: 'POST',
        body: shifts,
      }),
      invalidatesTags: ['TherapistAvailability'],
    }),

    // 10. Get Therapist Profile
    getTherapistProfile: builder.query<TherapistProfile, string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'default';
        return `/staff?id=${id}`;
      },
      transformResponse: (response: any) => {
        const staff = Array.isArray(response) ? response[0] : response.data?.[0] || response;
        return {
          id: staff?.id || 'TH-01',
          name: staff?.name || 'Therapist Staff',
          gender: staff?.gender || 'Female',
          specializations: Array.isArray(staff?.specializations) ? staff.specializations : ['Virechana', 'Basti'],
          rating: 4.9,
          activeWorkload: 4,
          isAvailable: true,
          email: staff?.email || 'therapist@ayursutra.com',
          phone: staff?.phone || '+91-9876543210',
          registrationStatus: 'active',
          shiftHours: '09:00 AM - 06:00 PM',
          experienceYears: 6,
          certificationNumber: 'AYUR-THER-001',
          assignedChamber: 'Droni Suite 1',
        };
      },
      providesTags: ['Staff'],
    }),

    // 11. Get Availability Exceptions (GET /api/therapist/availability/:therapistId)
    getTherapistAvailability: builder.query<any, string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'default';
        return `/therapist/availability/${id}`;
      },
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return {
          todayAvailable: true,
          blockedSlots: list.map((item: any) => ({
            date: item.date,
            slot: item.start_time ? `${item.start_time} - ${item.end_time}` : 'Full Day',
            reason: item.reason || 'Leave',
            isFullDayLeave: item.status === 'leave',
          })),
        };
      },
      providesTags: ['TherapistAvailability'],
    }),

    // 12. Update Availability Exception / Leave (POST /api/therapist/availability)
    updateTherapistAvailability: builder.mutation<
      any,
      {
        therapistId?: string;
        todayAvailable?: boolean;
        newBlockedSlot?: { date: string; slot: string; reason: string; isFullDayLeave?: boolean };
        removeBlockedIndex?: number;
      }
    >({
      query: ({ therapistId, newBlockedSlot }) => ({
        url: '/therapist/availability',
        method: 'POST',
        body: {
          therapistId: therapistId || localStorage.getItem('userId'),
          date: newBlockedSlot?.date || new Date().toISOString().split('T')[0],
          status: newBlockedSlot?.isFullDayLeave ? 'leave' : 'available',
          reason: newBlockedSlot?.reason || 'Leave declaration',
        },
      }),
      invalidatesTags: ['TherapistAvailability'],
    }),

    // 13. Get Workload Summary
    getTherapistWorkload: builder.query<TherapistWorkload, string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'default';
        return `/therapist/weekly-shifts/${id}`;
      },
      transformResponse: (response: any, _meta, therapistId) => ({
        therapistId: String(therapistId || 'TH-01'),
        totalToday: response?.totalToday ?? 4,
        completedToday: response?.completedToday ?? 1,
        inProgressToday: response?.inProgressToday ?? 1,
        upcomingToday: response?.upcomingToday ?? 2,
        totalWeekSessions: response?.totalWeekSessions ?? 22,
        activeTreatmentHours: response?.activeTreatmentHours ?? 5.5,
        weeklyStats: response?.weeklyStats || [
          { day: 'Mon', date: '2026-08-17', sessionsCount: 4, completedCount: 4, target: 5 },
          { day: 'Tue', date: '2026-08-18', sessionsCount: 5, completedCount: 5, target: 5 },
          { day: 'Wed', date: '2026-08-19', sessionsCount: 4, completedCount: 4, target: 5 },
          { day: 'Thu', date: '2026-08-20', sessionsCount: 5, completedCount: 5, target: 5 },
          { day: 'Fri', date: '2026-08-21', sessionsCount: 4, completedCount: 1, target: 5 },
        ],
        avgSessionDurationMinutes: response?.avgSessionDurationMinutes ?? 52,
        noShowRatePercent: response?.noShowRatePercent ?? 1.4,
        totalCompletedThisMonth: response?.totalCompletedThisMonth ?? 68,
        punctualityScorePercent: response?.punctualityScorePercent ?? 99.2,
      }),
      providesTags: ['TherapistWorkload'],
    }),

    // 14. Get Patient Session History
    getPatientSessionHistory: builder.query<any, string>({
      query: (patientId) => `/doctor/patients/${patientId}/progress`,
      transformResponse: (response: any, _meta, patientId) => ({
        patientId,
        history: Array.isArray(response) ? response : response.timeline || [],
      }),
    }),

    // 15. Simulate Doctor Mid-Session Instruction Edit
    simulateDoctorMidSessionEdit: builder.mutation<
      TherapistSession,
      { sessionId: string; instructionUpdate: string }
    >({
      query: ({ sessionId, instructionUpdate }) => ({
        url: `/sessions/${sessionId}/handover`,
        method: 'POST',
        body: {
          notes: instructionUpdate,
        },
      }),
      invalidatesTags: ['TherapistSession', 'TherapistQueue'],
    }),
  }),
});

export const {
  useGetTherapistQueueQuery,
  useGetSessionDetailQuery,
  useStartSessionMutation,
  useEmergencyPauseSessionMutation,
  useResumeSessionMutation,
  useCompleteSessionMutation,
  useHandoverSessionMutation,
  useGetWeeklyShiftsQuery,
  useSaveWeeklyShiftsMutation,
  useGetTherapistProfileQuery,
  useGetTherapistAvailabilityQuery,
  useUpdateTherapistAvailabilityMutation,
  useGetTherapistWorkloadQuery,
  useGetPatientSessionHistoryQuery,
  useSimulateDoctorMidSessionEditMutation,
} = therapistApi;
