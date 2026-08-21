// src/admin/hooks/useRooms.ts
import { useState, useMemo } from 'react';
import { useGetRoomsQuery } from '../apis/adminApi';
import { Room } from '../types/admin.types';

export const useRooms = () => {
  const { data: initialRooms = [], isLoading } = useGetRoomsQuery();
  const [customRooms, setCustomRooms] = useState<Room[]>([]);

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

  const addRoom = (data: { name: string; type: string }) => {
    const newRoom: Room = {
      id: `${Date.now().toString().slice(-3)}`,
      name: data.name,
      type: data.type,
      status: 'Available',
    };
    setCustomRooms((prev) => {
      const current = prev.length > 0 ? prev : initialRooms;
      return [...current, newRoom];
    });
    return newRoom;
  };

  return {
    rooms: enrichedRooms,
    isLoading,
    addRoom,
  };
};

export default useRooms;
