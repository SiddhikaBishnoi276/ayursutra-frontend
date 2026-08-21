// src/admin/hooks/useRooms.ts
import { useState, useEffect, useMemo } from 'react';
import { useGetRoomsQuery } from '../apis/adminApi';
import { Room } from '../types/admin.types';
import rawSessionsQueue from '../../Therapist/data/sessionsQueue.json';
import rawDoctorPatients from '../../Doctor/data/patients.json';

export const useRooms = () => {
  const { data: initialRooms = [], isLoading } = useGetRoomsQuery();
  const [customRooms, setCustomRooms] = useState<Room[]>([]);

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
