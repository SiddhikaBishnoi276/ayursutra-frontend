// src/Therapist/Components/EmergencyPauseModal.tsx
import React from 'react';
import { AlertOctagon, HeartPulse, Send, ShieldAlert } from 'lucide-react';
import { Modal } from '../../Common/Components/Modal';
import { Button } from '../../Common/Components/Button';
import { TherapistSession, IncidentReportPayload } from '../types/therapist.types';
import { useEmergencyPause } from '../Hooks/useEmergencyPause';

export interface EmergencyPauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: TherapistSession;
  onSubmitIncident: (incident: IncidentReportPayload) => Promise<void>;
  isLoading?: boolean;
}

export const EmergencyPauseModal: React.FC<EmergencyPauseModalProps> = ({
  isOpen,
  onClose,
  session,
  onSubmitIncident,
  isLoading = false,
}) => {
  const {
    reactionDescription,
    setReactionDescription,
    actionTaken,
    setActionTaken,
    bloodPressure,
    setBloodPressure,
    pulseBpm,
    setPulseBpm,
    spo2,
    setSpo2,
    errors,
    validate,
    getIncidentPayload,
    resetForm,
  } = useEmergencyPause();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = getIncidentPayload();
    await onSubmitIncident(payload);
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔴 Emergency Procedure Pause & Clinical Incident Log"
      subtitle={`Immediate freeze initiated for ${session.patientName} (${session.patientId})`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            Session will remain locked for Doctor inspection.
          </span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Notifying Doctor…' : 'Freeze & Alert Doctor'}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-serif font-bold text-rose-950 text-xs block">
              Protocol Halt Protocol Triggered
            </span>
            <p className="text-[11px] text-rose-800 leading-snug mt-0.5">
              Please document the sudden symptoms, physiological response, and any immediate counter-measures taken (e.g. wiping medicated oil, cold pack, water).
            </p>
          </div>
        </div>

        {/* Reaction Description */}
        <div>
          <label className="block font-serif font-bold text-gray-900 mb-1">
            Adverse Clinical Reaction / Reason for Emergency Pause *
          </label>
          <textarea
            value={reactionDescription}
            onChange={(e) => setReactionDescription(e.target.value)}
            rows={3}
            placeholder="e.g. Sudden intense dizziness, profuse cold sweating, skin hives, extreme tachycardia..."
            className={`w-full rounded-xl border p-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fbf9f5] ${
              errors.reactionDescription ? 'border-rose-500 bg-rose-50/20' : 'border-ayur-sand/80'
            }`}
          />
          {errors.reactionDescription && (
            <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.reactionDescription}</p>
          )}
        </div>

        {/* Action Taken */}
        <div>
          <label className="block font-serif font-bold text-gray-900 mb-1">
            Immediate Action / First-Aid Applied *
          </label>
          <input
            type="text"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            placeholder="e.g. Paused steam immediately, laid patient supine, provided warm water..."
            className={`w-full rounded-xl border p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-[#fbf9f5] ${
              errors.actionTaken ? 'border-rose-500 bg-rose-50/20' : 'border-ayur-sand/80'
            }`}
          />
          {errors.actionTaken && (
            <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.actionTaken}</p>
          )}
        </div>

        {/* Vitals at Pause */}
        <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200">
          <span className="font-serif font-bold text-gray-900 text-xs block mb-2 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            Patient Vitals at Time of Halt
          </span>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Blood Pressure *
              </label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="130/85"
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Pulse (BPM) *
              </label>
              <input
                type="number"
                value={pulseBpm}
                onChange={(e) => setPulseBpm(Number(e.target.value))}
                placeholder="88"
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                SpO2 (%)
              </label>
              <input
                type="number"
                value={spo2 || ''}
                onChange={(e) => setSpo2(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="98"
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EmergencyPauseModal;
