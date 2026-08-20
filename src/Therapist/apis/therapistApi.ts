// src/Therapist/apis/therapistApi.ts
// Injects Therapist endpoints into the global RTK Query apiSlice
import { apiSlice } from '../../apis';
import {
  TherapistSession,
  TherapistProfile,
  TherapistAvailability,
  TherapistWorkload,
  IncidentReportPayload,
  ObservationPayload,
} from '../types/therapist.types';

import sessionsMock from '../data/sessionsQueue.json';
import availabilityMock from '../data/availability.json';
import patientHistoryMock from '../data/patientHistory.json';

// In-memory state for live prototype session
let activeSessions: TherapistSession[] = [...(sessionsMock as TherapistSession[])];
let activeAvailability: any = { ...availabilityMock };
let activePatientHistory: any = { ...patientHistoryMock };

export const therapistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Therapist Queue
    getTherapistQueue: builder.query<TherapistSession[], string | void>({
      queryFn: (therapistId = 'TH-01') => {
        const queue = activeSessions.filter(
          (s) => !therapistId || s.therapistId === therapistId
        );
        return { data: queue.length > 0 ? queue : activeSessions };
      },
      providesTags: ['TherapistQueue'],
    }),

    // 2. Get Single Session Detail
    getSessionDetail: builder.query<TherapistSession | null, string>({
      queryFn: (sessionId) => {
        const session = activeSessions.find((s) => s.id === sessionId) || null;
        return { data: session };
      },
      providesTags: (_result, _error, id) => [{ type: 'TherapistSession', id }],
    }),

    // 3. Start Session (POST /api/sessions/:sessionId/start)
    startSession: builder.mutation<TherapistSession, { sessionId: string }>({
      queryFn: ({ sessionId }) => {
        const now = new Date().toISOString();
        activeSessions = activeSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                status: 'in_progress' as const,
                startedAt: s.startedAt || now,
                elapsedSeconds: s.elapsedSeconds || 0,
              }
            : s
        );
        const updated = activeSessions.find((s) => s.id === sessionId)!;
        return { data: updated };
      },
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 4. Emergency Pause Session (POST /api/sessions/:sessionId/emergency-pause)
    emergencyPauseSession: builder.mutation<
      TherapistSession,
      { sessionId: string; incidentReport: IncidentReportPayload }
    >({
      queryFn: ({ sessionId, incidentReport }) => {
        const now = new Date().toISOString();
        activeSessions = activeSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                status: 'paused_emergency' as const,
                pausedAt: now,
                incidentReport,
                doctorAlertMessage: `EMERGENCY ALERT: ${incidentReport.reactionDescription}. Doctor notification sent.`,
              }
            : s
        );
        const updated = activeSessions.find((s) => s.id === sessionId)!;
        return { data: updated };
      },
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 5. Resume Paused Session
    resumeSession: builder.mutation<TherapistSession, { sessionId: string }>({
      queryFn: ({ sessionId }) => {
        activeSessions = activeSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                status: 'in_progress' as const,
              }
            : s
        );
        const updated = activeSessions.find((s) => s.id === sessionId)!;
        return { data: updated };
      },
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 6. Complete Session (POST /api/sessions/:sessionId/complete)
    completeSession: builder.mutation<
      { session: TherapistSession; nextUnlocked: boolean; isFlagged: boolean },
      { sessionId: string; observation: ObservationPayload }
    >({
      queryFn: ({ sessionId, observation }) => {
        const now = new Date().toISOString();
        const isFlagged = observation.complicationFlag || observation.patientResponse === 'Abnormal';
        const finalStatus = isFlagged ? ('flagged' as const) : ('completed' as const);
        const nextSessionUnlocked = !isFlagged;

        // Deduct inventory items simulate
        activeSessions = activeSessions.map((s) => {
          if (s.id === sessionId) {
            const updatedMaterials = s.materials.map((m) => {
              const numericReq = parseFloat(m.quantityRequired.replace(/[^0-9.]/g, '')) || 0;
              return {
                ...m,
                inStock: Math.max(0, m.inStock - numericReq),
              };
            });

            return {
              ...s,
              status: finalStatus,
              completedAt: now,
              observationResult: observation,
              nextSessionUnlocked,
              materials: updatedMaterials,
              doctorAlertMessage: isFlagged
                ? `Complication logged: ${observation.complicationNotes || 'Abnormal clinical response'}. Progression paused pending Doctor review.`
                : '',
            };
          }
          return s;
        });

        // Record into patient history
        const session = activeSessions.find((s) => s.id === sessionId)!;
        if (!activePatientHistory[session.patientId]) {
          activePatientHistory[session.patientId] = {
            patientId: session.patientId,
            name: session.patientName,
            history: [],
          };
        }
        activePatientHistory[session.patientId].history.push({
          day: session.dayNumber,
          date: now.split('T')[0],
          stage: `${session.stageCategory} (${session.stageName})`,
          therapist: session.therapistName,
          bp: observation.bloodPressure,
          pulse: observation.pulseBpm,
          vasScore: observation.clinicalVASScore,
          notes: observation.generalObservations || observation.complicationNotes || 'Completed',
          flagged: isFlagged,
        });

        return {
          data: {
            session,
            nextUnlocked: nextSessionUnlocked,
            isFlagged,
          },
        };
      },
      invalidatesTags: ['TherapistQueue', 'TherapistSession', 'TherapistWorkload', 'Progress', 'DoctorPatients'],
    }),

    // 7. Handover Session
    handoverSession: builder.mutation<
      { success: boolean; session: TherapistSession },
      {
        sessionId: string;
        newTherapistId: string;
        newTherapistName: string;
        reason?: string;
      }
    >({
      queryFn: ({ sessionId, newTherapistId, newTherapistName, reason }) => {
        activeSessions = activeSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                therapistId: newTherapistId,
                therapistName: newTherapistName,
                priorSessionNotes: `${s.priorSessionNotes || ''} [Handover Note: Transferred from ${s.therapistName} to ${newTherapistName}. Reason: ${reason || 'Shift Handover'}]`.trim(),
              }
            : s
        );
        const updated = activeSessions.find((s) => s.id === sessionId)!;
        return { data: { success: true, session: updated } };
      },
      invalidatesTags: ['TherapistQueue', 'TherapistSession'],
    }),

    // 8. Get Therapist Profile (Admin-Created Only)
    getTherapistProfile: builder.query<TherapistProfile, string | void>({
      queryFn: (_therapistId = 'TH-01') => {
        return { data: activeAvailability.profile as TherapistProfile };
      },
      providesTags: ['Staff'],
    }),

    // 9. Get Availability & Blocked Slots
    getTherapistAvailability: builder.query<any, string | void>({
      queryFn: (_therapistId = 'TH-01') => {
        return { data: activeAvailability };
      },
      providesTags: ['TherapistAvailability'],
    }),

    // 10. Update Availability / Leave (POST /api/therapist/:therapistId/availability)
    updateTherapistAvailability: builder.mutation<
      any,
      {
        therapistId: string;
        todayAvailable?: boolean;
        newBlockedSlot?: { date: string; slot: string; reason: string; isFullDayLeave?: boolean };
        removeBlockedIndex?: number;
      }
    >({
      queryFn: ({ todayAvailable, newBlockedSlot, removeBlockedIndex }) => {
        if (typeof todayAvailable === 'boolean') {
          activeAvailability.todayAvailable = todayAvailable;
          activeAvailability.profile.isAvailable = todayAvailable;
        }

        if (newBlockedSlot) {
          activeAvailability.blockedSlots = [
            ...(activeAvailability.blockedSlots || []),
            newBlockedSlot,
          ];
        }

        if (typeof removeBlockedIndex === 'number') {
          activeAvailability.blockedSlots = activeAvailability.blockedSlots.filter(
            (_: any, i: number) => i !== removeBlockedIndex
          );
        }

        return { data: activeAvailability };
      },
      invalidatesTags: ['TherapistAvailability'],
    }),

    // 11. Get Workload Summary
    getTherapistWorkload: builder.query<TherapistWorkload, string | void>({
      queryFn: (therapistId = 'TH-01') => {
        return {
          data: {
            therapistId: therapistId || 'TH-01',
            ...activeAvailability.workload,
          },
        };
      },
      providesTags: ['TherapistWorkload'],
    }),

    // 12. Get Patient History
    getPatientSessionHistory: builder.query<any, string>({
      queryFn: (patientId) => {
        const history = activePatientHistory[patientId] || { patientId, history: [] };
        return { data: history };
      },
    }),

    // 13. Simulate Doctor Mid-Session Instruction Edit
    simulateDoctorMidSessionEdit: builder.mutation<
      TherapistSession,
      { sessionId: string; instructionUpdate: string }
    >({
      queryFn: ({ sessionId, instructionUpdate }) => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        activeSessions = activeSessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                doctorModifiedAt: now,
                doctorModifiedNote: instructionUpdate,
                preInstructions: `${instructionUpdate} (Updated by Dr. Shrikant at ${now})`,
              }
            : s
        );
        const updated = activeSessions.find((s) => s.id === sessionId)!;
        return { data: updated };
      },
      invalidatesTags: ['TherapistSession'],
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
