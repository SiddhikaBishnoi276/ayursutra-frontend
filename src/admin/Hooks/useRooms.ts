// src/admin/hooks/useRooms.ts
import { useState, useEffect } from 'react';
import { useGetRoomsQuery } from '../apis/adminApi';
import { Room } from '../types/admin.types';

export const useRooms = () => {
  const { data: initialRooms = [], isLoading } = useGetRoomsQuery();
  const [roomList, setRoomList] = useState<Room[]>([]);

  useEffect(() => {
    if (initialRooms.length > 0 && roomList.length === 0) {
      setRoomList(initialRooms);
    }
  }, [initialRooms]);

  const addRoom = (data: { name: string; type: string }) => {
    const newRoom: Room = {
      id: `${Date.now().toString().slice(-3)}`,
      name: data.name,
      type: data.type,
      status: 'Available',
    };
    setRoomList((prev) => [...prev, newRoom]);
    return newRoom;
  };

  return {
    rooms: roomList,
    isLoading,
    addRoom,
  };
};
