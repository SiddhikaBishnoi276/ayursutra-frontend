// src/Doctor/Components/RecordTherapyVitalsModal.tsx
import React, { useState } from 'react';
import { Modal } from '../../Common/Components/Modal';
import { Button } from '../../Common/Components/Button';
import { useRecordTherapyVitalsMutation } from '../apis/doctorApi';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

export interface RecordTherapyVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  defaultType?: 'baseline' | 'discharge';
}

export const RecordTherapyVitalsModal: React.FC<RecordTherapyVitalsModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  defaultType = 'baseline',
}) => {
  const [recordVitalsMutation, { isLoading }] = useRecordTherapyVitalsMutation();
  const [vitalsType, setVitalsType] = useState<'baseline' | 'discharge'>(defaultType);

  const [formData, setFormData] = useState({
    vasPainScore: 8,
    bloodPressure: '120/80',
    pulseBpm: 72,
    mobilityIndex: 'Normal flexion',
    sleepHours: 7,
    agniStatus: 'Sama',
    clinicalNotes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await recordVitalsMutation({
      patientId,
      type: vitalsType,
      vitals: formData,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Clinical Vitals & Biomarkers"
      subtitle={`Document objective physiological metrics for ${patientName} (${patientId}).`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Vitals Type Selector */}
        <div className="flex items-center gap-3 bg-[#fbf9f5] p-2 rounded-xl border border-ayur-sand/80">
          <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
            <input
              type="radio"
              name="vitalsType"
              checked={vitalsType === 'baseline'}
              onChange={() => setVitalsType('baseline')}
            />
            Pre-Treatment Baseline
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
            <input
              type="radio"
              name="vitalsType"
              checked={vitalsType === 'discharge'}
              onChange={() => setVitalsType('discharge')}
            />
            Post-Treatment Discharge Outcome
          </label>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              VAS Pain Score (0 - 10) *
            </label>
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              required
              value={formData.vasPainScore}
              onChange={(e) => setFormData({ ...formData, vasPainScore: Number(e.target.value) })}
              className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Blood Pressure (mmHg) *
            </label>
            <input
              type="text"
              required
              value={formData.bloodPressure}
              onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
              placeholder="120/80"
              className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Radial Pulse (BPM) *
            </label>
            <input
              type="number"
              min={40}
              max={180}
              required
              value={formData.pulseBpm}
              onChange={(e) => setFormData({ ...formData, pulseBpm: Number(e.target.value) })}
              className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Agni (Digestive Fire) *
            </label>
            <select
              value={formData.agniStatus}
              onChange={(e) => setFormData({ ...formData, agniStatus: e.target.value })}
              className="rounded-xl border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
            >
              <option value="Sama">Samagni (Balanced)</option>
              <option value="Visham">Vishamagni (Irregular / Vata)</option>
              <option value="Teekshna">Teekshnagni (Hyper / Pitta)</option>
              <option value="Manda">Mandagni (Slow / Kapha)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Mobility / Range of Motion Notes
            </label>
            <input
              type="text"
              value={formData.mobilityIndex}
              onChange={(e) => setFormData({ ...formData, mobilityIndex: e.target.value })}
              placeholder="e.g. Pain-free lumbar extension"
              className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
            Clinical Notes & Observations
          </label>
          <textarea
            rows={2}
            value={formData.clinicalNotes}
            onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
            placeholder="Additional examination notes..."
            className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary resize-none"
          />
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="w-4 h-4" />}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Vitals'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
