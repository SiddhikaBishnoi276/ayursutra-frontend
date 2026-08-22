// src/Doctor/Components/PatientIntakeModal.tsx
import React, { useState } from 'react';
import { Modal } from '../../Common/Components/Modal';
import { Button } from '../../Common/Components/Button';
import { Patient } from '../types/doctor.types';
import { UserPlus, Sparkles } from 'lucide-react';

export interface PatientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patientData: Partial<Patient>) => Promise<void>;
  isLoading?: boolean;
}

export const PatientIntakeModal: React.FC<PatientIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    contact: '',
    email: '',
    chiefComplaint: '',
    diagnosis: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
    setFormData({
      name: '',
      age: 35,
      gender: 'Male',
      contact: '',
      email: '',
      chiefComplaint: '',
      diagnosis: '',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinical Patient Intake"
      subtitle="Register a new patient and automatically start diagnostic Prakriti assessment."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Name & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Full Legal Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Chandra"
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary bg-[#fbf9f5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary bg-[#fbf9f5]"
            />
          </div>
        </div>

        {/* Age, Gender & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Age (Years) *
            </label>
            <input
              type="number"
              name="age"
              min={1}
              max={110}
              required
              value={formData.age}
              onChange={handleChange}
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary bg-[#fbf9f5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary bg-[#fbf9f5]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="patient@example.com"
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary bg-[#fbf9f5]"
            />
          </div>
        </div>


        {/* Chief Complaint */}
        <div className="flex flex-col gap-1">
          <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
            Chief Complaints & Clinical History *
          </label>
          <textarea
            name="chiefComplaint"
            rows={2}
            required
            value={formData.chiefComplaint}
            onChange={handleChange}
            placeholder="e.g. Severe lower back pain radiating to left leg, worse after morning stiffness..."
            className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-ayur-primary resize-none bg-[#fbf9f5]"
          />
        </div>

        {/* Ayurvedic Clinical Diagnosis */}
        <div className="flex flex-col gap-1">
          <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
            Ayurvedic Clinical Diagnosis (Vyadhi Vinishchaya) *
          </label>
          <input
            type="text"
            name="diagnosis"
            required
            value={formData.diagnosis}
            onChange={handleChange}
            placeholder="e.g. Vata-Kaphaja Katigraha (Lumbar Spondylosis)"
            className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary bg-[#fbf9f5]"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Sparkles className="w-4 h-4" />}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Save & Start Prakriti Assessment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
