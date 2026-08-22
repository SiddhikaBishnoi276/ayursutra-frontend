// src/Therapist/Hooks/useAvailability.ts
// Hook for managing therapist leave, availability calendar, and workload summary
import { useState } from 'react';
import {
  useGetTherapistAvailabilityQuery,
  useUpdateTherapistAvailabilityMutation,
  useGetTherapistProfileQuery,
  useGetTherapistWorkloadQuery,
} from '../apis/therapistApi';

export const useAvailability = (therapistId?: string) => {
  const effectiveTherapistId =
    therapistId && therapistId !== 'TH-01' && therapistId !== 'default'
      ? therapistId
      : localStorage.getItem('userId') || '';

  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [slotTime, setSlotTime] = useState('Full Day');
  const [isFullDay, setIsFullDay] = useState(true);

  const { data: availabilityData, isLoading: isAvailLoading } = useGetTherapistAvailabilityQuery(effectiveTherapistId);
  const { data: profile, isLoading: isProfileLoading } = useGetTherapistProfileQuery(effectiveTherapistId);
  const { data: workload, isLoading: isWorkloadLoading } = useGetTherapistWorkloadQuery(effectiveTherapistId);

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
