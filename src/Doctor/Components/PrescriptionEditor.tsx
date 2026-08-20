// src/Doctor/Components/PrescriptionEditor.tsx
import React, { useState } from 'react';
import { MedicinePrescription } from '../types/doctor.types';
import { Button } from '../../Common/Components/Button';
import { Pill, Plus, Trash2 } from 'lucide-react';

export interface PrescriptionEditorProps {
  medicines: MedicinePrescription[];
  onAdd: (medicine: MedicinePrescription) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  medicines,
  onAdd,
  onRemove,
  className = '',
}) => {
  const [form, setForm] = useState<Omit<MedicinePrescription, 'id'>>({
    medicineName: '',
    dosage: '1 Tablet',
    frequency: 'Twice Daily',
    timing: 'After Meals',
    instructions: 'Take with warm water',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicineName.trim()) return;

    onAdd({
      id: `MED-${Date.now().toString().slice(-4)}`,
      ...form,
    });

    setForm({
      medicineName: '',
      dosage: '1 Tablet',
      frequency: 'Twice Daily',
      timing: 'After Meals',
      instructions: 'Take with warm water',
    });
  };

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
          <Pill className="w-3.5 h-3.5 text-ayur-primary" />
          Herbal Medicine & Shamana Prescriptions ({medicines.length})
        </span>
      </div>

      {/* Existing Prescriptions List */}
      <div className="flex flex-col gap-2">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/80 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white text-ayur-primary font-bold text-xs flex items-center justify-center border border-ayur-sand/80 shrink-0 font-serif">
                Rx
              </span>
              <div>
                <h5 className="font-bold text-gray-900 font-serif text-xs">
                  {med.medicineName} — <span className="font-sans font-normal text-gray-600">{med.dosage}</span>
                </h5>
                <p className="text-[11px] text-ayur-green-mid font-medium">
                  {med.frequency} • {med.timing} {med.instructions ? `(${med.instructions})` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRemove(med.id)}
              className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition"
              title="Remove medicine"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Medicine Inline Form */}
      <div className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs flex flex-col gap-2.5">
        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
          Add Herbal Prescription
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <input
            type="text"
            placeholder="Medicine name (e.g. Yograj Guggulu)"
            value={form.medicineName}
            onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
            className="sm:col-span-2 rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
          />

          <input
            type="text"
            placeholder="Dosage (e.g. 2 Tablets)"
            value={form.dosage}
            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
          />

          <select
            value={form.timing}
            onChange={(e: any) => setForm({ ...form, timing: e.target.value })}
            className="rounded-xl border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
          >
            <option value="After Meals">After Meals</option>
            <option value="Before Meals">Before Meals</option>
            <option value="Empty Stomach">Empty Stomach</option>
            <option value="With Warm Water">With Warm Water</option>
            <option value="Bedtime">Bedtime</option>
          </select>
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleAddSubmit}
          >
            Add Prescription
          </Button>
        </div>
      </div>
    </div>
  );
};
