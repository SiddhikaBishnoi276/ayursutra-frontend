// src/admin/hooks/useRooms.ts
import { useState, useEffect, useMemo } from 'react';
import { useGetRoomsQuery, useCreateRoomMutation } from '../apis/adminApi';
import { Room } from '../types/admin.types';
import rawSessionsQueue from '../../Therapist/data/sessionsQueue.json';
import rawDoctorPatients from '../../Doctor/data/patients.json';

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

  // Join rooms with session, therapist, patient, and doctor data
  const enrichedRooms = useMemo(() => {
    const baseRooms = customRooms.length > 0 ? customRooms : initialRooms;

    return baseRooms.map((room) => {
      if (room.status !== 'Occupied') {
        return room;
      }

      // If already explicitly enriched in room data, keep it
      let therapistName = room.therapistName;
      let patientName = room.patientName;
      let doctorName = room.doctorName;
      let stageName = room.stageName;
      let scheduledTime = room.scheduledTime;
      let durationMinutes = room.durationMinutes;

      // Try matching with sessionsQueue if needed
      if (!therapistName || !patientName || !stageName) {
        const matchedSession = (rawSessionsQueue as any[]).find(
          (s) =>
            s.id === room.currentSessionId ||
            s.roomNumber?.toLowerCase().includes(room.name.toLowerCase()) ||
            s.roomNumber?.includes(room.id)
        );

        if (matchedSession) {
          therapistName = therapistName || matchedSession.therapistName;
          patientName = patientName || matchedSession.patientName;
          stageName =
            stageName ||
            `${matchedSession.stageName} (Day ${matchedSession.dayNumber}/${matchedSession.totalDays})`;
          scheduledTime = scheduledTime || matchedSession.scheduledTime;
          durationMinutes = durationMinutes || matchedSession.durationMinutes;

          // Lookup prescribing doctor from patient records
          if (!doctorName) {
            const matchedPatient = (rawDoctorPatients as any[]).find(
              (p) => p.id === matchedSession.patientId
            );
            doctorName =
              matchedPatient?.prescribingDoctor ||
              matchedPatient?.doctorName ||
              'Dr. Sandeep Rathore';
          }
        }
      }

      return {
        ...room,
        therapistName: therapistName || 'Unassigned',
        patientName: patientName || 'Unassigned',
        doctorName: doctorName || 'Dr. Sandeep Rathore',
        stageName: stageName || 'Classical Panchakarma Therapy',
        scheduledTime: scheduledTime || '11:30 AM',
        durationMinutes: durationMinutes || 45,
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
