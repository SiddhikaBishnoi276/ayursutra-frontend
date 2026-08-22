// src/Therapist/Hooks/useSessionQueue.ts
// Hook for managing session queue filtering, searching, and metrics
import { useState, useMemo } from 'react';
import { useGetTherapistQueueQuery } from '../apis/therapistApi';
import { SessionQueueFilter } from '../types/therapist.types';

export const useSessionQueue = (therapistId?: string) => {
  const effectiveTherapistId =
    therapistId && therapistId !== 'TH-01' && therapistId !== 'default'
      ? therapistId
      : localStorage.getItem('userId') || '';

  const { data: queue = [], isLoading, isError, refetch } = useGetTherapistQueueQuery(effectiveTherapistId);
  const [filter, setFilter] = useState<SessionQueueFilter>({
    status: 'all',
    searchQuery: '',
    categoryFilter: 'all',
  });
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return queue.filter((session) => {
      // 1. Search Query filter (matches patient name, package name, stage, room)
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchesPatient = session.patientName.toLowerCase().includes(q);
        const matchesPackage = session.packageName.toLowerCase().includes(q);
        const matchesStage = session.stageName.toLowerCase().includes(q);
        const matchesRoom = session.roomNumber.toLowerCase().includes(q);
        const matchesId = session.id.toLowerCase().includes(q);
        if (!matchesPatient && !matchesPackage && !matchesStage && !matchesRoom && !matchesId) {
          return false;
        }
      }

      // 2. Status Pill filter
      if (filter.status === 'today') {
        return session.scheduledDate === todayStr || session.status === 'in_progress';
      }
      if (filter.status === 'upcoming') {
        return session.status === 'scheduled';
      }
      if (filter.status === 'completed') {
        return session.status === 'completed';
      }
      if (filter.status === 'flagged') {
        return session.status === 'flagged' || session.status === 'paused_emergency';
      }

      // 3. Category Filter
      if (filter.categoryFilter && filter.categoryFilter !== 'all') {
        if (session.stageCategory !== filter.categoryFilter) {
          return false;
        }
      }

      return true;
    });
  }, [queue, filter]);

  // Statistics counters
  const stats = useMemo(() => {
    const totalToday = queue.length;
    const completed = queue.filter((s) => s.status === 'completed').length;
    const inProgress = queue.filter((s) => s.status === 'in_progress').length;
    const scheduled = queue.filter((s) => s.status === 'scheduled').length;
    const flagged = queue.filter((s) => s.status === 'flagged' || s.status === 'paused_emergency').length;

    return {
      totalToday,
      completed,
      inProgress,
      scheduled,
      pending: inProgress + scheduled,
      flagged,
    };
  }, [queue]);

  const selectedSession = useMemo(() => {
    return queue.find((s) => s.id === selectedSessionId) || null;
  }, [queue, selectedSessionId]);

  return {
    sessions: filteredSessions,
    rawQueue: queue,
    stats,
    filter,
    setFilter,
    selectedSessionId,
    setSelectedSessionId,
    selectedSession,
    isLoading,
    isError,
    refetch,
  };
};
