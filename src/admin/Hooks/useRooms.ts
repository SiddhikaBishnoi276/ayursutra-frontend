// src/admin/hooks/useRooms.ts
import { useState, useEffect, useMemo } from 'react';
import { useGetRoomsQuery, useCreateRoomMutation } from '../apis/adminApi';
import { Room } from '../types/admin.types';

export const useRooms = () => {
  const { data: initialRooms = [], isLoading } = useGetRoomsQuery();
  const [createRoomMutation] = useCreateRoomMutation();
  const [customRooms, setCustomRooms] = useState<Room[]>([]);

  // Synchronize initialRooms from database with local customRooms state
  useEffect(() => {
    if (initialRooms && initialRooms.length > 0) {
      setCustomRooms(initialRooms);
    }
  }, [initialRooms]);

  // Join rooms with live session, therapist, patient, and doctor data
  const enrichedRooms = useMemo(() => {
    const baseRooms = customRooms.length > 0 ? customRooms : initialRooms;

    return baseRooms.map((room) => {
      if (room.status !== 'Occupied') {
        return room;
      }

      return {
        ...room,
        therapistName: room.therapistName || 'Unassigned',
        patientName: room.patientName || 'Unassigned',
        doctorName: room.doctorName || 'Dr. Sandeep Rathore',
        stageName: room.stageName || 'Classical Panchakarma Therapy',
        scheduledTime: room.scheduledTime || '11:30 AM',
        durationMinutes: room.durationMinutes || 45,
      };
    });
  }, [initialRooms, customRooms]);

  const addRoom = async (data: { name: string; type: string }) => {
    const tempId = `TEMP-${Date.now().toString().slice(-3)}`;
    const newRoom: Room = {
      id: tempId,
      name: data.name,
      type: data.type,
      status: 'Available',
    };

    // Optimistically update local state for immediate feedback
    setCustomRooms((prev) => [...prev, newRoom]);

    try {
      await createRoomMutation({
        name: data.name,
        type: data.type,
      }).unwrap();
    } catch (err) {
      console.error('Failed to create room in DB:', err);
      // Revert optimistic update if API call fails
      setCustomRooms((prev) => prev.filter((r) => r.id !== tempId));
    }
    return newRoom;
  };

  return {
    rooms: enrichedRooms,
    isLoading,
    addRoom,
  };
};

export default useRooms;
