// src/Therapist/Components/ClinicalNotesModal.tsx
import React from 'react';
import {
  Stethoscope,
  HeartPulse,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Activity,
  Package,
  FileText,
  AlertOctagon,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Modal } from '../../Common/Components/Modal';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Card } from '../../Common/Components/Card';
import { EmptyState } from '../../Common/Components/EmptyState';
import { TherapistSession } from '../types/therapist.types';
import { usePatientClinicalHistory } from '../Hooks/usePatientClinicalHistory';

export interface ClinicalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string;
  session?: TherapistSession | null;
}

export const ClinicalNotesModal: React.FC<ClinicalNotesModalProps> = ({
  isOpen,
  onClose,
  patientId,
  session,
}) => {
  const { clinicalData, hasHistory, hasAllergies } = usePatientClinicalHistory(
    patientId || session?.patientId,
    session
  );

  if (!clinicalData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comprehensive Patient Clinical Record & History"
      subtitle={`Complete Doctor Plan & Chronological Session Log: ${clinicalData.name} (${clinicalData.patientId})`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>AyurSutra EMR Synchronized</span>
            <span>•</span>
            <span className="text-ayur-primary font-bold">AYUSH Standard Protocol</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} type="button">
            Close Record
          </Button>
        </div>
      }
    >
      <div className="space-y-5 text-xs text-gray-700">
        {/* ── 1. Top Alert: Allergy & Contraindication Banner (Sticky) ── */}
        {hasAllergies && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3 shadow-2xs">
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-rose-950 text-xs tracking-wide uppercase">
                  Known Allergies & Clinical Contraindications
                </span>
                <Badge variant="danger" size="sm">
                  Caution Required
                </Badge>
              </div>
              <ul className="mt-1 space-y-0.5 text-rose-900 font-medium">
                {clinicalData.allergyHistory.map((allergy, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>{allergy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── 2. Patient Demographics & Continuity Strip ── */}
        <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ayur-primary text-white font-serif font-black text-sm shadow-xs shrink-0">
              {clinicalData.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-gray-900 text-sm sm:text-base">
                  {clinicalData.name}
                </h3>
                <span className="text-xs font-semibold text-gray-500">
                  ({clinicalData.age}y, {clinicalData.gender})
                </span>
                <span className="text-[10px] font-bold text-ayur-brown bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {clinicalData.patientId}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Contact: {clinicalData.contact} • {clinicalData.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {clinicalData.sameGenderMatched && (
              <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-700" />}>
                Gender Matched
              </Badge>
            )}
            {clinicalData.isConsecutiveWithSameTherapist && (
              <Badge variant="info" size="sm">
                Same Therapist Continuity
              </Badge>
            )}
            <Badge variant="ayur" size="sm">
              Day {clinicalData.currentDay} of {clinicalData.totalDays} Total
            </Badge>
          </div>
        </div>

        {/* ── 3. Doctor's Diagnosis & Treatment Plan Overview ── */}
        <Card className="p-4 sm:p-5 border border-ayur-sand/80 bg-white space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <span className="font-serif font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-ayur-primary" />
              Doctor Prescribed Clinical Blueprint
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Prakriti:</span>
              <Badge variant="warning" size="sm">
                {clinicalData.dominantPrakriti}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60">
              <span className="text-[10px] font-bold text-ayur-green-mid uppercase block mb-0.5">
                Ayurvedic Diagnosis
              </span>
              <span className="font-serif font-black text-gray-900 text-xs sm:text-sm block">
                {clinicalData.diagnosis}
              </span>
              {clinicalData.chiefComplaint && (
                <p className="text-[11px] text-gray-600 mt-1 leading-snug">
                  <strong>Complaint:</strong> {clinicalData.chiefComplaint}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60">
              <span className="text-[10px] font-bold text-ayur-green-mid uppercase block mb-0.5">
                Prescribed Package Protocol
              </span>
              <span className="font-serif font-black text-ayur-primary text-xs sm:text-sm block">
                {clinicalData.assignedPackageName}
              </span>
              <p className="text-[11px] text-gray-600 mt-1">
                <strong>Schedule:</strong> {clinicalData.totalDays} Continuous Therapy Days
              </p>
            </div>
          </div>

          {/* Doctor Remarks & Instructions */}
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
              <span className="font-serif font-bold text-amber-950 flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Doctor's Clinical Notes & Specific Instructions
              </span>
              <p className="text-amber-900 font-medium leading-relaxed">
                {clinicalData.doctorRemarks}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60 text-xs">
              <span className="font-serif font-bold text-gray-900 block mb-0.5">
                Standard Pre-Procedure Preparation & Dosage Guideline:
              </span>
              <p className="text-gray-700 leading-relaxed font-medium">
                {clinicalData.doctorInstructions}
              </p>
            </div>
          </div>
        </Card>

        {/* ── 4. Chronological Session-by-Session History ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif font-black text-gray-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-ayur-primary" />
              Chronological Session-by-Session History ({clinicalData.history.length} Entries)
            </h4>
            <span className="text-[11px] text-gray-500 font-medium">Most recent first</span>
          </div>

          {!hasHistory ? (
            <EmptyState
              title="No Previous Clinical History"
              message="This is the patient's first session in this protocol. Clinical notes recorded during today's procedure will appear here."
              icon={<Sparkles className="w-8 h-8 text-ayur-green-mid" />}
            />
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {clinicalData.history.map((record, idx) => {
                const isAbnormal = record.patientResponse === 'Abnormal' || record.complicationFlag;

                return (
                  <Card
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAbnormal
                        ? 'bg-rose-50/40 border-rose-300 shadow-2xs'
                        : 'bg-white border-ayur-sand/80'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs bg-ayur-primary text-white px-2.5 py-0.5 rounded-md">
                          Day {record.day}
                        </span>
                        <span className="font-serif font-bold text-gray-900 text-xs sm:text-sm">
                          {record.stage}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-ayur-green-mid" />
                          {record.date}
                        </span>
                        <Badge
                          variant={isAbnormal ? 'danger' : 'success'}
                          size="sm"
                          icon={
                            isAbnormal ? (
                              <XCircle className="w-3 h-3 text-rose-700" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            )
                          }
                        >
                          {isAbnormal ? 'Flagged / Complication' : 'Well Tolerated'}
                        </Badge>
                      </div>
                    </div>

                    {/* Vitals Grid Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-[#fbf9f5] p-2.5 rounded-xl border border-ayur-sand/60 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Blood Pressure
                        </span>
                        <span className="font-bold text-gray-900 font-serif">
                          {record.bp || '120/80'} mmHg
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Pulse Rate
                        </span>
                        <span className="font-bold text-gray-900 font-serif">
                          {record.pulse || 72} BPM
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          VAS Pain Score
                        </span>
                        <span
                          className={`font-serif font-bold ${
                            record.vasScore && record.vasScore > 5
                              ? 'text-rose-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {record.vasScore !== undefined ? `${record.vasScore} / 10` : 'Not Scored'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">
                          Agni Status
                        </span>
                        <span className="font-bold text-ayur-primary font-serif">
                          {record.agniStatus || 'Sama'}
                        </span>
                      </div>
                    </div>

                    {/* Dosage & Therapist Notes */}
                    <div className="space-y-1.5 text-xs text-gray-700">
                      {record.dosageGiven && (
                        <div className="flex items-start gap-1.5 text-[11px]">
                          <Package className="w-3.5 h-3.5 text-ayur-green-mid shrink-0 mt-0.5" />
                          <span>
                            <strong>Dosage Administered:</strong> {record.dosageGiven}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-1.5 text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-ayur-primary shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong>Therapist Notes:</strong> {record.notes}
                        </p>
                      </div>

                      {record.complicationNotes && (
                        <div className="p-2 rounded-lg bg-rose-100/70 border border-rose-200 text-rose-950 text-[11px]">
                          <strong>Adverse Reaction Log:</strong> {record.complicationNotes}
                        </div>
                      )}

                      <div className="text-[10px] text-gray-500 pt-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>Administered by: <strong>{record.therapist}</strong></span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClinicalNotesModal;
