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
        const id = therapistId || localStorage.getItem('userId') || 'TH-01';
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
          prakriti: s.prakriti || s.confirmed_dosha || 'Vata-Pitta',
          prakritiBadgeColor: s.prakritiBadgeColor || 'bg-amber-100 text-amber-800 border-amber-300',
          chiefComplaint: s.chiefComplaint || s.chief_complaint || 'Chronic back ache and fatigue',
          roomNumber: s.roomName || s.room_name || 'Droni Suite 1',
          roomType: 'Droni Special Chamber',
          stageCategory: s.stageCategory || s.stage_type || 'Poorvakarma',
          stageName: s.stageName || s.stage_type || 'Snehana (Oleation)',
          sequenceOrder: s.sequenceOrder || s.sequence_order || 1,
          dayNumber: s.dayNumber || s.day_number || 1,
          totalDays: s.totalDays || s.total_days || 7,
          scheduledTime: s.scheduledTime || s.scheduled_time || '10:00:00',
          scheduledStartTime: s.scheduledStartTime || s.scheduled_start_time || '10:00:00',
          scheduledEndTime: s.scheduledEndTime || s.scheduled_end_time || '11:30:00',
          durationMinutes: s.durationMinutes || s.duration_minutes || 90,
          status: (s.status === 'in_progress' ? 'in_progress' : s.status === 'completed' ? 'completed' : s.status === 'paused' ? 'paused_emergency' : 'upcoming') as TherapistSession['status'],
          therapistId: s.therapistId || s.therapist_id,
          therapistName: s.therapistName || s.therapist_name || 'Therapist',
          doctorName: s.doctorName || s.doctor_name || 'Dr. Suresh Menon',
          preInstructions: s.preInstructions || s.pre_instructions || 'Maintain room temperature and verify patient fasting state.',
          postInstructions: s.postInstructions || s.post_instructions || 'Rest in warm room for 30 minutes. Warm water gruel.',
          dietFramework: s.dietFramework || 'Light warm liquid gruel (Peya)',
          materials: (s.materials || []).map((m: any) => ({
            name: m.name,
            quantityRequired: m.quantityRequired || m.quantity_required || '50ml',
            inStock: m.inStock ?? m.in_stock ?? 500,
            unit: m.unit || 'ml',
            isAvailable: (m.inStock ?? m.in_stock ?? 500) > 0,
          })),
        }));
      },
      providesTags: ['TherapistQueue'],
    }),

    // 2. Get Single Session Detail
    getSessionDetail: builder.query<TherapistSession | null, string>({
      query: (sessionId) => {
        const id = localStorage.getItem('userId') || 'TH-01';
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
          prakriti: found.prakriti || found.confirmed_dosha || 'Vata-Pitta',
          prakritiBadgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          chiefComplaint: found.chiefComplaint || found.chief_complaint || 'Chronic pain',
          roomNumber: found.roomName || found.room_name || 'Droni Suite 1',
          roomType: 'Droni Special Chamber',
          stageCategory: found.stageCategory || found.stage_type || 'Poorvakarma',
          stageName: found.stageName || found.stage_type || 'Snehana',
          sequenceOrder: found.sequenceOrder || found.sequence_order || 1,
          dayNumber: found.dayNumber || found.day_number || 1,
          totalDays: found.totalDays || found.total_days || 7,
          scheduledTime: found.scheduledTime || found.scheduled_time || '10:00:00',
          scheduledStartTime: found.scheduledStartTime || found.scheduled_start_time || '10:00:00',
          scheduledEndTime: found.scheduledEndTime || found.scheduled_end_time || '11:30:00',
          durationMinutes: found.durationMinutes || found.duration_minutes || 90,
          status: (found.status === 'in_progress' ? 'in_progress' : found.status === 'completed' ? 'completed' : found.status === 'paused' ? 'paused_emergency' : 'upcoming') as TherapistSession['status'],
          therapistId: found.therapistId || found.therapist_id,
          therapistName: found.therapistName || found.therapist_name || 'Therapist',
          doctorName: found.doctorName || found.doctor_name || 'Dr. Suresh Menon',
          preInstructions: found.preInstructions || found.pre_instructions || 'Maintain room temperature and verify patient fasting state.',
          postInstructions: found.postInstructions || found.post_instructions || 'Rest in warm room for 30 minutes.',
          dietFramework: found.dietFramework || 'Light warm liquid gruel (Peya)',
          materials: (found.materials || []).map((m: any) => ({
            name: m.name,
            quantityRequired: m.quantityRequired || m.quantity_required || '50ml',
            inStock: m.inStock ?? m.in_stock ?? 500,
            unit: m.unit || 'ml',
            isAvailable: (m.inStock ?? m.in_stock ?? 500) > 0,
          })),
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

    // 4. Emergency Pause Session (POST /api/sessions/:sessionId/pause)
    emergencyPauseSession: builder.mutation<
      any,
      { sessionId: string; incidentReport: IncidentReportPayload }
    >({
      query: ({ sessionId, incidentReport }) => ({
        url: `/sessions/${sessionId}/pause`,
        method: 'POST',
        body: {
          therapistId: localStorage.getItem('userId'),
          reason: incidentReport.reactionDescription || 'Emergency clinical pause',
          vitals: incidentReport.vitalsRecordedAtIncident,
        },
      }),
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 5. Resume Paused Session (PATCH /api/sessions/:sessionId/start)
    resumeSession: builder.mutation<any, { sessionId: string }>({
      query: ({ sessionId }) => ({
        url: `/sessions/${sessionId}/start`,
        method: 'PATCH',
      }),
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 6. Complete Session (POST /api/sessions/:sessionId/complete)
    completeSession: builder.mutation<
      any,
      { sessionId: string; observation: ObservationPayload }
    >({
      query: ({ sessionId, observation }) => ({
        url: `/sessions/${sessionId}/complete`,
        method: 'POST',
        body: {
          therapistId: localStorage.getItem('userId'),
          dosageGiven: observation.dosageAdministered || 'Standard Dosage',
          patientResponse:
            observation.complicationFlag || observation.patientResponse === 'Abnormal'
              ? 'abnormal'
              : 'normal',
          vitals: {
            bp: observation.bloodPressure,
            pulse: observation.pulseBpm,
            vasScore: observation.clinicalVASScore,
          },
          complicationNotes: observation.complicationNotes || '',
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

    // 7. Handover Session (POST /api/therapist/shift-handover)
    handoverSession: builder.mutation<
      any,
      {
        sessionId: string;
        newTherapistId: string;
        newTherapistName: string;
        reason?: string;
      }
    >({
      query: ({ sessionId, newTherapistId, reason }) => ({
        url: '/therapist/shift-handover',
        method: 'POST',
        body: {
          sourceTherapistId: localStorage.getItem('userId'),
          targetTherapistId: newTherapistId,
          sessionIds: [sessionId],
          notes: reason || 'Shift change handover',
        },
      }),
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 8. Get Therapist Profile
    getTherapistProfile: builder.query<TherapistProfile, string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'TH-01';
        return `/staff?id=${id}`;
      },
      transformResponse: (response: any) => {
        const staff = Array.isArray(response) ? response[0] : response.data?.[0] || response;
        return {
          id: staff?.id || 'TH-01',
          name: staff?.name || 'Therapist Staff',
          role: 'Panchakarma Therapist',
          specialization: 'Snehadhara, Virechana Specialist',
          isAvailable: true,
          shiftTiming: '09:00 AM - 06:00 PM',
          contact: staff?.phone || '+91-9876543210',
          experience: '6 Years in Classical Panchakarma',
        };
      },
      providesTags: ['Staff'],
    }),

    // 9. Get Availability & Blocked Slots (GET /api/therapist/availability/:therapistId)
    getTherapistAvailability: builder.query<any, string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'TH-01';
        return `/therapist/availability/${id}`;
      },
      providesTags: ['TherapistAvailability'],
    }),

    // 10. Update Availability / Leave (POST /api/therapist/availability)
    updateTherapistAvailability: builder.mutation<
      any,
      {
        therapistId: string;
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

    // 11. Get Workload Summary
    getTherapistWorkload: builder.query<TherapistWorkload, string | void>({
      query: (therapistId) => {
        const id = therapistId || localStorage.getItem('userId') || 'TH-01';
        return `/therapist/shifts/${id}`;
      },
      transformResponse: (response: any, _meta, therapistId) => ({
        therapistId: therapistId || 'TH-01',
        totalToday: 4,
        completedToday: 1,
        inProgressToday: 1,
        upcomingToday: 2,
        totalWeekSessions: 22,
        activeTreatmentHours: 5.5,
      }),
      providesTags: ['TherapistWorkload'],
    }),

    // 12. Get Patient History
    getPatientSessionHistory: builder.query<any, string>({
      query: (patientId) => `/doctor/patients/${patientId}/progress`,
      transformResponse: (response: any, _meta, patientId) => ({
        patientId,
        history: Array.isArray(response) ? response : response.timeline || [],
      }),
    }),

    // 13. Simulate Doctor Mid-Session Instruction Edit
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
  useGetTherapistProfileQuery,
  useGetTherapistAvailabilityQuery,
  useUpdateTherapistAvailabilityMutation,
  useGetTherapistWorkloadQuery,
  useGetPatientSessionHistoryQuery,
  useSimulateDoctorMidSessionEditMutation,
} = therapistApi;
