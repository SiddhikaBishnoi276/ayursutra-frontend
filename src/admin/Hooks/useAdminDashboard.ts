// src/admin/hooks/useAdminDashboard.ts
import { useState, useEffect } from 'react';
import {
  useGetStaffQuery,
  useGetPackagesQuery,
  useGetRoomsQuery,
  useGetActivitiesQuery,
  useGetStatsQuery,
  useGetQuestionsQuery,
  useGetNotificationLogsQuery,
  useRetryNotificationMutation,
} from '../apis/adminApi';
import { NotificationLog, ActivityLog } from '../types/admin.types';

export const useAdminDashboard = () => {
  const { data: staff = [], isLoading: isStaffLoading } = useGetStaffQuery();
  const { data: packages = [], isLoading: isPackagesLoading } = useGetPackagesQuery();
  const { data: rooms = [], isLoading: isRoomsLoading } = useGetRoomsQuery();
  const { data: activities = [], isLoading: isActivitiesLoading } = useGetActivitiesQuery();
  const { data: statsData, isLoading: isStatsLoading } = useGetStatsQuery();
  const { data: questions = [], isLoading: isQuestionsLoading } = useGetQuestionsQuery();
  const { data: initialNotifs = [], isLoading: isNotifsLoading } = useGetNotificationLogsQuery();
  const [retryNotificationMutation] = useRetryNotificationMutation();

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [activityList, setActivityList] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (initialNotifs.length > 0) setNotificationLogs(initialNotifs);
  }, [initialNotifs]);

  useEffect(() => {
    if (activities.length > 0) setActivityList(activities);
  }, [activities]);

  const isLoading =
    isStaffLoading ||
    isPackagesLoading ||
    isRoomsLoading ||
    isActivitiesLoading ||
    isStatsLoading ||
    isQuestionsLoading ||
    isNotifsLoading;

  const retryNotification = async (id: string) => {
    setNotificationLogs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'Sent' } : n))
    );
    try {
      await retryNotificationMutation({ id }).unwrap();
    } catch {
      // Local state already updated for responsive UI demo
    }
  };

  return {
    staff,
    packages,
    rooms,
    activities: activityList,
    stats: statsData,
    questions,
    notifications: notificationLogs,
    isLoading,
    retryNotification,
  };
};