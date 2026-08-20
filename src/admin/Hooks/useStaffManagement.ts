// src/admin/hooks/useStaffManagement.ts
import { useState, useEffect } from 'react';
import { useGetStaffQuery, useAddStaffMutation, useUpdateStaffStatusMutation } from '../apis/adminApi';
import { StaffMember } from '../types/admin.types';

export type StaffFilter = 'all' | 'doctor' | 'therapist' | 'Active' | 'Suspended';

export const useStaffManagement = () => {
  const { data: initialStaff = [], isLoading } = useGetStaffQuery();
  const [addStaffMutation] = useAddStaffMutation();
  const [updateStaffStatusMutation] = useUpdateStaffStatusMutation();

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [activeFilter, setActiveFilter] = useState<StaffFilter>('all');

  useEffect(() => {
    if (initialStaff.length > 0 && staffList.length === 0) {
      setStaffList(initialStaff);
    }
  }, [initialStaff]);

  const filteredStaff = staffList.filter((member) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'doctor') return member.role === 'doctor';
    if (activeFilter === 'therapist') return member.role === 'therapist';
    if (activeFilter === 'Active') return member.status === 'Active';
    if (activeFilter === 'Suspended') return member.status === 'Suspended';
    return true;
  });

  const addDoctor = async (data: {
    fullName: string;
    email: string;
    registrationNum: string;
    gender: 'Male' | 'Female';
    specialization?: string;
  }) => {
    const newDoc: StaffMember = {
      id: `S-${Date.now().toString().slice(-4)}`,
      fullName: data.fullName,
      email: data.email,
      role: 'doctor',
      registrationNum: data.registrationNum,
      gender: data.gender,
      specialization: data.specialization || 'Kaya Chikitsa Specialist',
      status: 'Active',
    };
    setStaffList((prev) => [newDoc, ...prev]);
    try {
      await addStaffMutation(newDoc).unwrap();
    } catch {
      // Local state is ready
    }
    return newDoc;
  };

  const addTherapist = async (data: {
    fullName: string;
    email: string;
    specialization: string;
    gender: 'Male' | 'Female';
  }) => {
    const newTherapist: StaffMember = {
      id: `S-${Date.now().toString().slice(-4)}`,
      fullName: data.fullName,
      email: data.email,
      role: 'therapist',
      specialization: data.specialization,
      gender: data.gender,
      status: 'Active',
    };
    setStaffList((prev) => [newTherapist, ...prev]);
    try {
      await addStaffMutation(newTherapist).unwrap();
    } catch {
      // Local state is ready
    }
    return newTherapist;
  };

  const toggleStaffStatus = async (id: string) => {
    const current = staffList.find((s) => s.id === id);
    if (!current) return;
    const newStatus: StaffMember['status'] = current.status === 'Active' ? 'Suspended' : 'Active';

    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    try {
      await updateStaffStatusMutation({ id, status: newStatus }).unwrap();
    } catch {
      // Local state is ready
    }
  };

  return {
    staff: staffList,
    filteredStaff,
    activeFilter,
    setActiveFilter,
    isLoading,
    addDoctor,
    addTherapist,
    toggleStaffStatus,
  };
};
