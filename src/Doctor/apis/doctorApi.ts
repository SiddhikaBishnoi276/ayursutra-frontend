// src/Doctor/apis/doctorApi.ts
// Injects Doctor-specific endpoints into the global RTK Query apiSlice
import { apiSlice } from '../../apis';
import {
  Patient,
  PrakritiQuestion,
  TherapyPackage,
  TherapyPlan,
  AIDietCarePlan,
  ProgressPoint,
  ComparativeOutcomeReport,
  Therapist,
} from '../types/doctor.types';

import patientsMock from '../data/patients.json';
import questionsMock from '../data/prakritiQuestions.json';
import packagesMock from '../data/therapyPackages.json';
import therapistsMock from '../data/therapists.json';
import progressMock from '../data/progressData.json';

// In-memory persistent state for prototype session
let activePatients: Patient[] = [...(patientsMock as Patient[])];
let activePackages: TherapyPackage[] = [...(packagesMock as TherapyPackage[])];
let activePlans: Record<string, TherapyPlan> = {};
let activeDietPlans: Record<string, AIDietCarePlan> = {
  'PAT-101': {
    id: 'DIET-101',
    patientId: 'PAT-101',
    isApproved: false,
    generatedDate: '2026-08-20',
    caloricTarget: 1850,
    stages: [
      {
        stageName: 'Poorvakarma Preparation (Deepana & Pachana)',
        stageCategory: 'Poorvakarma',
        pathyaFoods: [
          'Warm Ginger-Cumin Infusion (Shadanga Paniya)',
          'Light Moong Dal Soup seasoned with rock salt & hing',
          'Steamed red rice with 1 tsp medicated ghee',
          'Cooked leafy greens (Methi, Palak in light cumin tadka)'
        ],
        apathyaFoods: [
          'Cold and refrigerated beverages',
          'Heavy fermented items (Dosa, Idli, Curd)',
          'Fried snacks, bakery goods & refined sugar',
          'Raw salad and dry legumes (Chana, Rajma)'
        ],
        yogaAsanas: [
          'Pawanmuktasana (Wind-relieving posture) - 5 mins',
          'Vajrasana post meals - 10 mins',
          'Cat-Cow Stretch (Marjariasana) - 5 mins'
        ],
        pranayama: [
          'Nadi Shodhana (Alternate nostril breathing) - 10 mins',
          'Bhastrika (Gentle rhythm) - 5 mins'
        ],
        hydrationNotes: 'Drink minimum 2.5L lukewarm water boiled with ginger & coriander seeds.'
      },
      {
        stageName: 'Pradhanakarma Main Procedure Karma (Virechana / Basti)',
        stageCategory: 'Pradhanakarma',
        pathyaFoods: [
          'Manda (Thin rice water gruel with pinch of Saindhava)',
          'Peya (Semisolid light rice porridge)',
          'Clear pomegranate juice (non-chilled, unsweetened)',
          'Warm boiled water sips at 30 min intervals'
        ],
        apathyaFoods: [
          'All solid foods and fiber during purgation window',
          'Oils, butter, milk, cheese, and heavy dairy',
          'Spicy condiments, pickles, and pungent chilies',
          'Daytime sleep immediately following the procedure'
        ],
        yogaAsanas: [
          'Complete physical bed rest during evacuation phase',
          'Gentle Shavasana (Corpse pose with warm blanket)',
          'Mild Supta Baddha Konasana with bolster support'
        ],
        pranayama: [
          'Slow deep diaphragmatic breath (Dirgha Pranayama)',
          'Sheetali / Sheetkari (if excess Pitta heat occurs)'
        ],
        hydrationNotes: 'Warm water sips only upon thirst. Avoid force-feeding.'
      },
      {
        stageName: 'Paschatkarma Rehabilitation (Samsarjana & Rasayana)',
        stageCategory: 'Paschatkarma',
        pathyaFoods: [
          'Vilepi (Thick rice porridge with small drop of ghee)',
          'Akrita Yusha (Unseasoned moong soup) transitioning to Krita Yusha',
          'Shali rice with boiled bottle gourd / pumpkin subzi',
          'Amla preserve (Chyawanprash / Amalaki Rasayana) with warm milk'
        ],
        apathyaFoods: [
          'Excessive salt, sour tamarind, vinegar & spicy masala',
          'Direct cold air drafts and loud environments',
          'Strenuous weight lifting and travel',
          'Irregular meal times'
        ],
        yogaAsanas: [
          'Tadasana (Gentle spinal alignment)',
          'Bhujangasana (Low Cobra pose) - 3 reps',
          'Setu Bandhasana (Supported Bridge)'
        ],
        pranayama: [
          'Anulom Vilom - 15 mins daily',
          'Brahmari Pranayama - 7 cycles for nervous recovery'
        ],
        hydrationNotes: 'Warm copper-infused water. Herbal infusion of Tulsi & Yashtimadhu.'
      }
    ]
  }
};

