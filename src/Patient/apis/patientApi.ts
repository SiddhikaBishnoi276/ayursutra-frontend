// src/Patient/apis/patientApi.ts
// Injects Patient endpoints into the global RTK Query apiSlice
import { apiSlice } from '../../apis';
import {
  TherapyPlan,
  Appointment,
  PatientFeedback,
  FeedbackSubmissionPayload,
  PrescriptionData,
  PatientProfile,
} from '../types/patient.types';

export const patientApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Patient Active Therapy Plan (GET /api/patient/dashboard/:patientId)
    getMyTherapyPlan: builder.query<TherapyPlan, string | void>({
      query: (patientId) => {
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const pInfo = response.patientInfo || response.patient_info || {};
        const timeline = response.sessionsTimeline || response.sessions_timeline || [];
        const completedSessions = timeline.filter((t: any) => t.status === 'completed').length;
        const totalSessions = timeline.length || 7;

        return {
          id: pInfo.id || 'PLAN-01',
          packageId: pInfo.activePackage || '7-Day Classical Virechana Protocol',
          packageName: pInfo.activePackage || '7-Day Classical Virechana Protocol',
          therapyType: 'Virechana',
          status: 'Active',
          startDate: timeline[0]?.date || '2026-08-20',
          estimatedEndDate: timeline[timeline.length - 1]?.date || '2026-08-27',
          doctorName: pInfo.doctorName || pInfo.doctor_name || 'Dr. Suresh Menon',
          totalSessions,
          completedSessions,
          progressPercentage: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
          currentStage: {
            stageCategory: 'Pradhanakarma',
            stageName: 'Virechana Karma',
            currentDay: Math.min(completedSessions + 1, totalSessions),
            totalDaysInStage: 1,
            preCareNotes: timeline[0]?.preCareNotes || ['Light warm gruel diet', 'Fasting prior to procedure'],
            postCareNotes: timeline[0]?.postCareNotes || ['Rest in warm room for 30 minutes'],
          },
          stages: [
            {
              id: 'STG-01',
              category: 'Poorvakarma',
              name: 'Internal Snehapana (Ghee Oleation)',
              durationDays: 3,
              sequenceOrder: 1,
              status: completedSessions >= 3 ? 'Completed' : 'In Progress',
              scheduledStartDate: '2026-08-20',
              sessions: timeline.filter((t: any) => t.stageCategory === 'Poorvakarma'),
            },
            {
              id: 'STG-02',
              category: 'Pradhanakarma',
              name: 'Virechana (Therapeutic Purgation)',
              durationDays: 1,
              sequenceOrder: 2,
              status: completedSessions >= 4 ? 'Completed' : completedSessions >= 3 ? 'In Progress' : 'Upcoming',
              scheduledStartDate: '2026-08-23',
              sessions: timeline.filter((t: any) => t.stageCategory === 'Pradhanakarma'),
            },
            {
              id: 'STG-03',
              category: 'Paschatkarma',
              name: 'Samsarjana Krama (Diet Progression)',
              durationDays: 3,
              sequenceOrder: 3,
              status: 'Upcoming',
              scheduledStartDate: '2026-08-24',
              sessions: timeline.filter((t: any) => t.stageCategory === 'Paschatkarma'),
            },
          ],
        };
      },
      providesTags: ['PatientPlan', 'PatientDashboard'],
    }),

    // 2. Get Patient Appointments (Upcoming, Completed, Cancelled)
    getMyAppointments: builder.query<Appointment[], string | void>({
      query: (patientId) => {
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const timeline = response.sessionsTimeline || response.sessions_timeline || [];
        return timeline.map((item: any) => ({
          id: String(item.id || item.sessionId || item.session_id),
          sessionId: String(item.sessionId || item.session_id || item.id),
          stageName: item.stageName || item.stage_name || item.stageCategory || 'Poorvakarma',
          stageCategory: item.stageCategory || item.stage_type || 'Poorvakarma',
          dayNumber: item.dayNumber || item.day_number || 1,
          totalDays: item.totalDays || item.total_days || 7,
          date: item.date || item.scheduledDate || item.scheduled_date,
          time: item.time || '10:00 AM',
          durationMinutes: item.durationMinutes || item.duration_minutes || 90,
          therapistName: item.therapistName || item.therapist_name || 'Therapist',
          therapistPhone: item.therapistPhone || item.therapist_phone || '+91-9876543210',
          roomNumber: item.roomNumber || item.roomName || item.room_name || 'Droni Suite 1',
          status: item.status === 'completed' ? 'Completed' : item.status === 'in_progress' ? 'In Progress' : 'Upcoming',
          preCareNotes: item.preCareNotes || item.pre_care_notes || ['Fasting 2 hours prior'],
          postCareNotes: item.postCareNotes || item.post_care_notes || ['Warm liquid diet only'],
          therapistNotesSummary: item.therapistNotesSummary || item.therapist_notes_summary || 'Chamber prepared with warm medicated oils.',
          feedbackSubmitted: item.feedbackSubmitted ?? item.feedback_submitted ?? false,
          feedbackRating: item.feedback?.rating || 5,
          canReschedule: item.canReschedule ?? item.can_reschedule ?? true,
        }));
      },
      providesTags: ['PatientAppointments', 'PatientDashboard'],
    }),

    // 3. Get Appointment Detail
    getAppointmentDetail: builder.query<Appointment | null, string>({
      query: (appointmentId) => {
        const id = localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any, _meta, appointmentId) => {
        const timeline = response.sessionsTimeline || response.sessions_timeline || [];
        const found = timeline.find(
          (item: any) =>
            String(item.id) === String(appointmentId) ||
            String(item.sessionId || item.session_id) === String(appointmentId)
        );
        if (!found) return null;
        return {
          id: String(found.id || found.sessionId || found.session_id),
          sessionId: String(found.sessionId || found.session_id || found.id),
          stageName: found.stageName || found.stage_name || found.stageCategory || 'Poorvakarma',
          stageCategory: found.stageCategory || found.stage_type || 'Poorvakarma',
          dayNumber: found.dayNumber || found.day_number || 1,
          totalDays: found.totalDays || found.total_days || 7,
          date: found.date || found.scheduledDate || found.scheduled_date,
          time: found.time || '10:00 AM',
          durationMinutes: found.durationMinutes || found.duration_minutes || 90,
          therapistName: found.therapistName || found.therapist_name || 'Therapist',
          therapistPhone: found.therapistPhone || found.therapist_phone || '+91-9876543210',
          roomNumber: found.roomNumber || found.roomName || found.room_name || 'Droni Suite 1',
          status: found.status === 'completed' ? 'Completed' : found.status === 'in_progress' ? 'In Progress' : 'Upcoming',
          preCareNotes: found.preCareNotes || found.pre_care_notes || ['Fasting 2 hours prior'],
          postCareNotes: found.postCareNotes || found.post_care_notes || ['Warm liquid diet only'],
          therapistNotesSummary: found.therapistNotesSummary || found.therapist_notes_summary || 'Chamber prepared.',
          feedbackSubmitted: found.feedbackSubmitted ?? found.feedback_submitted ?? false,
          feedbackRating: found.feedback?.rating || 5,
          canReschedule: found.canReschedule ?? found.can_reschedule ?? true,
        };
      },
      providesTags: (_result, _error, id) => [{ type: 'PatientAppointments', id }],
    }),

    // 4. Submit Feedback for Completed Session (POST /api/patient/feedback)
    submitFeedback: builder.mutation<
      { success: boolean; feedback: PatientFeedback; updatedAppointment?: Appointment },
      FeedbackSubmissionPayload
    >({
      query: (payload) => ({
        url: '/patient/feedback',
        method: 'POST',
        body: {
          sessionId: payload.sessionId || payload.appointmentId,
          patientId: localStorage.getItem('userId') || 'PT-104',
          rating: payload.rating,
          symptomImprovementScore: payload.symptomImprovementScore || 8,
          overallExperience: payload.overallExperience || 'Treatment experience was smooth and revitalizing',
          comments: payload.comments || '',
        },
      }),
      transformResponse: (response: any, _meta, payload) => ({
        success: response.success ?? true,
        feedback: {
          id: String(response.feedbackId || response.feedback_id || `FB-${Date.now().toString().slice(-4)}`),
          appointmentId: payload.appointmentId,
          sessionId: payload.sessionId,
          stageName: payload.stageName,
          date: new Date().toISOString().split('T')[0],
          therapistName: payload.therapistName,
          rating: payload.rating,
          symptomImprovementScore: payload.symptomImprovementScore,
          overallExperience: payload.overallExperience,
          comments: payload.comments,
          therapistPunctualityRating: payload.therapistPunctualityRating || 5,
          facilityCleanlinessRating: payload.facilityCleanlinessRating || 5,
          submittedAt: response.submittedAt || response.submitted_at || new Date().toISOString(),
        },
      }),
      invalidatesTags: ['PatientFeedback', 'PatientAppointments', 'PatientPlan', 'PatientDashboard'],
    }),

    // 5. Get Prescriptions, Medications & Diet Plan (from Dashboard)
    getMyPrescriptions: builder.query<PrescriptionData, string | void>({
      query: (patientId) => {
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const diet = response.dietPlan || response.diet_plan || {};
        const meds = response.medications || [];

        return {
          dietPlan: {
            planTitle: diet.planTitle || 'Prescribed Panchakarma Diet',
            doshaTarget: diet.doshaTarget || 'Vata-Pitta Balancing',
            guidelines: diet.dietaryGuidelines || ['Strictly warm, freshly cooked liquid and semi-solid food', 'Avoid raw vegetables and cold beverages'],
            forbiddenFoods: diet.forbiddenFoods || ['Cold drinks', 'Curd at night', 'Deep-fried items'],
            permittedDrinks: diet.permittedDrinks || ['Lukewarm water with ginger', 'Jeera boiled water'],
            lifestyleTips: diet.lifestyleTips || ['Avoid daytime sleep during Poorvakarma', 'Sleep by 10:00 PM'],
          },
          medications: meds.map((m: any) => ({
            id: m.id || 'MED-01',
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            timing: m.timing,
            duration: m.duration,
            instructions: `Take with ${m.anupana || 'warm water'}`,
          })),
        };
      },
      providesTags: ['PatientDashboard'],
    }),

    // 6. Get Patient Profile
    getMyProfile: builder.query<PatientProfile, string | void>({
      query: (patientId) => {
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const p = response.patientInfo || response.patient_info || {};
        return {
          id: p.id || 'PT-104',
          name: p.name || 'Patient',
          age: p.age || 34,
          gender: p.gender || 'Female',
          contact: p.phone || '+91-9876543210',
          email: p.email || 'patient@ayursutra.com',
          prakriti: p.prakritiType || p.confirmed_dosha || 'Vata-Pitta',
          chiefComplaint: p.diagnosis || 'Vata imbalance and fatigue',
          assignedDoctor: p.doctorName || p.doctor_name || 'Dr. Suresh Menon',
          activePackage: p.activePackage || '7-Day Virechana Protocol',
        };
      },
      providesTags: ['PatientDashboard'],
    }),
  }),
});

export const {
  useGetMyTherapyPlanQuery,
  useGetMyAppointmentsQuery,
  useGetAppointmentDetailQuery,
  useSubmitFeedbackMutation,
  useGetMyPrescriptionsQuery,
  useGetMyProfileQuery,
} = patientApi;
