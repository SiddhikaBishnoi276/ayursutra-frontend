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
    // 1. Get Comprehensive Patient Dashboard (GET /api/patient/dashboard/:patientId)
    getPatientDashboard: builder.query<any, string | void>({
      query: (patientId) => {
        const id =
          patientId && patientId !== 'PT-104' && patientId !== 'default'
            ? patientId
            : localStorage.getItem('userId') || '';
        return `/patient/dashboard/${id}`;
      },
      providesTags: ['PatientDashboard'],
    }),

    // 2. Submit Post-Session Patient Feedback (POST /api/patient/feedback)
    submitFeedback: builder.mutation<
      { success: boolean; feedback?: PatientFeedback; message?: string },
      FeedbackSubmissionPayload | {
        sessionId: string | number;
        patientId?: string;
        rating: number;
        symptomImprovementScore?: number;
        comments?: string;
        overallExperience?: string;
      }
    >({
      query: (payload) => ({
        url: '/patient/feedback',
        method: 'POST',
        body: {
          sessionId: payload.sessionId || ('appointmentId' in payload ? payload.appointmentId : undefined),
          patientId: ('patientId' in payload && payload.patientId && payload.patientId !== 'PT-104')
            ? payload.patientId
            : localStorage.getItem('userId') || '',
          rating: payload.rating,
          symptomImprovementScore: payload.symptomImprovementScore || 8,
          overallExperience: payload.overallExperience || 'Treatment experience was smooth and revitalizing',
          comments: payload.comments || '',
        },
      }),
      invalidatesTags: ['PatientDashboard', 'PatientFeedback', 'PatientAppointments', 'PatientPlan'],
    }),

    // 3. Get Patient Past Feedback (GET /api/patient/feedback/:patientId)
    getPatientFeedback: builder.query<PatientFeedback[], string | void>({
      query: (patientId) => {
        const id =
          patientId && patientId !== 'PT-104' && patientId !== 'default'
            ? patientId
            : localStorage.getItem('userId') || '';
        return `/patient/feedback/${id}`;
      },
      providesTags: ['PatientDashboard', 'PatientFeedback'],
    }),

    // 4. Get Patient Active Therapy Plan (Mapped from Dashboard)
    getMyTherapyPlan: builder.query<TherapyPlan, string | void>({
      query: (patientId) => {
        const id =
          patientId && patientId !== 'PT-104' && patientId !== 'default'
            ? patientId
            : localStorage.getItem('userId') || '';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const pInfo = response.patientInfo || response.patient_info || {};
        const timeline = response.sessionsTimeline || response.sessions_timeline || [];
        const completedSessions = timeline.filter((t: any) => t.status === 'completed').length;
        const totalSessions = timeline.length || 7;
        const remainingSessions = Math.max(0, totalSessions - completedSessions);
        const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

        const stagesList = (timeline || []).map((t: any, idx: number) => ({
          stageId: String(t.id || t.sessionId || t.session_id || `STG-${idx + 1}`),
          stageName: t.stageName || t.stage_name || t.stageCategory || 'Therapy Procedure',
          stageCategory: t.stageCategory || t.stage_type || 'Poorvakarma',
          dayNumber: t.dayNumber || t.day_number || idx + 1,
          totalDays: totalSessions,
          status: (t.status === 'completed' ? 'completed' : t.status === 'in_progress' ? 'in_progress' : 'upcoming') as any,
          scheduledDate: t.scheduledDate || t.scheduled_date || t.date || new Date().toISOString().split('T')[0],
          scheduledTime: t.scheduledTime || t.scheduled_time || t.time || '10:00 AM',
          therapistName: t.therapistName || t.therapist_name || 'Therapist',
          roomNumber: t.roomNumber || t.roomName || t.room_name || 'Droni Suite 1',
          durationMinutes: t.durationMinutes || t.duration_minutes || 60,
          purpose: t.stageName || t.stage_name || 'Classical detoxification & tissue nourishment',
          preCareInstructions: t.preCareNotes || t.pre_care_notes || t.preInstructions || t.pre_instructions || ['Fasting 2 hours prior to procedure'],
          postCareInstructions: t.postCareNotes || t.post_care_notes || t.postInstructions || t.post_instructions || ['Rest in warm chamber and consume warm gruel'],
          herbsAndMaterials: ['Medicated Herbal Taila', 'Saindhava Lavana'],
        }));

        return {
          planId: pInfo.id || 'PLAN-01',
          patientId: pInfo.id || localStorage.getItem('userId') || '',
          patientName: pInfo.name || localStorage.getItem('name') || 'Patient',
          packageName: pInfo.activePackage || pInfo.package_name || '7-Day Classical Protocol',
          condition: pInfo.diagnosis || 'Panchakarma Protocol',
          startDate: timeline[0]?.date || new Date().toISOString().split('T')[0],
          endDate: timeline[timeline.length - 1]?.date || new Date().toISOString().split('T')[0],
          totalSessions,
          completedSessions,
          remainingSessions,
          progressPercent,
          doctorName: pInfo.doctorName || pInfo.doctor_name || 'Supervising Doctor',
          doctorSpecialty: 'Senior Panchakarma Specialist',
          stages: stagesList,
          currentStageIndex: Math.min(completedSessions, totalSessions - 1),
          currentStageName: stagesList[Math.min(completedSessions, totalSessions - 1)]?.stageName || 'Poorvakarma',
        };
      },
      providesTags: ['PatientPlan', 'PatientDashboard'],
    }),

    // 5. Get Patient Appointments Timeline (Mapped from Dashboard)
    getMyAppointments: builder.query<Appointment[], string | void>({
      query: (patientId) => {
        const id =
          patientId && patientId !== 'PT-104' && patientId !== 'default'
            ? patientId
            : localStorage.getItem('userId') || '';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const timeline = response.sessionsTimeline || response.sessions_timeline || [];
        return timeline.map((item: any, idx: number) => ({
          id: String(item.id || item.sessionId || item.session_id || `APT-${idx + 1}`),
          sessionId: String(item.sessionId || item.session_id || item.id || `SES-${idx + 1}`),
          patientId: response.patientInfo?.id || response.patient_info?.id || localStorage.getItem('userId') || '',
          date: item.scheduledDate || item.scheduled_date || item.date || new Date().toISOString().split('T')[0],
          time: item.time || item.scheduledTime || item.scheduled_time || '10:00 AM',
          durationMinutes: item.durationMinutes || item.duration_minutes || 60,
          therapistId: item.therapistId || item.therapist_id || '',
          therapistName: item.therapistName || item.therapist_name || 'Assigned Therapist',
          therapistPhone: item.therapistPhone || item.therapist_phone || '',
          roomNumber: item.roomNumber || item.roomName || item.room_name || 'Droni Suite 1',
          stageName: item.stageName || item.stage_name || item.stageCategory || 'Poorvakarma',
          stageCategory: item.stageCategory || item.stage_type || 'Poorvakarma',
          dayNumber: item.dayNumber || item.day_number || idx + 1,
          totalDays: timeline.length || 7,
          status: (item.status === 'completed'
            ? 'completed'
            : item.status === 'in_progress'
            ? 'in_progress'
            : 'upcoming') as Appointment['status'],
          preCareNotes: item.preCareNotes || item.pre_care_notes || item.preInstructions || item.pre_instructions || ['Fasting 2 hours prior to procedure', 'Avoid cold drinks'],
          postCareNotes: item.postCareNotes || item.post_care_notes || item.postInstructions || item.post_instructions || ['Warm liquid diet only (Peya)', 'Avoid direct wind and sun'],
          therapistNotesSummary: item.therapistNotesSummary || item.therapist_notes_summary || 'Chamber prepared with warm medicated oils.',
          hasFeedback: item.hasFeedback || item.has_feedback || !!item.feedbackId || !!item.feedback_id,
          feedbackId: item.feedbackId || item.feedback_id,
          feedbackSubmitted: item.feedbackSubmitted ?? item.feedback_submitted ?? false,
          feedbackRating: item.feedback?.rating || (item.feedbackSubmitted ? 5 : undefined),
          canReschedule: item.canReschedule ?? item.can_reschedule ?? true,
        }));
      },
      providesTags: ['PatientAppointments', 'PatientDashboard'],
    }),

    // 6. Get Single Appointment Detail
    getAppointmentDetail: builder.query<Appointment | null, string>({
      query: (appointmentId) => {
        const id = localStorage.getItem('userId') || '';
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
          patientId: response.patientInfo?.id || response.patient_info?.id || localStorage.getItem('userId') || '',
          date: found.date || found.scheduledDate || found.scheduled_date || new Date().toISOString().split('T')[0],
          time: found.time || found.scheduledTime || found.scheduled_time || '10:00 AM',
          durationMinutes: found.durationMinutes || found.duration_minutes || 60,
          therapistId: found.therapistId || found.therapist_id || '',
          therapistName: found.therapistName || found.therapist_name || 'Assigned Therapist',
          therapistPhone: found.therapistPhone || found.therapist_phone || '',
          roomNumber: found.roomNumber || found.roomName || found.room_name || 'Droni Suite 1',
          stageName: found.stageName || found.stage_name || found.stageCategory || 'Poorvakarma',
          stageCategory: found.stageCategory || found.stage_type || 'Poorvakarma',
          dayNumber: found.dayNumber || found.day_number || 1,
          totalDays: timeline.length || 7,
          status: (found.status === 'completed'
            ? 'completed'
            : found.status === 'in_progress'
            ? 'in_progress'
            : 'upcoming') as Appointment['status'],
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

    // 7. Get Prescriptions & AI Diet Plan
    getMyPrescriptions: builder.query<PrescriptionData, string | void>({
      query: (patientId) => {
        const id =
          patientId && patientId !== 'PT-104' && patientId !== 'default'
            ? patientId
            : localStorage.getItem('userId') || '';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const pInfo = response.patientInfo || response.patient_info || {};
        const diet = response.dietPlan || response.diet_plan || {};
        const meds = response.medications || [];

        return {
          patientId: pInfo.id || localStorage.getItem('userId') || '',
          patientName: pInfo.name || localStorage.getItem('name') || 'Patient',
          doctorName: pInfo.doctorName || pInfo.doctor_name || 'Supervising Doctor',
          issuedDate: new Date().toISOString().split('T')[0],
          validTill: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          dietPlan: {
            id: 'DIET-01',
            planTitle: diet.planTitle || 'AI & Doctor Prescribed Ayurvedic Diet Plan',
            doshaTarget: diet.doshaTarget || `${pInfo.confirmed_dosha || 'Prakriti'} Pacifying Protocol`,
            assignedByDoctor: pInfo.doctorName || pInfo.doctor_name || 'Supervising Doctor',
            assignedDate: new Date().toISOString().split('T')[0],
            dietaryGuidelines: diet.dietaryGuidelines || [
              'All meals must be consumed warm and freshly prepared.',
              'Maintain a 4-hour gap between primary meals to allow complete digestion.',
              'Incorporate mild warming digestive spices like ginger, cumin, and black pepper.',
            ],
            mealPlan: [
              {
                mealTime: 'Morning Breakfast',
                timeRange: '08:00 AM - 08:30 AM',
                items: ['Warm Rice Gruel (Peya) with grated ginger', '1 tsp Medicated Ghee'],
                precautions: 'No cold milk or raw fruits during Poorvakarma',
              },
              {
                mealTime: 'Lunch (Main Meal)',
                timeRange: '12:30 PM - 01:15 PM',
                items: ['Steamed Shali Rice with Moong Dal broth', 'Boiled tender sweet gourd'],
                precautions: 'Consume lukewarm CCF water 30 mins after lunch',
              },
              {
                mealTime: 'Evening Dinner',
                timeRange: '07:30 PM - 08:00 PM',
                items: ['Light Barley soup (Yusha) with roasted jeera'],
                precautions: 'Finish dinner at least 2 hours prior to sleep',
              },
            ],
            forbiddenFoods: diet.forbiddenFoods || [
              'Sour Yogurt / Curd (Dahi) especially during evening',
              'Cold water, ice creams, and refrigerated beverages',
              'Deep fried, heavy, and processed junk food',
            ],
            permittedDrinks: diet.permittedDrinks || [
              'Lukewarm water boiled with Cumin & Fennel seeds',
              'Fresh Takra (Spiced Buttermilk with roasted cumin)',
              'Herbal CCF infusion',
            ],
            lifestyleTips: diet.lifestyleTips || [
              'Sleep by 10:00 PM and wake up before sunrise.',
              'Avoid strenuous exercise during active Panchakarma detox days.',
            ],
          },
          medications: meds.map((m: any, idx: number) => ({
            id: m.id || `MED-${idx + 1}`,
            name: m.name || 'Guggulutiktaka Ghritam',
            dosage: m.dosage || '15ml',
            frequency: m.frequency || 'Twice Daily',
            timing: (m.timing || 'Before Meals') as any,
            duration: m.duration || '7 Days',
            instructions: `Take with ${m.anupana || 'warm water'}`,
            anupana: m.anupana || 'Lukewarm water',
          })),
          generalPrecautions: [
            'Maintain strict adherence to meal timings.',
            'Avoid direct exposure to heavy wind and air conditioning.',
          ],
        };
      },
      providesTags: ['PatientDashboard'],
    }),

    // 8. Get Patient Profile
    getMyProfile: builder.query<PatientProfile, string | void>({
      query: (patientId) => {
        const id =
          patientId && patientId !== 'PT-104' && patientId !== 'default'
            ? patientId
            : localStorage.getItem('userId') || '';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const p = response.patientInfo || response.patient_info || {};
        const firstSession = response.sessionsTimeline?.[0] || {};
        return {
          id: p.id || localStorage.getItem('userId') || '',
          name: p.name || localStorage.getItem('name') || 'Patient',
          age: p.age || 35,
          gender: (p.gender || 'Male') as any,
          contact: p.phone || p.contact || '',
          email: p.email || localStorage.getItem('email') || '',
          address: 'Registered Patient',
          prakritiType: (p.prakritiType || p.confirmed_dosha || 'Prakriti Assessment') as any,
          vikriti: p.diagnosis || 'Therapy in progress',
          allergies: ['None declared'],
          medicalConditions: [p.chiefComplaint || p.chief_complaint || 'Clinical evaluation'],
          precautions: ['Avoid sudden cold temperatures', 'Strict warm liquid diet during Poorvakarma'],
          assignedDoctor: {
            id: 'DOC-01',
            name: p.doctorName || p.doctor_name || 'Supervising Doctor',
            specialty: 'Chief Panchakarma Physician',
            qualification: 'BAMS, MD (Ayurveda Panchakarma)',
            email: 'doctor@ayursutra.com',
            phone: '',
          },
          assignedTherapist: {
            id: firstSession.therapistId || firstSession.therapist_id || '',
            name: firstSession.therapistName || firstSession.therapist_name || 'Assigned Therapist',
            specialty: 'Certified Panchakarma Therapist',
            experienceYears: 5,
            email: '',
            phone: firstSession.therapistPhone || firstSession.therapist_phone || '',
            gender: 'Female',
          },
          emergencyContact: {
            name: 'Emergency Contact',
            relation: 'Family',
            phone: p.phone || '',
          },
          memberSince: 'August 2026',
        };
      },
      providesTags: ['PatientDashboard'],
    }),
  }),
});

export const {
  useGetPatientDashboardQuery,
  useSubmitFeedbackMutation,
  useGetPatientFeedbackQuery,
  useGetMyTherapyPlanQuery,
  useGetMyAppointmentsQuery,
  useGetAppointmentDetailQuery,
  useGetMyPrescriptionsQuery,
  useGetMyProfileQuery,
} = patientApi;
