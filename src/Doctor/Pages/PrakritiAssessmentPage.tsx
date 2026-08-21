// src/Doctor/Pages/PrakritiAssessmentPage.tsx
import React, { useState, useEffect } from 'react';
import { usePrakritiAssessment } from '../Hooks/usePrakritiAssessment';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { Patient } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { BackButton } from '../../Common/Components/BackButton';
import { PatientSwitcher } from '../Components/PatientSwitcher';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  HeartPulse,
  Stethoscope,
  FileText,
  ArrowRight,
} from 'lucide-react';

export interface PrakritiAssessmentPageProps {
  patient?: Patient;
  patientId?: string;
  patientName?: string;
  onProceedToPlan?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onReturnToPatients?: () => void;
}

export const PrakritiAssessmentPage: React.FC<PrakritiAssessmentPageProps> = ({
  patient,
  patientId,
  patientName,
  onProceedToPlan,
  onSelectPatient,
  onReturnToPatients,
}) => {
  const { data: patients = [] } = useGetPatientsQuery();

  const initialId =
    patient?.id ||
    patientId ||
    patients.find((p) => p.status === 'new' || p.status === 'prakriti_confirmed')?.id ||
    patients[0]?.id ||
    'PAT-104';

  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialId);

  useEffect(() => {
    if (patient?.id) {
      setSelectedPatientId(patient.id);
    } else if (patientId) {
      setSelectedPatientId(patientId);
    }
  }, [patient?.id, patientId]);

  const activePatient: Patient =
    patients.find((p) => p.id === selectedPatientId) ||
    patient || {
      id: selectedPatientId,
      name: patientName || 'Priya Sharma',
      gender: 'Female',
      age: 29,
      contact: '+91 98111 22334',
      chiefComplaint: 'Digestive disturbance',
      diagnosis: 'Amlapitta & Agnimandya',
      status: 'new',
      onboardedDate: '2026-08-18',
    };

  const {
    questions,
    answers,
    setAnswer,
    liveScore,
    pulseObservation,
    setPulseObservation,
    physicalExamNotes,
    setPhysicalExamNotes,
    doctorNotes,
    setDoctorNotes,
    isLocked,
    isLocking,
    lockFinalPrakriti,
  } = usePrakritiAssessment(selectedPatientId);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleLockSubmit = async () => {
    await lockFinalPrakriti();
    setConfirmModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {onReturnToPatients && <BackButton onClick={onReturnToPatients} label="Back" className="mt-0.5" />}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
                Prakriti Diagnostic Assessment
              </h1>
              <Badge variant="ayur" size="sm">
                Patient: {activePatient.name} ({activePatient.id})
              </Badge>
              {isLocked ? (
                <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Constitution Locked ({activePatient.dominantPrakriti || liveScore.dominant})
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  Evaluation Pending
                </Badge>
              )}
            </div>
            <p className="text-sm text-ayur-green-mid font-medium mt-1">
              Diagnostic evaluation for {activePatient.name} ({activePatient.diagnosis}) to compute baseline bio-energetic constitution.
            </p>
          </div>
        </div>

        {/* Dynamic Patient Switcher */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <PatientSwitcher
            selectedPatientId={selectedPatientId}
            onSelectPatient={(p: Patient) => {
              setSelectedPatientId(p.id);
              if (onSelectPatient) {
                onSelectPatient(p);
              }
            }}
          />

          {!isLocked ? (
            <Button
              variant="primary"
              icon={<Lock className="w-4 h-4" />}
              onClick={handleLockSubmit}
              disabled={isLocking}
            >
              {isLocking ? 'Locking...' : 'Confirm & Lock Prakriti'}
            </Button>
          ) : (
            onProceedToPlan && (
              <Button
                variant="primary"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={onProceedToPlan}
              >
                Proceed to Therapy Plan Builder
              </Button>
            )
          )}
        </div>
      </div>




      {/* Main Grid: Questions on Left (2 cols), Live Score & Clinical Notes on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: 10 Diagnostic Questions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
            Diagnostic Questionnaire Bank (10 Questions for {activePatient.name})
          </span>

          {questions.map((q, idx) => (
            <Card key={`${selectedPatientId}-${q.id}`} className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-ayur-primary font-bold text-xs flex items-center justify-center font-serif border border-emerald-200 shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 font-serif">
                    {q.text}
                  </h4>
                </div>
                {q.sanskritTerm && (
                  <span className="text-[10px] text-ayur-brown font-bold bg-[#fbf9f5] border border-ayur-sand/80 px-2 py-0.5 rounded-md">
                    {q.sanskritTerm}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition text-xs ${
                        isSelected
                          ? 'border-ayur-primary bg-emerald-50/50 text-ayur-primary font-bold shadow-2xs'
                          : 'border-ayur-sand/70 bg-[#fbf9f5] text-gray-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`${selectedPatientId}-${q.id}`}
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => setAnswer(q.id, opt.id)}
                        className="mt-0.5 accent-ayur-primary"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span>{opt.text}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            opt.dosha === 'Vata'
                              ? 'bg-blue-100 text-blue-800'
                              : opt.dosha === 'Pitta'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {opt.dosha}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Right 1 Col: Sticky Live Score Widget & Clinical Notes */}
        <div className="flex flex-col gap-4 sticky top-6">
          {/* Live Score Widget */}
          <Card className="p-5 flex flex-col gap-4 bg-white border-2 border-ayur-sand/90 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ayur-primary font-serif flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Bio-Energetic Dosha Score
              </span>
              <Badge variant="ayur" size="sm">
                Computed
              </Badge>
            </div>

            {/* Dosha Breakdown Bars */}
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-gray-800 mb-1">
                  <span>Vata Dosha (Air/Ether)</span>
                  <span className="text-blue-800">{liveScore.vata}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${liveScore.vata}%` }}
                    className="h-full bg-blue-600 transition-all duration-500"
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-800 mb-1">
                  <span>Pitta Dosha (Fire/Water)</span>
                  <span className="text-amber-700">{liveScore.pitta}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${liveScore.pitta}%` }}
                    className="h-full bg-amber-500 transition-all duration-500"
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-gray-800 mb-1">
                  <span>Kapha Dosha (Earth/Water)</span>
                  <span className="text-teal-700">{liveScore.kapha}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${liveScore.kapha}%` }}
                    className="h-full bg-teal-600 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>

            {/* Dominant Constitution Result Box */}
            <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand text-center flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Tentative Dominant Constitution
              </span>
              <span className="text-base font-black font-serif text-ayur-primary">
                {liveScore.dominant}
              </span>
              <span className="text-[10px] text-ayur-green-mid font-medium">
                Primary Tridoshic equilibrium baseline
              </span>
            </div>
          </Card>

          {/* Clinical Examination Notes */}
          <Card className="p-5 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-ayur-primary" />
              Nadi Pariksha & Pulse Observation
            </span>
            <textarea
              rows={2}
              value={pulseObservation}
              onChange={(e) => setPulseObservation(e.target.value)}
              placeholder="e.g. Sarpa gati, 76 bpm..."
              className="rounded-xl border border-ayur-sand/80 p-2 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary resize-none"
            />

            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif flex items-center gap-1.5 pt-2">
              <Stethoscope className="w-3.5 h-3.5 text-ayur-primary" />
              Physical Examination Notes
            </span>
            <textarea
              rows={2}
              value={physicalExamNotes}
              onChange={(e) => setPhysicalExamNotes(e.target.value)}
              placeholder="e.g. Lumbar spasm, dry skin..."
              className="rounded-xl border border-ayur-sand/80 p-2 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary resize-none"
            />
          </Card>
        </div>
      </div>



      {/* Post Lock Modal Prompt */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Prakriti Baseline Locked Successfully"
        subtitle={`Clinical constitution set to ${liveScore.dominant} for ${activePatient.name}.`}
        maxWidth="md"
      >
        <div className="flex flex-col gap-4 text-xs text-center py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <p className="text-gray-700 font-medium text-sm">
            Would you like to proceed immediately to select an AYUSH therapy package and author the therapy plan for {activePatient.name}?
          </p>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setConfirmModalOpen(false);
                if (onReturnToPatients) onReturnToPatients();
              }}
            >
              Not Now (Return to Directory)
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                setConfirmModalOpen(false);
                if (onProceedToPlan) onProceedToPlan();
              }}
            >
              Create Therapy Plan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrakritiAssessmentPage;
