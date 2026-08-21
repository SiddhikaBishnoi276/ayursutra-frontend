// src/Doctor/Pages/TherapyPlanBuilderPage.tsx
// Unified Single-Page Patient-Wise Flow: Therapy Protocols & Plan Builder
import React, { useState, useEffect, useMemo } from 'react';
import { useTherapyPlanBuilder } from '../Hooks/useTherapyPlanBuilder';
import { useTherapyPackages } from '../Hooks/useTherapyPackages';
import { useGetPatientsQuery } from '../apis/doctorApi';
import { Patient, TherapyPackage, TherapyStage } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { TherapyStageEditor } from '../Components/TherapyStageEditor';
import { TherapistSelector } from '../Components/TherapistSelector';
import { PrescriptionEditor } from '../Components/PrescriptionEditor';
import { PatientSwitcher } from '../Components/PatientSwitcher';
import { BackButton } from '../../Common/Components/BackButton';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';

export interface TherapyPlanBuilderPageProps {
  patient?: Patient;
  initialPatientId?: string;
  initialPackage?: TherapyPackage;
  initialStep?: 'packages' | 'builder';
  mode?: 'clinic' | 'solo';
  onPlanCreated?: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onBack?: () => void;
}

export const TherapyPlanBuilderPage: React.FC<TherapyPlanBuilderPageProps> = ({
  patient,
  initialPatientId,
  initialPackage,
  initialStep = 'packages',
  mode = 'clinic',
  onPlanCreated,
  onSelectPatient,
  onBack,
}) => {
  const { data: patients = [] } = useGetPatientsQuery();

  const defaultPatientId =
    patient?.id ||
    initialPatientId ||
    patients.find((p) => p.status === 'prakriti_confirmed' || p.status === 'new')?.id ||
    patients[0]?.id ||
    'PAT-101';

  const [selectedPatientId, setSelectedPatientId] = useState<string>(defaultPatientId);

  // Sync if prop changes
  useEffect(() => {
    if (patient?.id) {
      setSelectedPatientId(patient.id);
    } else if (initialPatientId) {
      setSelectedPatientId(initialPatientId);
    }
  }, [patient?.id, initialPatientId]);

  // Find active patient object
  const activePatient: Patient =
    patients.find((p) => p.id === selectedPatientId) ||
    patient || {
      id: selectedPatientId || 'PAT-101',
      name: 'Rahul Verma',
      age: 42,
      gender: 'Male',
      contact: '+91 98765 43210',
      email: 'rahul.verma@example.com',
      chiefComplaint: 'Chronic lower back stiffness (Katigraha)',
      diagnosis: 'Vata-Kaphaja Katigraha',
      status: 'prakriti_confirmed',
      onboardedDate: '2026-08-12',
      dominantPrakriti: 'Vata-Pitta',
    };

  // Step state: 'packages' (Step 1) | 'builder' (Step 2)
  const [currentStep, setCurrentStep] = useState<'packages' | 'builder'>(
    initialPackage ? 'builder' : initialStep
  );

  // Package hooks
  const {
    packages: allPackages,
    getRecommendedPackages,
    checkSimilarity,
    createPackage,
  } = useTherapyPackages();

  const [expandedPackageId, setExpandedPackageId] = useState<string | null>('PKG-01');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Builder hook
  const {
    packages,
    activePackage,
    selectedPackageId,
    setSelectedPackageId,
    customStages,
    updateStageDuration,
    rankedTherapists,
    selectedTherapistId,
    setSelectedTherapistId,
    startDate,
    setStartDate,
    dietItems,
    addDietItem,
    removeDietItem,
    medicines,
    addMedicine,
    removeMedicine,
    confirmAndDispatchPlan,
    createdPlan,
    isSubmitting,
  } = useTherapyPlanBuilder({
    patientId: activePatient.id,
    patientName: activePatient.name,
    patientContact: activePatient.contact,
    patientGender: activePatient.gender,
    patientDiagnosis: activePatient.diagnosis,
    patientPrakriti: activePatient.dominantPrakriti,
    initialPackageId: initialPackage?.id,
    mode,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Patient-matched packages list
  const displayedPackages = useMemo(() => {
    return getRecommendedPackages(activePatient.diagnosis, activePatient.dominantPrakriti);
  }, [allPackages, activePatient.diagnosis, activePatient.dominantPrakriti]);

  // Transition to Step 2 with selected package
  const handleSelectPackage = (pkg: TherapyPackage) => {
    setSelectedPackageId(pkg.id);
    setCurrentStep('builder');
    setIsSubmitted(false);
  };

  const handleConfirmPlan = async () => {
    await confirmAndDispatchPlan();
    setIsSubmitted(true);
  };

  const totalPlanDays = customStages.reduce((acc: number, s: TherapyStage) => acc + s.durationDays, 0);

  // --- Create New Package Modal Form State ---
  const [pkgName, setPkgName] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgTargetDosha, setPkgTargetDosha] = useState(activePatient.dominantPrakriti || 'Pitta-Vata');
  const [pkgDiet, setPkgDiet] = useState('Light Laghu Ahara during treatment.');
  const [newStages, setNewStages] = useState<TherapyStage[]>([
    {
      id: 'S-NEW-1',
      name: 'Deepana & Pachana Priming',
      category: 'Poorvakarma',
      dayOffset: 1,
      durationDays: 2,
      durationMinutes: 45,
      preInstructions: 'Trikatu Churna with warm water on empty stomach.',
      postInstructions: 'Assess Agni, light mung soup.',
    },
    {
      id: 'S-NEW-2',
      name: 'Abhyanga & Swedana Snehana',
      category: 'Poorvakarma',
      dayOffset: 3,
      durationDays: 3,
      durationMinutes: 60,
      preInstructions: 'Empty bladder. Full body warm medicated oil massage.',
      postInstructions: 'Warm sponge bath, avoid direct air breeze.',
    },
    {
      id: 'S-NEW-3',
      name: 'Pradhana Procedure Karma',
      category: 'Pradhanakarma',
      dayOffset: 6,
      durationDays: 1,
      durationMinutes: 120,
      preInstructions: 'Administer classical evacuation formulation at 07:00 AM.',
      postInstructions: 'Record Vegas, hydration with warm herbal water.',
    },
    {
      id: 'S-NEW-4',
      name: 'Samsarjana Krama Recovery',
      category: 'Paschatkarma',
      dayOffset: 7,
      durationDays: 2,
      durationMinutes: 30,
      preInstructions: 'Manda, Peya, Vilepi sequential dietary restoration.',
      postInstructions: 'Transition back to normal light diet.',
    },
  ]);
  const [matchedSimilarity, setMatchedSimilarity] = useState<TherapyPackage | null>(null);

  const handleCreatePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    const duplicate = checkSimilarity(pkgName, pkgTargetDosha);
    if (duplicate && !matchedSimilarity) {
      setMatchedSimilarity(duplicate);
      return;
    }

    const created = await createPackage({
      name: pkgName,
      description: pkgDescription,
      targetDosha: pkgTargetDosha,
      durationDays: newStages.reduce((acc, s) => acc + s.durationDays, 0),
      stages: newStages,
      baseDietGuidelines: pkgDiet,
    });

    setCreateModalOpen(false);
    setMatchedSimilarity(null);
    if (created) {
      handleSelectPackage(created);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && <BackButton onClick={onBack} label="Back" className="mt-0.5" />}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
                {currentStep === 'packages'
                  ? 'Therapy Protocols & Plan Blueprint'
                  : `Plan Customizer: ${activePackage?.name || 'Ayurvedic Protocol'}`}
              </h1>
              <Badge variant="ayur" size="sm">
                Patient: {activePatient.name} ({activePatient.id})
              </Badge>
              {activePatient.dominantPrakriti && (
                <Badge variant="info" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                  {activePatient.dominantPrakriti}
                </Badge>
              )}
              {mode === 'solo' && (
                <Badge variant="info" size="sm">
                  Solo Practitioner Mode
                </Badge>
              )}
            </div>
            <p className="text-sm text-ayur-green-mid font-medium mt-1">
              {currentStep === 'packages'
                ? `Select an AYUSH standardized protocol blueprint matched for ${activePatient.name} (${activePatient.diagnosis}).`
                : `Tailor therapy stage durations, assign specialist therapists, and generate clinical schedule for ${activePatient.name}.`}
            </p>
          </div>
        </div>

        {/* Dynamic Patient Switcher & Create Package Button */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <PatientSwitcher
            selectedPatientId={selectedPatientId}
            onSelectPatient={(p: Patient) => {
              setSelectedPatientId(p.id);
              setIsSubmitted(false);
              if (onSelectPatient) {
                onSelectPatient(p);
              }
            }}
          />

          {currentStep === 'packages' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setPkgName(`${activePatient.diagnosis} Custom Protocol`);
                setPkgTargetDosha(activePatient.dominantPrakriti || 'Pitta-Vata');
                setCreateModalOpen(true);
              }}
            >
              Create New Package
            </Button>
          )}
        </div>
      </div>

      {/* Step Indicator Flow Bar */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-ayur-sand/80 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 overflow-x-auto pb-1 sm:pb-0">
          {/* Step 1 Tab Button */}
          <button
            type="button"
            onClick={() => setCurrentStep('packages')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
              currentStep === 'packages'
                ? 'bg-ayur-primary text-white shadow-xs'
                : 'text-gray-600 hover:bg-[#fbf9f5] hover:text-ayur-primary'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-serif ${
                currentStep === 'packages' ? 'bg-emerald-400/30 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              1
            </span>
            <span>Step 1: Protocol Blueprint Selection ({displayedPackages.length} Matched)</span>
          </button>

          <span className="text-gray-300 font-bold hidden sm:inline shrink-0">→</span>

          {/* Step 2 Tab Button */}
          <button
            type="button"
            onClick={() => setCurrentStep('builder')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
              currentStep === 'builder'
                ? 'bg-ayur-primary text-white shadow-xs'
                : 'text-gray-600 hover:bg-[#fbf9f5] hover:text-ayur-primary'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-serif ${
                currentStep === 'builder' ? 'bg-emerald-400/30 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              2
            </span>
            <span>Step 2: Stage Customization & Scheduling</span>
          </button>
        </div>

        {currentStep === 'builder' && (
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => setCurrentStep('packages')}
            className="shrink-0 w-full sm:w-auto"
          >
            Back to Protocols
          </Button>
        )}
      </div>

      {/* Warning banner if patient already has an active plan */}
      {(activePatient.status === 'in_progress' ||
        activePatient.status === 'completed' ||
        activePatient.status === 'flagged') && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2.5 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <strong>Existing Plan Notice:</strong> {activePatient.name} currently has status <strong className="uppercase">{activePatient.status}</strong> with {activePatient.assignedPackageName || 'active therapy'}. Selecting or customizing a package will schedule a new therapy cycle.
          </div>
        </div>
      )}

      {/* Success Confirmation Toast Banner */}
      {isSubmitted && createdPlan && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-bold font-serif text-emerald-900">
                Therapy Schedule & Sessions Generated Successfully!
              </h4>
              <p className="text-xs text-emerald-800 font-medium mt-0.5">
                Plan ID: <strong>{createdPlan.id}</strong> • Patient: <strong>{activePatient.name}</strong> • Total: <strong>{createdPlan.totalDays} Days</strong> • Mock SMS Credentials sent to {activePatient.contact}.
              </p>
            </div>
          </div>

          {onPlanCreated && (
            <Button variant="primary" size="sm" onClick={onPlanCreated}>
              Review AI Diet Plan
            </Button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: PROTOCOL & PACKAGE SELECTION VIEW                                */}
      {/* ========================================================================= */}
      {currentStep === 'packages' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {displayedPackages.map((pkg, idx) => {
              const isExpanded = expandedPackageId === pkg.id;
              const isSelected = selectedPackageId === pkg.id;
              const isTopMatch = idx === 0;

              return (
                <Card
                  key={pkg.id}
                  className={`p-5 flex flex-col justify-between transition-all relative border-2 ${
                    isSelected
                      ? 'border-ayur-primary bg-emerald-50/20 shadow-sm'
                      : 'border-ayur-sand/80 hover:border-ayur-primary/50'
                  }`}
                >
                  {isTopMatch && (
                    <span className="absolute -top-2.5 right-4 bg-amber-500 text-white font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1 border border-amber-600/20">
                      <Sparkles className="w-3 h-3 fill-white" /> Recommended Match
                    </span>
                  )}

                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block">
                          {pkg.id}
                        </span>
                        <h3 className="text-base font-black font-serif text-gray-900 leading-snug mt-0.5">
                          {pkg.name}
                        </h3>
                      </div>
                      <Badge variant="ayur" size="sm">
                        {pkg.targetDosha}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-700 bg-[#fbf9f5] p-2.5 rounded-xl border border-ayur-sand/70">
                      <div className="flex items-center gap-1 font-bold text-ayur-primary">
                        <Clock className="w-3.5 h-3.5 text-ayur-green-mid" />
                        <span>{pkg.durationDays} Days</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1 font-bold text-gray-700">
                        <Layers className="w-3.5 h-3.5 text-ayur-green-mid" />
                        <span>{pkg.stages?.length || 3} Stages</span>
                      </div>
                    </div>

                    {/* Expandable Stages Accordion */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                        className="w-full flex items-center justify-between text-xs font-bold text-ayur-primary hover:text-ayur-green-dark pt-1 cursor-pointer"
                      >
                        <span>View Protocol Stages & Procedures</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {isExpanded && pkg.stages && (
                        <div className="mt-2.5 flex flex-col gap-2 pt-2 border-t border-dashed border-ayur-sand/80 text-xs">
                          {pkg.stages.map((stage, sIdx) => (
                            <div
                              key={stage.id || sIdx}
                              className="bg-white p-2.5 rounded-xl border border-gray-100 flex flex-col gap-1"
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-ayur-primary font-serif">
                                  {sIdx + 1}. {stage.name}
                                </span>
                                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                                  {stage.durationDays} {stage.durationDays === 1 ? 'Day' : 'Days'}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">
                                <strong>Pre:</strong> {stage.preInstructions}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                <strong>Post:</strong> {stage.postInstructions}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary CTA: Select This Package */}
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <Button
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      icon={<ArrowRight className="w-4 h-4" />}
                      onClick={() => handleSelectPackage(pkg)}
                      className="w-full"
                    >
                      {isSelected ? 'Continue with This Blueprint' : 'Select This Package'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Bottom Card for Custom Blueprint creation */}
          <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-ayur-sand/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold font-serif text-gray-900">
                Need a Bespoke Protocol for {activePatient.name}?
              </h4>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                Author custom stage sequences, duration timings, and pre/post clinical directives from scratch.
              </p>
            </div>
            <Button
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setPkgName(`${activePatient.diagnosis} Custom Protocol`);
                setPkgTargetDosha(activePatient.dominantPrakriti || 'Pitta-Vata');
                setCreateModalOpen(true);
              }}
            >
              Build Custom Protocol from Scratch
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: STAGE CUSTOMIZATION & SCHEDULING VIEW                             */}
      {/* ========================================================================= */}
      {currentStep === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
          {/* Left 2 Cols: Blueprint, Stages & Prescriptions */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Package Selection Card */}
            <Card className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ayur-primary font-serif flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Selected Protocol Blueprint
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
                    Diagnosis: <strong>{activePatient.diagnosis}</strong> ({activePatient.chiefComplaint})
                  </span>
                </div>
                <Badge variant="ayur" size="sm">
                  {activePackage?.targetDosha || 'Pitta-Vata'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                    Therapy Package Blueprint
                  </label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs font-bold text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary cursor-pointer"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.durationDays} Days)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-gray-700 tracking-wider">
                    Therapy Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="rounded-xl border border-ayur-sand/80 px-3 py-1.5 text-xs font-bold text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
                  />
                </div>
              </div>
            </Card>

            {/* Stage Customizer */}
            <Card className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold font-serif text-gray-900">
                    Stage Sequence Customizer ({customStages.length} Stages)
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Adjust duration per stage specifically for {activePatient.name}'s constitution.
                  </p>
                </div>

                <Badge variant="info" size="sm">
                  Total: {totalPlanDays} Days
                </Badge>
              </div>

              <TherapyStageEditor
                stages={customStages}
                onUpdateDuration={updateStageDuration}
                isCustomizable={true}
              />
            </Card>

            {/* Prescriptions */}
            <Card className="p-5">
              <PrescriptionEditor
                medicines={medicines}
                onAdd={addMedicine}
                onRemove={removeMedicine}
              />
            </Card>
          </div>

          {/* Right 1 Col: Therapist Selection & Diet Notes */}
          <div className="flex flex-col gap-5 sticky top-6">
            {/* Action Button */}
            {!isSubmitted ? (
              <Button
                variant="primary"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleConfirmPlan}
                disabled={isSubmitting}
                className="w-full py-3 shadow-md"
              >
                {isSubmitting ? 'Generating Schedule...' : 'Confirm Plan & Generate Schedule'}
              </Button>
            ) : (
              onPlanCreated && (
                <Button
                  variant="primary"
                  icon={<ArrowRight className="w-4 h-4" />}
                  onClick={onPlanCreated}
                  className="w-full py-3 shadow-md"
                >
                  Continue to AI Diet & Yoga Review
                </Button>
              )
            )}

            {/* Therapist Assignment (Clinic Mode Only) */}
            {mode === 'clinic' ? (
              <Card className="p-5">
                <TherapistSelector
                  therapists={rankedTherapists}
                  selectedId={selectedTherapistId}
                  onSelect={setSelectedTherapistId}
                />
              </Card>
            ) : (
              <Card className="p-5 bg-amber-50/40 border border-amber-200">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-serif block">
                  Solo Practitioner Mode Active
                </span>
                <p className="text-xs text-amber-800 font-medium mt-1">
                  Therapy sessions are automatically self-assigned to your clinical calendar.
                </p>
              </Card>
            )}

            {/* Diet Notes */}
            <Card className="p-5 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ayur-primary font-serif flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Custom Dietary Directives
              </span>

              <div className="flex flex-wrap gap-1.5">
                {dietItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#fbf9f5] border border-ayur-sand/80 px-2 py-0.5 rounded-lg text-gray-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeDietItem(idx)}
                      className="text-gray-400 hover:text-rose-600 text-xs ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="Add custom diet note..."
                  className="flex-1 rounded-xl border border-ayur-sand/80 px-2.5 py-1 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDietItem((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW PACKAGE & SIMILARITY CHECK                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setMatchedSimilarity(null);
        }}
        title="Author New AYUSH Therapy Protocol"
        subtitle={`Define stage sequence, durations, and dietary directives for ${activePatient.name}.`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePackageSubmit} className="flex flex-col gap-4 text-xs">
          {matchedSimilarity && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold font-serif text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Similar Standardized Package Found: "{matchedSimilarity.name}"
              </div>
              <p className="text-[11px] text-amber-800">
                An existing AYUSH protocol with the same target Dosha ({matchedSimilarity.targetDosha}) already exists.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setMatchedSimilarity(null);
                    handleSelectPackage(matchedSimilarity);
                  }}
                >
                  Use Existing Standard Package
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setMatchedSimilarity(null);
                    // continue creation
                  }}
                >
                  Continue Creating Custom Protocol
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase text-[10px]">Package Name *</label>
              <input
                type="text"
                required
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
                placeholder="e.g. 14-Day Vata-Kaphaja Basti Protocol"
                className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-700 uppercase text-[10px]">Target Dosha *</label>
              <select
                value={pkgTargetDosha}
                onChange={(e) => setPkgTargetDosha(e.target.value)}
                className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
              >
                <option value="Vata-Pitta">Vata-Pitta</option>
                <option value="Pitta-Vata">Pitta-Vata</option>
                <option value="Vata-Kapha">Vata-Kapha</option>
                <option value="Kapha-Vata">Kapha-Vata</option>
                <option value="Pitta-Kapha">Pitta-Kapha</option>
                <option value="Tridoshic">Tridoshic</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-700 uppercase text-[10px]">Clinical Description & Indications</label>
            <textarea
              rows={2}
              value={pkgDescription}
              onChange={(e) => setPkgDescription(e.target.value)}
              placeholder="Indicated for degenerative lumbar disorders, sciatica, and deep seated Vata."
              className="rounded-xl border border-ayur-sand/80 p-2.5 text-xs bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-700 uppercase text-[10px]">Base Diet Guidelines</label>
            <input
              type="text"
              value={pkgDiet}
              onChange={(e) => setPkgDiet(e.target.value)}
              placeholder="e.g. Light warm diet, avoid spicy & sour foods."
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
            />
          </div>

          {/* Stage Editor inside Modal */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 font-serif">
                Protocol Stages ({newStages.length} Stages • Total {newStages.reduce((a, s) => a + s.durationDays, 0)} Days)
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Plus className="w-3 h-3" />}
                onClick={() => {
                  const last = newStages[newStages.length - 1];
                  const newStage: TherapyStage = {
                    id: `S-NEW-${Date.now().toString().slice(-4)}`,
                    name: 'Additional Therapeutic Karma',
                    category: 'Pradhanakarma',
                    dayOffset: last ? last.dayOffset + last.durationDays : 1,
                    durationDays: 1,
                    durationMinutes: 45,
                    preInstructions: 'Standard empty-stomach preparation.',
                    postInstructions: 'Post-procedure rest and light diet.',
                  };
                  setNewStages([...newStages, newStage]);
                }}
              >
                Add Stage
              </Button>
            </div>

            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
              {newStages.map((s, idx) => (
                <div key={s.id || idx} className="p-3 rounded-xl bg-[#fbf9f5] border border-ayur-sand/70 flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => {
                        const next = [...newStages];
                        next[idx].name = e.target.value;
                        setNewStages(next);
                      }}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs bg-white"
                      placeholder="Stage Name"
                    />
                    <select
                      value={s.category}
                      onChange={(e) => {
                        const next = [...newStages];
                        next[idx].category = e.target.value as any;
                        setNewStages(next);
                      }}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs bg-white"
                    >
                      <option value="Poorvakarma">Poorvakarma</option>
                      <option value="Pradhanakarma">Pradhanakarma</option>
                      <option value="Paschatkarma">Paschatkarma</option>
                    </select>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={s.durationDays}
                        onChange={(e) => {
                          const next = [...newStages];
                          next[idx].durationDays = Math.max(1, parseInt(e.target.value) || 1);
                          setNewStages(next);
                        }}
                        className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-xs bg-white"
                      />
                      <span className="text-[10px] text-gray-500">Days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateModalOpen(false);
                setMatchedSimilarity(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Author Plan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TherapyPlanBuilderPage;
