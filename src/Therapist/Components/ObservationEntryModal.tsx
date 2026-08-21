// src/Therapist/Components/ObservationEntryModal.tsx
import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Send,
  Package,
} from 'lucide-react';
import { Modal } from '../../Common/Components/Modal';
import { Button } from '../../Common/Components/Button';
import { Badge } from '../../Common/Components/Badge';
import { TherapistSession, ObservationPayload } from '../types/therapist.types';
import { useObservationEntry } from '../Hooks/useObservationEntry';

export interface ObservationEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: TherapistSession;
  onSubmitObservation: (observation: ObservationPayload) => Promise<any>;
  isLoading?: boolean;
}

export const ObservationEntryModal: React.FC<ObservationEntryModalProps> = ({
  isOpen,
  onClose,
  session,
  onSubmitObservation,
  isLoading = false,
}) => {
  const {
    dosageGiven,
    setDosageGiven,
    patientResponse,
    setPatientResponse,
    bloodPressure,
    setBloodPressure,
    pulseBpm,
    setPulseBpm,
    clinicalVASScore,
    setClinicalVASScore,
    agniStatus,
    setAgniStatus,
    complicationFlag,
    setComplicationFlag,
    complicationNotes,
    setComplicationNotes,
    generalObservations,
    setGeneralObservations,
    errors,
    validate,
    getPayload,
  } = useObservationEntry(session);

  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'flagged';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = getPayload();
    try {
      const res = await onSubmitObservation(payload);
      if (res?.isFlagged || payload.complicationFlag) {
        setFeedbackBanner({
          type: 'flagged',
          message:
            'Complication logged. Doctor notified — next stage progression paused pending review.',
        });
      } else {
        setFeedbackBanner({
          type: 'success',
          message: `Day ${session.dayNumber + 1} next stage unlocked for patient ${session.patientName}.`,
        });
      }
      setTimeout(() => {
        onClose();
        setFeedbackBanner(null);
      }, 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Session Completion & Clinical Observation Log"
      subtitle={`Procedure Log: ${session.stageName} for ${session.patientName} (${session.patientId})`}
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-[11px] text-gray-500 font-medium">
            Stage: <strong>{session.stageCategory}</strong> • Chamber: {session.roomNumber}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant={complicationFlag ? 'danger' : 'primary'}
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={handleSubmit}
              disabled={isLoading || !!feedbackBanner}
            >
              {isLoading
                ? 'Submitting…'
                : complicationFlag
                  ? 'Submit & Flag Doctor'
                  : 'Mark Complete → Unlock Next'}
            </Button>
          </div>
        </div>
      }
    >
      {/* Dynamic Feedback Banner */}
      {feedbackBanner && (
        <div
          className={`p-4 rounded-2xl mb-4 text-xs font-bold font-serif flex items-center gap-3 animate-in fade-in duration-200 ${feedbackBanner.type === 'success'
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
              : 'bg-rose-100 border border-rose-300 text-rose-950'
            }`}
        >
          {feedbackBanner.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
          )}
          <span>{feedbackBanner.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Field 1: Dosage / Materials Given */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-serif font-bold text-gray-900 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-ayur-primary" />
              Dosage & Formulations Administered *
            </label>
            <span className="text-[10px] text-ayur-green-mid font-semibold">
              Auto-deducts from clinic inventory
            </span>
          </div>
          <input
            type="text"
            value={dosageGiven}
            onChange={(e) => setDosageGiven(e.target.value)}
            placeholder="e.g. 45 ml Mahatiktaka Ghrita, 200 ml Dashamoola Kwatha steam"
            className={`w-full rounded-xl border p-2.5 text-xs bg-[#fbf9f5] focus:outline-none focus:ring-2 focus:ring-ayur-primary ${errors.dosageGiven ? 'border-rose-500 bg-rose-50/20' : 'border-ayur-sand/80'
              }`}
          />
          {errors.dosageGiven && (
            <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.dosageGiven}</p>
          )}
        </div>

        {/* Field 2: Patient Response (Normal vs Abnormal Radio) */}
        <div>
          <label className="block font-serif font-bold text-gray-900 mb-1.5">
            Patient Tolerance & Procedure Response *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${patientResponse === 'Normal'
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                  : 'bg-white border-ayur-sand/70 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="patientResponse"
                  value="Normal"
                  checked={patientResponse === 'Normal'}
                  onChange={() => {
                    setPatientResponse('Normal');
                    setComplicationFlag(false);
                  }}
                  className="text-ayur-primary focus:ring-ayur-primary"
                />
                <span>Normal / Well Tolerated</span>
              </div>
              <Badge variant="success" size="sm">
                Smooth
              </Badge>
            </label>

            <label
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${patientResponse === 'Abnormal'
                  ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold shadow-2xs'
                  : 'bg-white border-ayur-sand/70 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="patientResponse"
                  value="Abnormal"
                  checked={patientResponse === 'Abnormal'}
                  onChange={() => {
                    setPatientResponse('Abnormal');
                    setComplicationFlag(true);
                  }}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>Abnormal / Complication</span>
              </div>
              <Badge variant="danger" size="sm">
                Doctor Review
              </Badge>
            </label>
          </div>
        </div>

        {/* Field 3: Vitals & Agni Status */}
        <div className="bg-[#fbf9f5] p-3.5 rounded-2xl border border-ayur-sand/80">
          <span className="font-serif font-bold text-gray-900 text-xs block mb-2 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-ayur-primary" />
            Post-Procedure Vitals & Telemetry
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                BP (mmHg) *
              </label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              />
              {errors.bloodPressure && (
                <p className="text-[9px] text-rose-600 font-bold mt-0.5">{errors.bloodPressure}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Pulse (BPM) *
              </label>
              <input
                type="number"
                value={pulseBpm}
                onChange={(e) => setPulseBpm(Number(e.target.value))}
                placeholder="72"
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              />
              {errors.pulseBpm && (
                <p className="text-[9px] text-rose-600 font-bold mt-0.5">{errors.pulseBpm}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Clinical VAS (1-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={clinicalVASScore}
                onChange={(e) => setClinicalVASScore(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                Agni Status
              </label>
              <select
                value={agniStatus}
                onChange={(e) => setAgniStatus(e.target.value as any)}
                className="w-full rounded-xl border border-gray-300 p-2 text-xs font-semibold bg-white"
              >
                <option value="Sama">Sama (Balanced)</option>
                <option value="Manda">Manda (Sluggish)</option>
                <option value="Tikshna">Tikshna (Intense)</option>
                <option value="Visham">Visham (Irregular)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Field 4: Complication Flag & Notes (Conditional) */}
        {(patientResponse === 'Abnormal' || complicationFlag) && (
          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-serif font-bold text-rose-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Complication & Adverse Event Details *
              </label>
              <label className="flex items-center gap-1.5 font-semibold text-rose-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={complicationFlag}
                  onChange={(e) => setComplicationFlag(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Flag for Doctor</span>
              </label>
            </div>
            <textarea
              value={complicationNotes}
              onChange={(e) => setComplicationNotes(e.target.value)}
              rows={2}
              placeholder="Describe symptom, onset time, pulse shifts, or skin reactions..."
              className={`w-full rounded-xl border p-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.complicationNotes ? 'border-rose-500' : 'border-rose-200'
                }`}
            />
            {errors.complicationNotes && (
              <p className="text-[10px] text-rose-600 font-bold">{errors.complicationNotes}</p>
            )}
          </div>
        )}

        {/* Field 5: General Clinical Notes */}
        <div>
          <label className="block font-serif font-bold text-gray-900 mb-1">
            General Therapist Observations & Continuity Notes
          </label>
          <textarea
            value={generalObservations}
            onChange={(e) => setGeneralObservations(e.target.value)}
            rows={2}
            placeholder="e.g. Swedana sweating was uniform. Patient felt relaxed and was advised to rest for 30 minutes."
            className="w-full rounded-xl border border-ayur-sand/80 p-2.5 text-xs bg-[#fbf9f5] focus:outline-none focus:ring-2 focus:ring-ayur-primary"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ObservationEntryModal;
