// src/Doctor/Hooks/useTherapyPlanBuilder.ts
import { useState, useMemo, useEffect } from 'react';
import {
  useGetTherapyPackagesQuery,
  useGetTherapistsQuery,
  useCreateTherapyPlanMutation,
} from '../apis/doctorApi';
import {
  TherapyPackage,
  TherapyStage,
  Therapist,
  MedicinePrescription,
  TherapyPlan,
} from '../types/doctor.types';

export interface UseTherapyPlanBuilderProps {
  patientId: string;
  patientName?: string;
  patientContact?: string;
  patientGender?: string;
  patientDiagnosis?: string;
  patientPrakriti?: string;
  initialPackageId?: string;
  mode?: 'clinic' | 'solo';
}

export function useTherapyPlanBuilder({
  patientId,
  patientName = 'Rahul Verma',
  patientContact = '+91 98765 43210',
  patientGender = 'Male',
  patientDiagnosis = '',
  patientPrakriti = '',
  initialPackageId,
  mode = 'clinic',
}: UseTherapyPlanBuilderProps) {
  const { data: packages = [] } = useGetTherapyPackagesQuery();
  const { data: therapists = [] } = useGetTherapistsQuery();
  const [createPlanMutation, { isLoading: isSubmitting }] = useCreateTherapyPlanMutation();

  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || 'PKG-01');
  const [customStages, setCustomStages] = useState<TherapyStage[]>([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [customDietNotes, setCustomDietNotes] = useState(
    'Strictly avoid day sleep and refrigerated liquids. Drink warm water.'
  );

  const [dietItems, setDietItems] = useState<string[]>([
    'Warm ginger infusion (Shadanga Paniya)',
    'Light moong dal khichdi',
    'Cooked green vegetables',
  ]);

  const [medicines, setMedicines] = useState<MedicinePrescription[]>([
    {
      id: 'MED-01',
      medicineName: 'Yograj Guggulu',
      dosage: '2 Tablets (500mg)',
      frequency: 'Twice Daily',
      timing: 'After Meals',
      instructions: 'Take with warm water',
    },
    {
      id: 'MED-02',
      medicineName: 'Sahacharadi Kashayam',
      dosage: '15ml with 45ml warm water',
      frequency: 'Twice Daily',
      timing: 'Empty Stomach',
      instructions: 'Drink at 07:00 AM and 05:00 PM',
    },
  ]);

  const [createdPlan, setCreatedPlan] = useState<TherapyPlan | null>(null);

  // Sync package if initialPackageId changes or if a new patient with a specific diagnosis/prakriti is selected
  useEffect(() => {
    if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
    } else if (packages.length > 0 && (patientDiagnosis || patientPrakriti)) {
      // Find best match package
      const dLower = (patientDiagnosis + ' ' + patientPrakriti).toLowerCase();
      let matched = packages[0]?.id || 'PKG-01';
      if (dLower.includes('katigraha') || dLower.includes('back') || dLower.includes('vata')) {
        matched = 'PKG-02';
      } else if (dLower.includes('eczema') || dLower.includes('skin') || dLower.includes('pitta')) {
        matched = 'PKG-01';
      } else if (dLower.includes('sinus') || dLower.includes('kapha') || dLower.includes('nasya')) {
        matched = 'PKG-03';
      }
      setSelectedPackageId(matched);
    }
  }, [patientId, initialPackageId, packages, patientDiagnosis, patientPrakriti]);

  const activePackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  // Sync stages when active package changes
  useEffect(() => {
    if (activePackage && activePackage.stages) {
      setCustomStages(activePackage.stages);
    }
  }, [activePackage]);

  // Therapist ranking based on specialization, gender matching, and workload
  const rankedTherapists = useMemo(() => {
    return therapists
      .map((t) => {
        let score = 50;
        if (t.isAvailable) score += 20;
        if (patientGender && t.gender.toLowerCase() === patientGender.toLowerCase()) score += 25; // gender continuity
        if (t.activeWorkload <= 2) score += 15; // low workload
        score += t.rating * 5;
        return { ...t, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [therapists, patientGender]);

  // Sync top therapist on patient switch or therapists load
  useEffect(() => {
    if (rankedTherapists.length > 0) {
      setSelectedTherapistId(rankedTherapists[0].id);
    } else if (therapists.length > 0) {
      setSelectedTherapistId(therapists[0].id);
    }
  }, [rankedTherapists, therapists]);

  const updateStageDuration = (stageId: string, deltaDays: number) => {
    setCustomStages((prev) =>
      prev.map((s) =>
        s.id === stageId
          ? { ...s, durationDays: Math.max(1, s.durationDays + deltaDays) }
          : s
      )
    );
  };

  const addDietItem = (item: string) => {
    if (item.trim()) setDietItems((prev) => [...prev, item.trim()]);
  };

  const removeDietItem = (index: number) => {
    setDietItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addMedicine = (med: MedicinePrescription) => {
    setMedicines((prev) => [...prev, med]);
  };

  const removeMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const confirmAndDispatchPlan = async () => {
    if (!activePackage) return null;

    const plan = await createPlanMutation({
      patientId,
      packageId: activePackage.id,
      packageName: activePackage.name,
      startDate,
      stages: customStages,
      assignedTherapistId: mode === 'solo' ? 'DOCTOR-SELF' : (selectedTherapistId || (therapists[0]?.id)),
      medicines,
      customDietNotes: `${customDietNotes} | Diet: ${dietItems.join(', ')}`,
      mode,
    }).unwrap();

    setCreatedPlan(plan);
    return plan;
  };


  return {
    packages,
    activePackage,
    selectedPackageId,
    setSelectedPackageId,
    customStages,
    updateStageDuration,
    therapists,
    rankedTherapists,
    selectedTherapistId,
    setSelectedTherapistId,
    startDate,
    setStartDate,
    customDietNotes,
    setCustomDietNotes,
    dietItems,
    addDietItem,
    removeDietItem,
    medicines,
    addMedicine,
    removeMedicine,
    confirmAndDispatchPlan,
    createdPlan,
    isSubmitting,
  };
}

export default useTherapyPlanBuilder;
