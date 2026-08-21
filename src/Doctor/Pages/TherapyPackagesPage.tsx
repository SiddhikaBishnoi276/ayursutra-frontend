// src/Doctor/Pages/TherapyPackagesPage.tsx
import React, { useState } from 'react';
import { useTherapyPackages } from '../Hooks/useTherapyPackages';
import { TherapyPackage, TherapyStage, Patient } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { TherapyStageEditor } from '../Components/TherapyStageEditor';
import { BackButton } from '../../Common/Components/BackButton';
import {
  Plus,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';

export interface TherapyPackagesPageProps {
  patient?: Patient;
  onSelectPackageForPlan?: (pkg: TherapyPackage) => void;
  onBack?: () => void;
}

export const TherapyPackagesPage: React.FC<TherapyPackagesPageProps> = ({
  patient,
  onSelectPackageForPlan,
  onBack,
}) => {
  const { packages, getRecommendedPackages, checkSimilarity, createPackage } = useTherapyPackages();

  const [expandedId, setExpandedId] = useState<string | null>('PKG-01');
  const [modalOpen, setModalOpen] = useState(false);

  const displayedPackages = patient
    ? getRecommendedPackages(patient.diagnosis, patient.dominantPrakriti)
    : packages;

  // New Package form state
  const [pkgName, setPkgName] = useState('');
  const [pkgDescription, setPkgDescription] = useState('');
  const [pkgTargetDosha, setPkgTargetDosha] = useState('Pitta-Vata');
  const [pkgDiet, setPkgDiet] = useState('');
  const [stageErrors, setStageErrors] = useState<{ [index: number]: { [field: string]: string } }>({});
  const [stages, setStages] = useState<TherapyStage[]>([
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
      preInstructions: 'Empty bladder. Full body warm oil massage.',
      postInstructions: 'Warm sponge bath, avoid breeze.',
    },
    {
      id: 'S-NEW-3',
      name: 'Pradhana Procedure Karma',
      category: 'Pradhanakarma',
      dayOffset: 6,
      durationDays: 1,
      durationMinutes: 120,
      preInstructions: 'Administer classical evacuation formulation at 07:00 AM.',
      postInstructions: 'Record Vegas, hydration with warm water.',
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

  const handleStageUpdate = (index: number, updated: Partial<TherapyStage>) => {
    const next = [...stages];
    next[index] = { ...next[index], ...updated };
    setStages(next);

    if (stageErrors[index]) {
      const nextErrors = { ...stageErrors };
      delete nextErrors[index];
      setStageErrors(nextErrors);
    }
  };

  const handleAddStage = () => {
    const last = stages[stages.length - 1];
    const newDayOffset = last ? last.dayOffset + last.durationDays : 1;
    const newStage: TherapyStage = {
      id: `S-NEW-${Date.now().toString().slice(-4)}`,
      name: 'New Therapeutic Karma',
      category: 'Pradhanakarma',
      dayOffset: newDayOffset,
      durationDays: 1,
      durationMinutes: 45,
      preInstructions: 'Standard empty-stomach preparation.',
      postInstructions: 'Post-procedure rest and light diet.',
    };
    setStages([...stages, newStage]);
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length <= 1) return;
    const next = stages.filter((_, i) => i !== index);
    setStages(next);
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stages.length) return;

    const next = [...stages];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;

    let currentDay = 1;
    for (let i = 0; i < next.length; i++) {
      next[i] = { ...next[i], dayOffset: currentDay };
      currentDay += next[i].durationDays;
    }

    setStages(next);
  };

  const totalDuration = stages.reduce((acc, s) => acc + s.durationDays, 0);

  const validateStages = (): boolean => {
    const errors: { [index: number]: { [field: string]: string } } = {};
    let hasError = false;

    stages.forEach((stage, idx) => {
      const e: { [field: string]: string } = {};
      if (!stage.name || !stage.name.trim()) {
        e.name = 'Stage name is required';
        hasError = true;
      }
      if (!stage.preInstructions || !stage.preInstructions.trim()) {
        e.preInstructions = 'Pre-procedure protocol is required';
        hasError = true;
      }
      if (!stage.postInstructions || !stage.postInstructions.trim()) {
        e.postInstructions = 'Post-procedure care notes are required';
        hasError = true;
      }
      if (stage.durationDays < 1) {
        e.durationDays = 'Minimum 1 day';
        hasError = true;
      }
      if (Object.keys(e).length > 0) {
        errors[idx] = e;
      }
    });

    setStageErrors(errors);
    return !hasError;
  };

  const handleCheckAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStages()) return;

    const duplicate = checkSimilarity(pkgName, pkgTargetDosha);
    if (duplicate && !matchedSimilarity) {
      setMatchedSimilarity(duplicate);
      return;
    }

    await createPackage({
      name: pkgName,
      description: pkgDescription,
      targetDosha: pkgTargetDosha,
      durationDays: totalDuration,
      stages,
      baseDietGuidelines: pkgDiet,
    });

    setModalOpen(false);
    setMatchedSimilarity(null);
    setStageErrors({});
    setPkgName('');
    setPkgDescription('');
  };

  const handleUseExistingFromWarning = (existing: TherapyPackage) => {
    setModalOpen(false);
    setMatchedSimilarity(null);
    if (onSelectPackageForPlan) {
      onSelectPackageForPlan(existing);
    }
  };

  const handleForceContinueCreating = async () => {
    if (!validateStages()) return;

    await createPackage({
      name: pkgName,
      description: pkgDescription,
      targetDosha: pkgTargetDosha,
      durationDays: totalDuration,
      stages,
      baseDietGuidelines: pkgDiet,
    });

    setModalOpen(false);
    setMatchedSimilarity(null);
    setStageErrors({});
    setPkgName('');
    setPkgDescription('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {onBack && <BackButton onClick={onBack} label="Back" className="mt-0.5" />}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
                Therapy Protocols & Packages
              </h1>
              {patient && (
                <Badge variant="ayur" size="sm">
                  Patient: {patient.name} ({patient.dominantPrakriti || 'Prakriti Locked'})
                </Badge>
              )}
            </div>
            <p className="text-sm text-ayur-green-mid font-medium mt-1">
              {patient
                ? `Select an AYUSH-matched protocol tailored for ${patient.name}'s diagnosis (${patient.diagnosis}).`
                : 'Browse verified Panchakarma protocols or author customized clinical therapy packages.'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setMatchedSimilarity(null);
            setModalOpen(true);
          }}
        >
          Create New Package
        </Button>
      </div>

      {/* Recommended Match vs All Packages */}
      <div className="flex flex-col gap-4">
        {displayedPackages.map((pkg, idx) => {
          const isExpanded = expandedId === pkg.id;
          const isRecommended = idx === 0 && (pkg.matchScore || 0) > 80;

          return (
            <Card
              key={pkg.id}
              className={`flex flex-col gap-3 transition-all ${
                isRecommended ? 'border-2 border-amber-400 bg-amber-50/10' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-ayur-primary flex items-center justify-center font-serif font-bold text-sm border border-emerald-200 shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-gray-900 font-serif">
                        {pkg.name}
                      </h3>
                      {isRecommended && (
                        <span className="bg-amber-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1.5 border border-amber-600/20">
                          <Sparkles className="w-3.5 h-3.5 fill-white" /> Recommended Match
                        </span>
                      )}
                      <Badge variant="ayur" size="sm">
                        {pkg.durationDays} Days Duration
                      </Badge>
                      <Badge variant="info" size="sm">
                        {pkg.targetDosha}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : pkg.id)}
                  >
                    {isExpanded ? (
                      <span className="flex items-center gap-1">
                        Hide Stages <ChevronUp className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        View {pkg.stages.length} Stages <ChevronDown className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  {onSelectPackageForPlan && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="w-4 h-4" />}
                      onClick={() => onSelectPackageForPlan(pkg)}
                    >
                      Select This Package
                    </Button>
                  )}
                </div>
              </div>

              {/* Accordion Stages Preview */}
              {isExpanded && (
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-3 animate-in fade-in duration-200">
                  <TherapyStageEditor stages={pkg.stages} isEditable={false} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Create New Package Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setMatchedSimilarity(null);
        }}
        title="Author New Clinical Therapy Protocol"
        subtitle="Define a structured multi-stage protocol with day offsets and dietary frameworks."
        maxWidth="2xl"
      >
        <form onSubmit={handleCheckAndSubmit} className="flex flex-col gap-4 text-xs">
          {matchedSimilarity && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold font-serif text-amber-900">
                    Similar Clinical Package Already Exists!
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 font-medium leading-snug">
                    A package titled <strong className="font-bold">"{matchedSimilarity.name}"</strong> targeting <strong className="font-bold">{matchedSimilarity.targetDosha}</strong> already exists. Use the existing blueprint or continue authoring a variant?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleUseExistingFromWarning(matchedSimilarity)}
                >
                  Use Existing Blueprint
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleForceContinueCreating}
                >
                  Continue Creating New Variant
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
                Protocol Name *
              </label>
              <input
                type="text"
                required
                value={pkgName}
                onChange={(e) => {
                  setPkgName(e.target.value);
                  setMatchedSimilarity(null);
                }}
                placeholder="e.g. 7-Day Virechana & Kati Basti Protocol"
                className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
                Target Dosha Constitution *
              </label>
              <select
                value={pkgTargetDosha}
                onChange={(e) => setPkgTargetDosha(e.target.value)}
                className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-sm text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary"
              >
                <option value="Pitta & Pitta-Kapha">Pitta & Pitta-Kapha</option>
                <option value="Vata-Pitta">Vata-Pitta</option>
                <option value="Kapha-Vata">Kapha-Vata</option>
                <option value="Tridoshic (Vata-Pitta-Kapha)">Tridoshic</option>
                <option value="Vata Dominant">Vata Dominant</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Clinical Description & Indications *
            </label>
            <textarea
              rows={2}
              required
              value={pkgDescription}
              onChange={(e) => setPkgDescription(e.target.value)}
              placeholder="Indications, pathology targeted, expected clinical outcomes..."
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary resize-none"
            />
          </div>

          {/* Stages Configuration */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Stage Sequence & Protocol Authoring ({stages.length} Stages)
            </span>
            <TherapyStageEditor
              stages={stages}
              isEditable={true}
              onUpdateStage={handleStageUpdate}
              onRemoveStage={handleRemoveStage}
              onMoveStage={handleMoveStage}
              onAddStage={handleAddStage}
              errors={stageErrors}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase text-gray-700 text-[10px] tracking-wider">
              Base Diet & Lifestyle Guidelines
            </label>
            <textarea
              rows={2}
              value={pkgDiet}
              onChange={(e) => setPkgDiet(e.target.value)}
              placeholder="e.g. Strict Laghu Ushna diet, warm ginger water, avoid sour curd..."
              className="rounded-xl border border-ayur-sand/80 px-3 py-2 text-xs text-gray-900 bg-[#fbf9f5] focus:outline-none focus:border-ayur-primary resize-none"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setModalOpen(false);
                setMatchedSimilarity(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Standardize & Submit Package
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
