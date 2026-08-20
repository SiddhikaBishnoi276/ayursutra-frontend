// src/Therapist/Hooks/useAvailability.ts
// Hook for managing therapist leave, availability calendar, and workload summary
import { useState } from 'react';
import {
  useGetTherapistAvailabilityQuery,
  useUpdateTherapistAvailabilityMutation,
  useGetTherapistProfileQuery,
  useGetTherapistWorkloadQuery,
} from '../apis/therapistApi';

export const useAvailability = (therapistId: string = 'TH-01') => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-21');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [slotTime, setSlotTime] = useState('Full Day');
  const [isFullDay, setIsFullDay] = useState(true);

  const { data: availabilityData, isLoading: isAvailLoading } = useGetTherapistAvailabilityQuery(therapistId);
  const { data: profile, isLoading: isProfileLoading } = useGetTherapistProfileQuery(therapistId);
  const { data: workload, isLoading: isWorkloadLoading } = useGetTherapistWorkloadQuery(therapistId);

  const [updateAvailabilityMutation, { isLoading: isUpdating }] = useUpdateTherapistAvailabilityMutation();

  const isTodayAvailable = availabilityData?.todayAvailable ?? true;
  const blockedSlots = availabilityData?.blockedSlots || [];

  const handleToggleTodayAvailability = async () => {
    try {
      await updateAvailabilityMutation({
        therapistId,
        todayAvailable: !isTodayAvailable,
      }).unwrap();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleAddLeaveOrBlock = async () => {
    if (!selectedDate || !leaveReason.trim()) return;
    try {
      await updateAvailabilityMutation({
        therapistId,
        newBlockedSlot: {
          date: selectedDate,
          slot: isFullDay ? 'Full Day' : slotTime,
          reason: leaveReason.trim(),
          isFullDayLeave: isFullDay,
        },
      }).unwrap();
      setIsLeaveModalOpen(false);
      setLeaveReason('');
    } catch (err) {
      console.error('Failed to add leave slot:', err);
    }
  };

  const handleRemoveBlockedSlot = async (index: number) => {
    try {
      await updateAvailabilityMutation({
        therapistId,
        removeBlockedIndex: index,
      }).unwrap();
    } catch (err) {
      console.error('Failed to remove blocked slot:', err);
    }
  };

  return {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    isTodayAvailable,
    blockedSlots,
    profile,
    workload,
    isLoading: isAvailLoading || isProfileLoading || isWorkloadLoading || isUpdating,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    leaveReason,
    setLeaveReason,
    slotTime,
    setSlotTime,
    isFullDay,
    setIsFullDay,
    toggleTodayAvailability: handleToggleTodayAvailability,
    addLeaveOrBlock: handleAddLeaveOrBlock,
    removeBlockedSlot: handleRemoveBlockedSlot,
  };
};
