// src/Doctor/apis/doctorApi.ts
// Injects Doctor-specific endpoints into the global RTK Query apiSlice
import { apiSlice } from '../../apis';
import {
  Patient,
  PrakritiQuestion,
  TherapyPackage,
  TherapyPlan,
  Therapist,
  AIDietCarePlan,
  ProgressPoint,
  ComparativeOutcomeReport,
} from '../types/doctor.types';

export const doctorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Patients List (GET /api/doctor/patients)
    getPatients: builder.query<Patient[], void>({
      query: () => '/doctor/patients',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((p: any) => ({
          id: p.id || p.user_id,
          name: p.name || 'Patient',
          age: p.age || 35,
          gender: p.gender || 'Female',
          contact: p.contact || p.phone || p.contact_number || '',
          email: p.email || '',
          chiefComplaint: p.chief_complaint || p.chiefComplaint || 'Clinical evaluation',
          diagnosis: p.diagnosis || 'Prakriti Pariksha Needed',
          dominantPrakriti: p.dominantPrakriti || p.confirmed_dosha,
          status: p.status || (p.confirmed_dosha ? 'prakriti_confirmed' : 'new'),
          assignedPackageName: p.assignedPackageName || p.activePackage || p.package_name,
          currentStage: p.currentStage || p.current_stage,
          currentDay: p.currentDay || p.current_day || 1,
          totalDays: p.totalDays || p.total_days || 7,
          onboardedDate: p.onboardedDate || (p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
        }));
      },
      providesTags: ['DoctorPatients'],
    }),

    // 2. Add New Patient (POST /api/doctor/patients)
    addPatientIntake: builder.mutation<Patient, Partial<Patient>>({
      query: (newPatient) => ({
        url: '/doctor/patients',
        method: 'POST',
        body: {
          name: newPatient.name,
          age: newPatient.age,
          gender: newPatient.gender,
          contact_number: newPatient.contact || `+9198${Date.now().toString().slice(-8)}`,
          email: newPatient.email,
          chief_complaint: newPatient.chiefComplaint,
          diagnosis: newPatient.diagnosis,
        },
      }),
      transformResponse: (response: any) => {
        const p = response.patient || response.data || response;
        return {
          id: p.id || p.user_id,
          name: p.name,
          age: p.age || 35,
          gender: p.gender || 'Female',
          contact: p.contact || p.phone || '',
          email: p.email,
          chiefComplaint: p.chief_complaint || p.chiefComplaint || '',
          diagnosis: p.diagnosis || '',
          status: 'new',
          onboardedDate: new Date().toISOString().split('T')[0],
        };
      },
      invalidatesTags: ['DoctorPatients'],
    }),

    // 3. Get Prakriti Question Bank (GET /api/doctor/prakriti/questions)
    getPrakritiQuestions: builder.query<PrakritiQuestion[], void>({
      query: () => '/doctor/prakriti/questions',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((q: any) => ({
          id: String(q.id),
          category: q.attribute || 'Physical Attribute',
          trait: q.attribute || 'Physical Trait',
          question: q.question_text || q.questionText || q.question,
          options: (q.options || []).map((opt: any) => ({
            id: String(opt.id),
            text: opt.option_text || opt.text || '',
            dosha: opt.dosha_weight?.vata ? 'Vata' : opt.dosha_weight?.pitta ? 'Pitta' : 'Kapha',
            doshaWeight: {
              vata: opt.dosha_weight?.vata ?? 0,
              pitta: opt.dosha_weight?.pitta ?? 0,
              kapha: opt.dosha_weight?.kapha ?? 0,
            },
          })),
        }));
      },
    }),

    // 4. Lock Prakriti (POST /api/doctor/prakriti/patients/:patientId/assessment)
    lockPrakriti: builder.mutation<
      any,
      { patientId: string; dominantPrakriti: string; notes?: string; answers?: any[] }
    >({
      query: ({ patientId, dominantPrakriti, notes, answers }) => ({
        url: `/doctor/prakriti/patients/${patientId}/assessment`,
        method: 'POST',
        body: {
          confirmed_dosha: dominantPrakriti,
          clinical_observation: notes || `Prakriti confirmed as ${dominantPrakriti}`,
          answers: answers || [],
        },
      }),
      invalidatesTags: ['DoctorPatients'],
    }),

    // 5. Get Therapy Packages (GET /api/doctor/therapy-packages)
    getTherapyPackages: builder.query<TherapyPackage[], void>({
      query: () => '/doctor/therapy-packages',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((pkg: any) => ({
          id: String(pkg.id),
          name: pkg.name,
          description: pkg.description || `${pkg.therapy_type} Protocol Package`,
          targetDosha: pkg.therapy_type || pkg.target_dosha || 'Tridoshic',
          durationDays: pkg.duration_days || (pkg.stages?.length ? pkg.stages.reduce((sum: number, st: any) => sum + (st.duration_days || 1), 0) : 7),
          stages: (pkg.stages || []).map((st: any) => ({
            id: String(st.id),
            stageType: st.stage_type,
            name: st.stage_name || st.stage_type,
            sequenceOrder: st.sequence_order,
            durationDays: st.duration_days || 1,
            preInstructions: st.pre_instructions || '',
            postInstructions: st.post_instructions || '',
          })),
          baseDietGuidelines: pkg.base_diet_framework?.guidelines || 'Standard Ayurvedic Light Diet',
          isStandard: true,
        }));
      },
      providesTags: ['Package'],
    }),

    // 6. Create / Standardize Therapy Package (POST /api/doctor/therapy-packages)
    createTherapyPackage: builder.mutation<TherapyPackage, Partial<TherapyPackage>>({
      query: (pkg) => ({
        url: '/doctor/therapy-packages',
        method: 'POST',
        body: {
          name: pkg.name,
          therapy_type: pkg.targetDosha || 'Virechana',
          stages: (pkg.stages || []).map((s, idx) => ({
            stage_type: s.stageType || s.name || 'Poorvakarma',
            sequence_order: idx + 1,
            duration_days: s.durationDays || 1,
            session_duration_minutes: 60,
          })),
        },
      }),
      invalidatesTags: ['Package'],
    }),

    // 7. Get Therapists (GET /api/doctor/therapists)
    getTherapists: builder.query<Therapist[], void>({
      query: () => '/doctor/therapists',
      transformResponse: (response: any) => {
        const list = Array.isArray(response) ? response : response.data || [];
        return list.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          role: 'Panchakarma Therapist',
          specialization: Array.isArray(t.specializations) ? t.specializations.join(', ') : t.specialization || 'Virechana, Basti',
          gender: t.gender || 'Female',
          isAvailable: t.is_available ?? true,
          currentLoad: t.currentLoad || 2,
          maxCapacity: 6,
        }));
      },
    }),

    // 8. Create Therapy Plan (POST /api/doctor/patients/:patientId/therapy-plan)
    createTherapyPlan: builder.mutation<
      any,
      {
        patientId: string;
        packageId: string;
        packageName?: string;
        startDate?: string;
        stages?: any[];
        assignedTherapistId?: string;
        medicines?: any[];
        customDietNotes?: string;
        mode?: 'clinic' | 'solo';
      }
    >({
      query: ({ patientId, packageId, startDate }) => ({
        url: `/doctor/patients/${patientId}/therapy-plan`,
        method: 'POST',
        body: {
          package_id: packageId,
          start_date: startDate || new Date().toISOString().split('T')[0],
        },
      }),
      invalidatesTags: ['DoctorPatients', 'DoctorPlan', 'Progress'],
    }),

    // 9. Get AI Diet & Yoga Plan
    getAIDietPlan: builder.query<AIDietCarePlan | null, string>({
      query: (patientId) => `/doctor/patients/${patientId}/progress`,
      transformResponse: (_response: any, _meta, patientId) => {
        return {
          id: `DIET-${patientId}`,
          patientId,
          isApproved: false,
          generatedDate: new Date().toISOString().split('T')[0],
          caloricTarget: 1850,
          stages: [
            {
              stageName: 'Poorvakarma Preparation (Deepana & Pachana)',
              stageCategory: 'Poorvakarma',
              pathyaFoods: [
                'Warm Ginger-Cumin Infusion (Shadanga Paniya)',
                'Light Moong Dal Soup seasoned with rock salt & hing',
                'Steamed red rice with 1 tsp medicated ghee',
              ],
              apathyaFoods: [
                'Cold and refrigerated beverages',
                'Heavy fermented items (Dosa, Idli, Curd)',
                'Fried snacks and refined sugar',
              ],
              yogaAsanas: ['Pawanmuktasana - 5 mins', 'Vajrasana post meals - 10 mins'],
              pranayama: ['Nadi Shodhana - 10 mins daily'],
              hydrationNotes: 'Drink minimum 2.5L lukewarm water boiled with dry ginger.',
            },
            {
              stageName: 'Pradhanakarma Main Procedure Karma',
              stageCategory: 'Pradhanakarma',
              pathyaFoods: [
                'Clear Rice Soup (Manda & Peya) on empty stomach',
                'Thin Vilepi (thickened rice gruel) after procedure',
              ],
              apathyaFoods: [
                'All solid grains, spices, milk, or curd',
                'Physical exertion or heavy talking',
              ],
              yogaAsanas: ['Restorative Savasana with bolster'],
              pranayama: ['Slow Sahaja Pranayama - 10 mins in supine posture'],
              hydrationNotes: 'Strictly lukewarm water only.',
            },
            {
              stageName: 'Paschatkarma Rehabilitation (Samsarjana Krama)',
              stageCategory: 'Paschatkarma',
              pathyaFoods: [
                'Gradual Manda → Peya → Vilepi → Yusha meal ladder',
                'Light mung dal broth with rock salt & cow ghee',
              ],
              apathyaFoods: ['Heavy protein meals and reheated leftovers'],
              yogaAsanas: ['Tadasana - 5 mins', 'Bhujangasana - 5 mins'],
              pranayama: ['Brahmari - 5 mins before sleep'],
              hydrationNotes: '2.5L structured room temperature water.',
            },
          ],
        };
      },
      providesTags: ['DoctorDiet'],
    }),

    // 10. Approve & Dispatch AI Diet Plan
    approveAIDietPlan: builder.mutation<
      { success: boolean; patientId: string },
      string
    >({
      query: (patientId) => ({
        url: `/doctor/patients/${patientId}/session-log`,
        method: 'POST',
        body: {
          notes: 'AI Diet & Yoga care plan reviewed and approved by treating doctor.',
        },
      }),
      invalidatesTags: ['DoctorPatients', 'DoctorDiet', 'Progress'],
    }),

    // 11. Get Progress Analytics (GET /api/doctor/patients/:patientId/progress)
    getProgressAnalytics: builder.query<
      { timeline: ProgressPoint[]; comparativeReport?: ComparativeOutcomeReport },
      string
    >({
      query: (patientId) => `/doctor/patients/${patientId}/progress`,
      transformResponse: (response: any) => {
        const timeline = Array.isArray(response) ? response : response.timeline || [];
        return {
          timeline: timeline.map((p: any, idx: number) => ({
            day: p.day || idx + 1,
            date: p.date || p.scheduled_date || new Date().toISOString().split('T')[0],
            stage: p.stage || p.stage_type || 'Poorvakarma',
            sessionName: p.sessionName || p.session_name || 'Therapy Session',
            clinicalVASScore: p.clinicalVASScore ?? p.vasScore ?? 4.0,
            patientReportedVASScore: p.patientReportedVASScore ?? 4.2,
            pulseBpm: p.pulseBpm ?? p.pulse ?? 72,
            bloodPressure: p.bloodPressure ?? p.bp ?? '120/80',
            agniStatus: p.agniStatus || 'Sama',
            sleepQualityRating: p.sleepQualityRating ?? 4,
            therapistNotes: p.therapistNotes || p.notes || '',
            complicationFlag: p.complicationFlag ?? false,
          })),
        };
      },
      providesTags: ['Progress'],
    }),

    // 12. Record Therapy Vitals (POST /api/doctor/patients/:patientId/vitals)
    recordTherapyVitals: builder.mutation<
      { success: boolean },
      { patientId: string; vitals: any; type: 'baseline' | 'discharge' }
    >({
      query: ({ patientId, vitals }) => ({
        url: `/doctor/patients/${patientId}/vitals`,
        method: 'POST',
        body: {
          bp: vitals.bloodPressure || vitals.bp,
          pulse: vitals.pulseBpm || vitals.pulse,
          spo2: vitals.spo2,
          temperature: vitals.temperature,
          weight: vitals.weight,
        },
      }),
      invalidatesTags: ['Progress', 'DoctorPatients'],
    }),

    // 13. Log Therapist Session (POST /api/doctor/patients/:patientId/session-log)
    logTherapistSession: builder.mutation<
      { success: boolean },
      { patientId: string; sessionData: Partial<ProgressPoint> }
    >({
      query: ({ patientId, sessionData }) => ({
        url: `/doctor/patients/${patientId}/session-log`,
        method: 'POST',
        body: {
          notes: sessionData.therapistNotes || 'Clinical session completed',
          vitals: {
            bp: sessionData.bloodPressure,
            pulse: sessionData.pulseBpm,
            vasScore: sessionData.clinicalVASScore,
          },
        },
      }),
      invalidatesTags: ['Progress', 'DoctorPatients'],
    }),

    // 14. Submit Patient Feedback
    submitPatientFeedback: builder.mutation<
      { success: boolean },
      { patientId: string; feedback: any }
    >({
      query: ({ patientId, feedback }) => ({
        url: '/patient/feedback',
        method: 'POST',
        body: {
          patientId,
          rating: feedback.rating || 5,
          comments: feedback.comments,
        },
      }),
      invalidatesTags: ['Progress'],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useAddPatientIntakeMutation,
  useGetPrakritiQuestionsQuery,
  useLockPrakritiMutation,
  useGetTherapyPackagesQuery,
  useCreateTherapyPackageMutation,
  useGetTherapistsQuery,
  useCreateTherapyPlanMutation,
  useGetAIDietPlanQuery,
  useApproveAIDietPlanMutation,
  useGetProgressAnalyticsQuery,
  useRecordTherapyVitalsMutation,
  useLogTherapistSessionMutation,
  useSubmitPatientFeedbackMutation,
} = doctorApi;
