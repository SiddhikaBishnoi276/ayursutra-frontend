// src/Doctor/Hooks/useProgressAnalytics.ts
import { useMemo } from 'react';
import { useGetProgressAnalyticsQuery } from '../apis/doctorApi';

export function useProgressAnalytics(patientId: string = 'PAT-101') {
  const { data, isLoading, refetch } = useGetProgressAnalyticsQuery(patientId);

  const progressTimeline = data?.timeline || [];
  const comparativeReport = data?.comparativeReport;

  const metrics = useMemo(() => {
    if (!progressTimeline.length) {
      return {
        initialPain: 8,
        currentPain: 2,
        painReliefPercent: 75,
        avgPulse: 72,
        flaggedPoints: [],
      };
    }

    const first = progressTimeline[0];
    const last = progressTimeline[progressTimeline.length - 1];

    const initialPain = first?.clinicalVASScore || 8;
    const currentPain = last?.clinicalVASScore || 2;
    const painReliefPercent = Math.max(
      0,
      Math.round(((initialPain - currentPain) / (initialPain || 1)) * 100)
    );

    const totalPulse = progressTimeline.reduce((acc, p) => acc + p.pulseBpm, 0);
    const avgPulse = Math.round(totalPulse / progressTimeline.length);
    const flaggedPoints = progressTimeline.filter((p) => p.complicationFlag);

    return {
      initialPain,
      currentPain,
      painReliefPercent,
      avgPulse,
      flaggedPoints,
    };
  }, [progressTimeline]);

  return {
    progressTimeline,
    comparativeReport,
    metrics,
    isLoading,
    refetch,
  };
}
