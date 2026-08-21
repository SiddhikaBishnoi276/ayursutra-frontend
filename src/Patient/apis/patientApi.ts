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

import therapyPlanMock from '../data/myTherapyPlan.json';
import appointmentsMock from '../data/myAppointments.json';
import feedbackMock from '../data/myFeedback.json';
import prescriptionsMock from '../data/myPrescriptions.json';

// In-memory live simulation state for interactive prototype
let activePlan: TherapyPlan = JSON.parse(JSON.stringify(therapyPlanMock));
let activeAppointments: Appointment[] = JSON.parse(JSON.stringify(appointmentsMock));
let activeFeedback: PatientFeedback[] = JSON.parse(JSON.stringify(feedbackMock));
let activePrescriptions: PrescriptionData = JSON.parse(JSON.stringify(prescriptionsMock));

export const patientApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Patient Active Therapy Plan
    getMyTherapyPlan: builder.query<TherapyPlan, string | void>({
      queryFn: (_patientId = 'PT-104') => {
        return { data: activePlan };
      },
      providesTags: ['PatientPlan'],
    }),

    // 2. Get Patient Appointments (Upcoming, Completed, Cancelled)
    getMyAppointments: builder.query<Appointment[], string | void>({
      queryFn: (_patientId = 'PT-104') => {
        return { data: activeAppointments };
      },
      providesTags: ['PatientAppointments'],
    }),

    // 3. Get Appointment Detail
    getAppointmentDetail: builder.query<Appointment | null, string>({
      queryFn: (appointmentId) => {
        const item = activeAppointments.find((a) => a.id === appointmentId) || null;
        return { data: item };
      },
      providesTags: (_result, _error, id) => [{ type: 'PatientAppointments', id }],
    }),

    // 4. Submit Feedback for Completed Session
    submitFeedback: builder.mutation<
      { success: boolean; feedback: PatientFeedback; updatedAppointment: Appointment },
      FeedbackSubmissionPayload
    >({
      queryFn: (payload) => {
        const now = new Date().toISOString();
        const feedbackId = `FB-${Date.now().toString().slice(-4)}`;

        const newFeedback: PatientFeedback = {
          id: feedbackId,
          appointmentId: payload.appointmentId,
          sessionId: payload.sessionId,
          stageName: payload.stageName,
          date: now.split('T')[0],
          therapistName: payload.therapistName,
          rating: payload.rating,
          symptomImprovementScore: payload.symptomImprovementScore,
          overallExperience: payload.overallExperience,
          comments: payload.comments,
          therapistPunctualityRating: payload.therapistPunctualityRating || 5,
          facilityCleanlinessRating: payload.facilityCleanlinessRating || 5,
          submittedAt: now,
        };

        // Add to feedback collection at top
        activeFeedback = [newFeedback, ...activeFeedback];

        // Mark appointment as feedback submitted
        activeAppointments = activeAppointments.map((apt) =>
          apt.id === payload.appointmentId || apt.sessionId === payload.sessionId
            ? {
                ...apt,
                feedbackSubmitted: true,
                feedbackRating: payload.rating,
              }
            : apt
        );

        const updatedAppointment = activeAppointments.find(
          (apt) => apt.id === payload.appointmentId || apt.sessionId === payload.sessionId
        )!;

        return {
          data: {
            success: true,
            feedback: newFeedback,
            updatedAppointment,
          },
        };
      },
      invalidatesTags: ['PatientFeedback', 'PatientAppointments', 'PatientPlan'],
    }),

    // 5. Get Prescriptions, Medications & Diet Plan
    getMyPrescriptions: builder.query<PrescriptionData, string | void>({
      queryFn: (_patientId = 'PT-104') => {
        return { data: activePrescriptions };
      },
    }),

    // 6. Get Patient Profile
    getMyProfile: builder.query<PatientProfile, string | void>({
      queryFn: (_patientId = 'PT-104') => {
        return { data: (prescriptionsMock as any).profile as PatientProfile };
      },
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