let activeProgress = { ...progressMock };

export const doctorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Patients List
    getPatients: builder.query<Patient[], void>({
      queryFn: () => ({ data: activePatients }),
      providesTags: ['DoctorPatients'],
    }),

    // 2. Add New Patient (Intake)
    addPatientIntake: builder.mutation<Patient, Partial<Patient>>({
      queryFn: (newPatient) => {
        const patientId = `PAT-${100 + activePatients.length + 1}`;
        const patientRecord: Patient = {
          id: patientId,
          name: newPatient.name || 'New Patient',
          age: newPatient.age || 35,
          gender: newPatient.gender || 'Female',
          contact: newPatient.contact || '+91 98765 00000',
          email: newPatient.email,
          chiefComplaint: newPatient.chiefComplaint || 'Clinical evaluation',
          diagnosis: newPatient.diagnosis || 'Prakriti Pariksha Needed',
          status: 'new',
          onboardedDate: new Date().toISOString().split('T')[0],
        };
        activePatients = [patientRecord, ...activePatients];
        return { data: patientRecord };
      },
      invalidatesTags: ['DoctorPatients'],
    }),

    // 3. Get Prakriti Question Bank
    getPrakritiQuestions: builder.query<PrakritiQuestion[], void>({
      queryFn: () => ({ data: questionsMock as PrakritiQuestion[] }),
    }),

    // 4. Lock Prakriti
    lockPrakriti: builder.mutation<
      Patient,
      { patientId: string; dominantPrakriti: string; notes?: string }
    >({
      queryFn: ({ patientId, dominantPrakriti }) => {
        activePatients = activePatients.map((p) =>
          p.id === patientId
            ? { ...p, dominantPrakriti, status: 'prakriti_confirmed' }
            : p
        );
        const updated = activePatients.find((p) => p.id === patientId)!;
        return { data: updated };
      },
      invalidatesTags: ['DoctorPatients'],
    }),

    // 5. Get Therapy Packages
    getTherapyPackages: builder.query<TherapyPackage[], void>({
      queryFn: () => ({ data: activePackages }),
      providesTags: ['Package'],
    }),

    // 6. Create / Standardize Therapy Package
    createTherapyPackage: builder.mutation<TherapyPackage, Partial<TherapyPackage>>({
      queryFn: (pkg) => {
        const newPkg: TherapyPackage = {
          id: `PKG-0${activePackages.length + 1}`,
          name: pkg.name || 'Custom Therapy Protocol',
          description: pkg.description || 'Doctor authored clinical package.',
          targetDosha: pkg.targetDosha || 'Tridoshic',
          durationDays: pkg.durationDays || 7,
          stages: pkg.stages || [],
          baseDietGuidelines: pkg.baseDietGuidelines || '',
          isStandard: false,
        };
        activePackages = [newPkg, ...activePackages];
        return { data: newPkg };
      },
      invalidatesTags: ['Package'],
    }),

    // 7. Get Therapists
    getTherapists: builder.query<Therapist[], void>({
      queryFn: () => ({ data: therapistsMock as Therapist[] }),
    }),

    // 8. Create Therapy Plan
    createTherapyPlan: builder.mutation<
      TherapyPlan,
      {
        patientId: string;
        packageId: string;
        packageName: string;
        startDate: string;
        stages: any[];
        assignedTherapistId: string;
        medicines: any[];
        customDietNotes: string;
        mode: 'clinic' | 'solo';
      }
    >({
      queryFn: (planData) => {
        const planId = `PLAN-${Date.now().toString().slice(-4)}`;
        const totalDays = planData.stages.reduce(
          (acc, s) => acc + (s.durationDays || 1),
          0
        );

        const newPlan: TherapyPlan = {
          id: planId,
          patientId: planData.patientId,
          packageId: planData.packageId,
          packageName: planData.packageName,
          startDate: planData.startDate,
          endDate: new Date(
            new Date(planData.startDate).getTime() +
              totalDays * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
          totalDays,
          stages: planData.stages,
          assignedTherapistId: planData.assignedTherapistId,
          medicines: planData.medicines,
          customDietNotes: planData.customDietNotes,
          mode: planData.mode,
          createdAt: new Date().toISOString(),
        };

        activePlans[planData.patientId] = newPlan;

        // Auto-generate AI care plan for this patient if not present
        if (!activeDietPlans[planData.patientId]) {
          activeDietPlans[planData.patientId] = {
            id: `DIET-${planData.patientId}`,
            patientId: planData.patientId,
            isApproved: false,
            generatedDate: new Date().toISOString().split('T')[0],
            caloricTarget: 1800,
            stages: activeDietPlans['PAT-101']?.stages || [],
          };
        }

        // Update patient assigned package
        activePatients = activePatients.map((p) =>
          p.id === planData.patientId
            ? {
                ...p,
                assignedPackageId: planData.packageId,
                assignedPackageName: planData.packageName,
                totalDays,
              }
            : p
        );

        return { data: newPlan };
      },
      invalidatesTags: ['DoctorPatients', 'DoctorPlan'],
    }),

    // 9. Get AI Diet & Yoga Plan
    getAIDietPlan: builder.query<AIDietCarePlan | null, string>({
      queryFn: (patientId) => {
        let diet = activeDietPlans[patientId];
        if (!diet) {
          const patient = activePatients.find((p) => p.id === patientId);
          const isPitta = (patient?.dominantPrakriti || patient?.diagnosis || '').toLowerCase().includes('pitta');
          const isKapha = (patient?.dominantPrakriti || patient?.diagnosis || '').toLowerCase().includes('kapha');

          diet = {
            id: `DIET-${patientId.replace(/[^0-9]/g, '') || '101'}`,
            patientId,
            isApproved: false,
            generatedDate: new Date().toISOString().split('T')[0],
            caloricTarget: isPitta ? 1900 : isKapha ? 1650 : 1850,
            stages: [
              {
                stageName: 'Poorvakarma Preparation (Deepana & Pachana)',
                stageCategory: 'Poorvakarma',
                pathyaFoods: isPitta
                  ? [
                      'Cooling Coriander & Fennel Infusion (Dhanyaka Paniya)',
                      'Mung Bean & Sweet Gourd Soup with light cow ghee',
                      'Cooked red basmati rice with mild herbs',
                      'Steamed spinach and tender zucchini',
                    ]
                  : [
                      'Warm Ginger-Cumin Infusion (Shadanga Paniya)',
                      'Light Moong Dal Soup seasoned with rock salt & hing',
                      'Steamed red rice with 1 tsp medicated ghee',
                      'Cooked leafy greens (Methi, Palak in light cumin)',
                    ],
                apathyaFoods: isPitta
                  ? [
                      'Spicy red chillies, vinegar & mustard seeds',
                      'Sour curd, citrus fruits & fermented batter',
                      'Fried oily items & refined sugars',
                      'Direct hot sunlight exposure & caffeine',
                    ]
                  : [
                      'Cold and refrigerated beverages',
                      'Heavy fermented items (Dosa, Idli, Curd)',
                      'Fried snacks, bakery goods & refined sugar',
                      'Raw salad and dry legumes (Chana, Rajma)',
                    ],
                yogaAsanas: isPitta
                  ? [
                      'Sheetali Pranayama - 10 mins',
                      'Chandra Bhedana & Balasana - 10 mins',
                      'Gentle Matsyasana - 5 mins',
                    ]
                  : [
                      'Pawanmuktasana - 5 mins',
                      'Vajrasana post meals - 10 mins',
                      'Cat-Cow Stretch (Marjariasana) - 5 mins',
                    ],
                pranayama: isPitta
                  ? ['Sheetali Pranayama - 10 mins', 'Nadi Shodhana - 10 mins']
                  : ['Nadi Shodhana - 10 mins', 'Bhastrika - 5 mins'],
                hydrationNotes: isPitta
                  ? 'Drink minimum 2.5L lukewarm water boiled with vetiver (Ushira) and coriander seeds.'
                  : 'Drink minimum 2.5L lukewarm water boiled with dry ginger & cumin.',
              },
              {
                stageName: 'Pradhanakarma Main Procedure Karma',
                stageCategory: 'Pradhanakarma',
                pathyaFoods: [
                  'Clear Rice Soup (Manda & Peya) on empty stomach',
                  'Thin Vilepi (thickened rice gruel) after procedure',
                  'Lukewarm water in small sips throughout day',
                  'Sips of Shadanga Paniya decoction',
                ],
                apathyaFoods: [
                  'All solid grains, spices, milk, or curd',
                  'Cold liquids, raw vegetables or fruits',
                  'Physical exertion, heavy talking, day sleep',
                  'Exposure to breeze or air conditioning',
                ],
                yogaAsanas: [
                  'Restorative Savasana with knee bolster',
                  'Subtle gentle diaphragmatic breathing only',
                ],
                pranayama: ['Slow Sahaja Pranayama - 10 mins in supine posture'],
                hydrationNotes: 'Strictly lukewarm water only after natural urge (Vega) completes.',
              },
              {
                stageName: 'Paschatkarma Rehabilitation (Samsarjana Krama)',
                stageCategory: 'Paschatkarma',
                pathyaFoods: [
                  'Gradual Manda → Peya → Vilepi → Yusha meal ladder',
                  'Light mung dal broth with rock salt & pure cow ghee',
                  'Steamed aged Shali rice with buttermilk',
                  'Stewed sweet apple or soaked raisins',
                ],
                apathyaFoods: [
                  'Heavy protein meals (Paneer, Chana, Dal Makhani)',
                  'Reheated or leftover refrigerated food',
                  'Spicy curries, sour tomatoes, curd at night',
                  'Alcohol, smoking, and irregular meal timings',
                ],
                yogaAsanas: [
                  'Tadasana (Gentle spine lengthening) - 5 mins',
                  'Bhujangasana (Gentle cobra pose) - 5 mins',
                  'Vrikshasana (Balance pose) - 5 mins',
                ],
                pranayama: ['Nadi Shodhana - 10 mins daily', 'Brahmari - 5 mins before sleep'],
                hydrationNotes: '2.5L structured room temperature water with pinch of dry ginger.',
              },
            ],
          };
          activeDietPlans[patientId] = diet;
        }
        return { data: diet || null };
      },
      providesTags: ['DoctorDiet'],
    }),

    // 10. Approve & Dispatch AI Diet Plan
    approveAIDietPlan: builder.mutation<
      { success: boolean; patientId: string },
      string
    >({
      queryFn: (patientId) => {
        if (activeDietPlans[patientId]) {
          activeDietPlans[patientId].isApproved = true;
        }
        activePatients = activePatients.map((p) =>
          p.id === patientId
            ? {
                ...p,
                status: 'in_progress',
                currentDay: 1,
                currentStage: 'Poorvakarma',
              }
            : p
        );
        return { data: { success: true, patientId } };
      },
      invalidatesTags: ['DoctorPatients', 'DoctorDiet', 'Progress'],
    }),

    // 11. Get Progress Analytics
    getProgressAnalytics: builder.query<
      { timeline: ProgressPoint[]; comparativeReport?: ComparativeOutcomeReport },
      string
    >({
      queryFn: (patientId) => {
        const data = (activeProgress as any)[patientId] || (activeProgress as any)['PAT-101'];
        return { data: data || { timeline: [] } };
      },
      providesTags: ['Progress'],
    }),

    // 12. Record Therapy Vitals
    recordTherapyVitals: builder.mutation<
      { success: boolean },
      { patientId: string; vitals: any; type: 'baseline' | 'discharge' }
    >({
      queryFn: ({ patientId, vitals, type }) => {
        console.log(`[DOCTOR API] Recorded ${type} vitals for ${patientId}:`, vitals);
        return { data: { success: true } };
      },
      invalidatesTags: ['Progress', 'DoctorPatients'],
    }),

    // 13. Log Therapist Session
    logTherapistSession: builder.mutation<
      { success: boolean },
      { patientId: string; sessionData: Partial<ProgressPoint> }
    >({
      queryFn: ({ patientId, sessionData }) => {
        const patientData = (activeProgress as any)[patientId] || (activeProgress as any)['PAT-101'];
        if (patientData && patientData.timeline) {
          patientData.timeline.push({
            day: patientData.timeline.length + 1,
            date: new Date().toISOString().split('T')[0],
            stage: sessionData.stage || 'Pradhanakarma',
            sessionName: sessionData.sessionName || 'Panchakarma Session',
            clinicalVASScore: sessionData.clinicalVASScore || 3.0,
            patientReportedVASScore: sessionData.patientReportedVASScore || 3.5,
            pulseBpm: sessionData.pulseBpm || 72,
            bloodPressure: sessionData.bloodPressure || '120/80',
            agniStatus: sessionData.agniStatus || 'Sama',
            sleepQualityRating: sessionData.sleepQualityRating || 4,
            therapistNotes: sessionData.therapistNotes || '',
            complicationFlag: sessionData.complicationFlag || false,
          });
        }
        return { data: { success: true } };
      },
      invalidatesTags: ['Progress', 'DoctorPatients'],
    }),

    // 14. Submit Patient Feedback
    submitPatientFeedback: builder.mutation<
      { success: boolean },
      { patientId: string; feedback: any }
    >({
      queryFn: ({ patientId, feedback }) => {
        console.log(`[DOCTOR API] Patient feedback recorded for ${patientId}:`, feedback);
        return { data: { success: true } };
      },
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
