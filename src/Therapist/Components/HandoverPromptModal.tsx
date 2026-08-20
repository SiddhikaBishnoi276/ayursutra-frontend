// src/Therapist/Components/HandoverPromptModal.tsx
import React, { useState } from 'react';
import { UserCheck, ArrowRightLeft, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Modal } from '../../Common/Components/Modal';
import { Button } from '../../Common/Components/Button';
import { Badge } from '../../Common/Components/Badge';
import { TherapistSession } from '../types/therapist.types';

export interface HandoverPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: TherapistSession;
  onConfirmHandover: (newTherapistId: string, newTherapistName: string, reason?: string) => Promise<void>;
  availableTherapists?: { id: string; name: string; gender: string; specializations: string[] }[];
  isLoading?: boolean;
}

export const HandoverPromptModal: React.FC<HandoverPromptModalProps> = ({
  isOpen,
  onClose,
  session,
  onConfirmHandover,
  availableTherapists = [
    {
      id: 'TH-02',
      name: 'Therapist Arjun Nair',
      gender: 'Male',
      specializations: ['Patra Pinda Sweda', 'Janu Basti', 'Greeva Basti'],
    },
    {
      id: 'TH-03',
      name: 'Therapist Lakshmi Menon',
      gender: 'Female',
      specializations: ['Shirodhara', 'Nasya Karma', 'Mukha Lepam'],
    },
    {
      id: 'TH-04',
      name: 'Therapist Deepa Radhakrishnan',
      gender: 'Female',
      specializations: ['Snehapana Care', 'Virechana Monitoring', 'Kashaya Basti'],
    },
  ],
  isLoading = false,
}) => {
  const [selectedTherapistId, setSelectedTherapistId] = useState(availableTherapists[0]?.id || '');
  const [handoverReason, setHandoverReason] = useState('Shift End / Relief Rotation');

  const selectedTherapist = availableTherapists.find((t) => t.id === selectedTherapistId);
  const isGenderMatched = selectedTherapist?.gender === session.patientGender;

  const handleSubmit = async () => {
    if (!selectedTherapist) return;
    await onConfirmHandover(
      selectedTherapist.id,
      selectedTherapist.name,
      handoverReason
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚠️ Active Procedure Handover Protocol"
      subtitle="Shift ending with an In-Progress session requires clinical transfer."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="secondary" size="sm" onClick={onClose} type="button">
            Stay on Session
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
            onClick={handleSubmit}
            disabled={isLoading || !selectedTherapistId}
          >
            {isLoading ? 'Transferring…' : 'Handover & Exit'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Warning Note */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-serif font-bold text-amber-950 block">
              Session is Currently Active
            </span>
            <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
              <strong>{session.patientName}</strong> is undergoing <strong>{session.stageName}</strong> in <strong>{session.roomNumber}</strong>. Please select the relieving certified therapist.
            </p>
          </div>
        </div>

        {/* Relieving Therapist Picker */}
        <div>
          <label className="block font-serif font-bold text-gray-900 mb-1.5">
            Select Relieving Therapist *
          </label>
          <div className="space-y-2">
            {availableTherapists.map((t) => {
              const matchesGender = t.gender === session.patientGender;
              const isSelected = selectedTherapistId === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTherapistId(t.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/60 border-ayur-primary text-gray-900 shadow-2xs'
                      : 'bg-white border-ayur-sand/70 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ayur-primary text-white font-serif font-bold text-xs">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-serif font-bold text-gray-900 block">{t.name}</span>
                      <span className="text-[10px] text-gray-500">
                        {t.gender} • {t.specializations.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {matchesGender && (
                      <Badge variant="success" size="sm" icon={<ShieldCheck className="w-2.5 h-2.5" />}>
                        Gender Match
                      </Badge>
                    )}
                    <input
                      type="radio"
                      name="handoverTherapist"
                      value={t.id}
                      checked={isSelected}
                      onChange={() => setSelectedTherapistId(t.id)}
                      className="text-ayur-primary focus:ring-ayur-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Handover Reason */}
        <div>
          <label className="block font-serif font-bold text-gray-900 mb-1">
            Handover Context / Reason
          </label>
          <input
            type="text"
            value={handoverReason}
            onChange={(e) => setHandoverReason(e.target.value)}
            placeholder="e.g. Shift ended; patient comfortable with oil retention."
            className="w-full rounded-xl border border-ayur-sand/80 p-2.5 text-xs bg-[#fbf9f5] focus:outline-none focus:ring-2 focus:ring-ayur-primary"
          />
        </div>
      </div>
    </Modal>
  );
};

export default HandoverPromptModal;
