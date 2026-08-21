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
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
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
          patientId: ('patientId' in payload && payload.patientId) ? payload.patientId : localStorage.getItem('userId') || 'PT-104',
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
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/feedback/${id}`;
      },
      providesTags: ['PatientDashboard', 'PatientFeedback'],
    }),

    // 4. Get Patient Active Therapy Plan (Mapped from Dashboard)
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
        const remainingSessions = Math.max(0, totalSessions - completedSessions);
        const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

        const stagesList = (timeline || []).map((t: any, idx: number) => ({
          stageId: String(t.id || t.sessionId || t.session_id || `STG-${idx + 1}`),
          stageName: t.stageName || t.stage_name || t.stageCategory || 'Therapy Procedure',
          stageCategory: t.stageCategory || t.stage_type || 'Poorvakarma',
          dayNumber: t.dayNumber || t.day_number || idx + 1,
          totalDays: totalSessions,
          status: (t.status === 'completed' ? 'completed' : t.status === 'in_progress' ? 'in_progress' : 'upcoming') as any,
          scheduledDate: t.date || t.scheduledDate || t.scheduled_date || '2026-08-20',
          scheduledTime: t.time || '10:00 AM',
          therapistName: t.therapistName || t.therapist_name || 'Therapist',
          roomNumber: t.roomNumber || t.roomName || t.room_name || 'Droni Suite 1',
          durationMinutes: t.durationMinutes || t.duration_minutes || 90,
          purpose: t.stageName || t.stage_name || 'Classical detoxification & tissue nourishment',
          preCareInstructions: t.preCareNotes || t.pre_care_notes || ['Fasting 2 hours prior to procedure'],
          postCareInstructions: t.postCareNotes || t.post_care_notes || ['Rest in warm chamber and consume warm gruel'],
          herbsAndMaterials: ['Medicated Herbal Taila', 'Saindhava Lavana'],
        }));

        return {
          planId: pInfo.id || 'PLAN-01',
          patientId: pInfo.id || 'PT-104',
          patientName: pInfo.name || 'Patient',
          packageName: pInfo.activePackage || pInfo.package_name || '7-Day Classical Virechana Protocol',
          condition: pInfo.diagnosis || 'Vata-Kapha imbalance & joint stiffness',
          startDate: timeline[0]?.date || '2026-08-20',
          endDate: timeline[timeline.length - 1]?.date || '2026-08-27',
          totalSessions,
          completedSessions,
          remainingSessions,
          progressPercent,
          doctorName: pInfo.doctorName || pInfo.doctor_name || 'Dr. Suresh Menon',
          doctorSpecialty: 'Senior Panchakarma Specialist (BAMS, MD Ayu)',
          stages: stagesList,
          currentStageIndex: Math.min(completedSessions, totalSessions - 1),
          currentStageName: stagesList[Math.min(completedSessions, totalSessions - 1)]?.stageName || 'Snehana',
        };
      },
      providesTags: ['PatientPlan', 'PatientDashboard'],
    }),

    // 5. Get Patient Appointments Timeline (Mapped from Dashboard)
    getMyAppointments: builder.query<Appointment[], string | void>({
      query: (patientId) => {
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const timeline = response.sessionsTimeline || response.sessions_timeline || [];
        return timeline.map((item: any, idx: number) => ({
          id: String(item.id || item.sessionId || item.session_id || `APT-${idx + 1}`),
          sessionId: String(item.sessionId || item.session_id || item.id || `SES-${idx + 1}`),
          patientId: response.patientInfo?.id || response.patient_info?.id || 'PT-104',
          date: item.date || item.scheduledDate || item.scheduled_date || '2026-08-20',
          time: item.time || '10:00 AM',
          durationMinutes: item.durationMinutes || item.duration_minutes || 90,
          therapistId: item.therapistId || item.therapist_id || 'TH-01',
          therapistName: item.therapistName || item.therapist_name || 'Priya Nair',
          therapistPhone: item.therapistPhone || item.therapist_phone || '+91-9876543210',
          roomNumber: item.roomNumber || item.roomName || item.room_name || 'Droni Suite 1',
          stageName: item.stageName || item.stage_name || item.stageCategory || 'Poorvakarma',
          stageCategory: item.stageCategory || item.stage_type || 'Poorvakarma',
          dayNumber: item.dayNumber || item.day_number || idx + 1,
          totalDays: timeline.length || 7,
          status: (item.status === 'completed' ? 'completed' : item.status === 'in_progress' ? 'upcoming' : 'upcoming') as Appointment['status'],
          preCareNotes: item.preCareNotes || item.pre_care_notes || ['Fasting 2 hours prior to procedure', 'Avoid cold drinks'],
          postCareNotes: item.postCareNotes || item.post_care_notes || ['Warm liquid diet only (Peya)', 'Avoid direct wind and sun'],
          therapistNotesSummary: item.therapistNotesSummary || item.therapist_notes_summary || 'Chamber prepared with warm medicated oils.',
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
          patientId: response.patientInfo?.id || response.patient_info?.id || 'PT-104',
          date: found.date || found.scheduledDate || found.scheduled_date || '2026-08-20',
          time: found.time || '10:00 AM',
          durationMinutes: found.durationMinutes || found.duration_minutes || 90,
          therapistId: found.therapistId || found.therapist_id || 'TH-01',
          therapistName: found.therapistName || found.therapist_name || 'Therapist',
          therapistPhone: found.therapistPhone || found.therapist_phone || '+91-9876543210',
          roomNumber: found.roomNumber || found.roomName || found.room_name || 'Droni Suite 1',
          stageName: found.stageName || found.stage_name || found.stageCategory || 'Poorvakarma',
          stageCategory: found.stageCategory || found.stage_type || 'Poorvakarma',
          dayNumber: found.dayNumber || found.day_number || 1,
          totalDays: timeline.length || 7,
          status: (found.status === 'completed' ? 'completed' : 'upcoming') as Appointment['status'],
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
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const pInfo = response.patientInfo || response.patient_info || {};
        const diet = response.dietPlan || response.diet_plan || {};
        const meds = response.medications || [];

        return {
          patientId: pInfo.id || 'PT-104',
          patientName: pInfo.name || 'Amit Sharma',
          doctorName: pInfo.doctorName || pInfo.doctor_name || 'Dr. Suresh Menon',
          issuedDate: '2026-08-20',
          validTill: '2026-08-27',
          dietPlan: {
            id: 'DIET-01',
            planTitle: diet.planTitle || 'AI & Doctor Prescribed Vata-Kapha Pacifying Diet',
            doshaTarget: diet.doshaTarget || 'Vata-Kapha Balance',
            assignedByDoctor: pInfo.doctorName || pInfo.doctor_name || 'Dr. Suresh Menon',
            assignedDate: '2026-08-20',
            dietaryGuidelines: diet.dietaryGuidelines || [
              'All meals must be consumed warm and freshly prepared within 3 hours of cooking.',
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
        const id = patientId || localStorage.getItem('userId') || 'PT-104';
        return `/patient/dashboard/${id}`;
      },
      transformResponse: (response: any) => {
        const p = response.patientInfo || response.patient_info || {};
        return {
          id: p.id || 'PT-104',
          name: p.name || 'Amit Sharma',
          age: p.age || 34,
          gender: (p.gender || 'Male') as any,
          contact: p.phone || p.contact || '+91-9876543210',
          email: p.email || 'patient@ayursutra.com',
          address: '42, Heritage Enclave, Indiranagar, Bengaluru',
          prakritiType: (p.prakritiType || p.confirmed_dosha || 'Vata-Kapha') as any,
          vikriti: 'Elevated Vata in lumbar region',
          allergies: ['Shellfish', 'Dust mites'],
          medicalConditions: ['Lumbar Spondylosis', 'Occasional insomnia'],
          precautions: ['Avoid sudden cold temperatures', 'Strict warm liquid diet during Poorvakarma'],
          assignedDoctor: {
            id: 'DOC-01',
            name: p.doctorName || p.doctor_name || 'Dr. Suresh Menon',
            specialty: 'Chief Panchakarma Physician',
            qualification: 'BAMS, MD (Ayurveda Panchakarma)',
            email: 'dr.suresh@ayursutra.com',
            phone: '+91-9845012345',
          },
          assignedTherapist: {
            id: 'TH-01',
            name: 'Priya Nair',
            specialty: 'Senior Panchakarma Therapist (Snehadhara Specialist)',
            experienceYears: 6,
            email: 'priya.nair@ayursutra.com',
            phone: '+91-9876543210',
            gender: 'Female',
          },
          emergencyContact: {
            name: 'Ananya Sharma',
            relation: 'Spouse',
            phone: '+91-9876599999',
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
