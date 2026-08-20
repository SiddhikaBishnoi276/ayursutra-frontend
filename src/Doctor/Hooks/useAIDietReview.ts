// src/Doctor/Hooks/useAIDietReview.ts
import { useState, useEffect } from 'react';
import { useGetAIDietPlanQuery } from '../apis/doctorApi';
import { AIDietCarePlan, StageDietPlan } from '../types/doctor.types';

export function useAIDietReview(patientId: string) {
  const { data: initialPlan, isLoading, refetch } = useGetAIDietPlanQuery(patientId);

  const [dietPlan, setDietPlan] = useState<AIDietCarePlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sync state from query whenever patientId or initialPlan changes
  useEffect(() => {
    if (initialPlan) {
      setDietPlan(initialPlan);
    }
  }, [initialPlan, patientId]);

  const updateStageDietRecommendation = (
    stageIndex: number,
    foodItem: string,
    action: 'add' | 'remove',
    type: 'pathya' | 'apathya'
  ) => {
    const current = dietPlan || initialPlan;
    if (!current) return;
    const next = JSON.parse(JSON.stringify(current)) as AIDietCarePlan;
    const stage = next.stages[stageIndex];
    if (!stage) return;

    if (type === 'pathya') {
      if (action === 'add' && foodItem.trim()) {
        stage.pathyaFoods.push(foodItem.trim());
      } else if (action === 'remove') {
        stage.pathyaFoods = stage.pathyaFoods.filter((f) => f !== foodItem);
      }
    } else {
      if (action === 'add' && foodItem.trim()) {
        stage.apathyaFoods.push(foodItem.trim());
      } else if (action === 'remove') {
        stage.apathyaFoods = stage.apathyaFoods.filter((f) => f !== foodItem);
      }
    }

    setDietPlan(next);
  };

  const updateStageYogaAsana = (
    stageIndex: number,
    asana: string,
    action: 'add' | 'remove'
  ) => {
    const current = dietPlan || initialPlan;
    if (!current) return;
    const next = JSON.parse(JSON.stringify(current)) as AIDietCarePlan;
    const stage = next.stages[stageIndex];
    if (!stage) return;

    if (action === 'add' && asana.trim()) {
      stage.yogaAsanas.push(asana.trim());
    } else if (action === 'remove') {
      stage.yogaAsanas = stage.yogaAsanas.filter((a) => a !== asana);
    }

    setDietPlan(next);
  };

  const triggerMidCourseRegeneration = async () => {
    const current = dietPlan || initialPlan;
    if (!current) return;
    // Simulate AI recalculation for altered clinical status
    const reAdapted = JSON.parse(JSON.stringify(current)) as AIDietCarePlan;
    reAdapted.stages[0].pathyaFoods.push('Warm Barley Water (Yava Manda) for Pitta-Kapha sedation');
    setDietPlan(reAdapted);
  };

  return {
    dietPlan: dietPlan || initialPlan || null,
    isLoading,
    isEditing,
    setIsEditing,
    updateStageDietRecommendation,
    updateStageYogaAsana,
    triggerMidCourseRegeneration,
    refetch,
  };
}

export default useAIDietReview;
