// src/admin/Components/PackagesTab.tsx
import React, { useState, useMemo } from 'react';
import { TherapyPackage, PackageStage, StageCategory } from '../types/admin.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { ProtocolStageStepper } from './ProtocolStageStepper';
import {
  Plus,
  Edit2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Clock,
  Utensils,
  IndianRupee,
  MoveUp,
  MoveDown,
} from 'lucide-react';

interface PackagesTabProps {
  packages: TherapyPackage[];
  onAddPackage?: (pkg: Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>) => void;
  onEditPackage?: (pkg: TherapyPackage) => void;
  onCheckSimilarity?: (name: string) => string | null;
}

const THERAPY_TYPES = ['Virechana', 'Vamana', 'Basti', 'Nasya', 'Raktamokshana'] as const;
const STAGE_CATEGORIES: StageCategory[] = ['Poorvakarma', 'Pradhanakarma', 'Paschatkarma'];

export const PackagesTab: React.FC<PackagesTabProps> = ({
  packages,
  onAddPackage,
  onEditPackage,
  onCheckSimilarity,
}) => {
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(packages[0]?.id || null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<TherapyPackage | null>(null);

  // Form states
  const [pkgName, setPkgName] = useState('');
  const [pkgDesc, setPkgDesc] = useState('');
  const [therapyType, setTherapyType] = useState<string>('Virechana');
  const [basePrice, setBasePrice] = useState<number>(12000);
  const [preInstructions, setPreInstructions] = useState('');
  const [postInstructions, setPostInstructions] = useState('');
  const [dietFramework, setDietFramework] = useState('');

  // Dynamic nested stages
  const [stages, setStages] = useState<PackageStage[]>([
    {
      id: 'stg-1',
      stageName: 'Snehana & Swedana Priming',
      stage_type: 'Poorvakarma',
      stageCategory: 'Poorvakarma',
      sequence_order: 1,
      day_offset: 0,
      duration_days: 3,
      durationDays: 3,
      session_duration_minutes: 60,
      durationMinutes: 60,
      pre_instructions: 'Light digestible meal (Peya) 2 hours prior.',
      post_instructions: 'Avoid cold drafts and direct AC exposure.',
      base_diet_framework: {
        allowed: ['Warm rice gruel', 'Ginger boiled water'],
        forbidden: ['Curd', 'Heavy oily food', 'Cold drinks'],
      },
    },
    {
      id: 'stg-2',
      stageName: 'Pradhana Virechana Karma',
      stage_type: 'Pradhanakarma',
      stageCategory: 'Pradhanakarma',
      sequence_order: 2,
      day_offset: 3,
      duration_days: 1,
      durationDays: 1,
      session_duration_minutes: 90,
      durationMinutes: 90,
      pre_instructions: 'Strict morning fasting before medicine intake.',
      post_instructions: 'Rest completely, drink warm thin gruel only.',
      base_diet_framework: {
        allowed: ['Thin warm Peya'],
        forbidden: ['Solid food', 'Dairy'],
      },
    },
    {
      id: 'stg-3',
      stageName: 'Samsarjana Krama Dietary Re-entry',
      stage_type: 'Paschatkarma',
      stageCategory: 'Paschatkarma',
      sequence_order: 3,
      day_offset: 4,
      duration_days: 3,
      durationDays: 3,
      session_duration_minutes: 45,
      durationMinutes: 45,
      pre_instructions: 'Light morning walk only.',
      post_instructions: 'Gradual Samsarjana Krama dietary re-entry.',
      base_diet_framework: {
        allowed: ['Mudga Yusha', 'Vilepi'],
        forbidden: ['Spicy food', 'Oily fried food'],
      },
    },
  ]);

  // Total Duration dynamically derived from stages
  const calculatedTotalDays = useMemo(() => {
    return stages.reduce((acc, st) => acc + (Number(st.duration_days || st.durationDays) || 1), 0);
  }, [stages]);

  // Similarity Check
  const similarName = pkgName ? onCheckSimilarity?.(pkgName) : null;

  const handleOpenAddModal = () => {
    setEditingPkg(null);
    setPkgName('');
    setPkgDesc('');
    setTherapyType('Virechana');
    setBasePrice(12000);
    setPreInstructions('Drink lukewarm water, consume light warm food 2 hours prior.');
    setPostInstructions('Avoid strenuous exertion, follow structured Samsarjana Krama diet.');
    setDietFramework('Peyadi Samsarjana Krama');
    setStages([
      {
        id: `stg-${Date.now()}-1`,
        stageName: 'Snehana & Swedana Priming',
        stage_type: 'Poorvakarma',
        stageCategory: 'Poorvakarma',
        sequence_order: 1,
        day_offset: 0,
        duration_days: 3,
        durationDays: 3,
        session_duration_minutes: 60,
        durationMinutes: 60,
        pre_instructions: 'Light digestible meal (Peya) 2 hours prior.',
        post_instructions: 'Avoid cold drafts and direct AC exposure.',
        base_diet_framework: {
          allowed: ['Warm rice gruel', 'Ginger boiled water'],
          forbidden: ['Curd', 'Heavy oily food', 'Cold drinks'],
        },
      },
      {
        id: `stg-${Date.now()}-2`,
        stageName: 'Pradhana Procedure Karma',
        stage_type: 'Pradhanakarma',
        stageCategory: 'Pradhanakarma',
        sequence_order: 2,
        day_offset: 3,
        duration_days: 1,
        durationDays: 1,
        session_duration_minutes: 90,
        durationMinutes: 90,
        pre_instructions: 'Strict morning fasting before medicine intake.',
        post_instructions: 'Rest completely, drink warm thin gruel only.',
        base_diet_framework: {
          allowed: ['Thin warm Peya'],
          forbidden: ['Solid food'],
        },
      },
      {
        id: `stg-${Date.now()}-3`,
        stageName: 'Samsarjana Krama Recovery',
        stage_type: 'Paschatkarma',
        stageCategory: 'Paschatkarma',
        sequence_order: 3,
        day_offset: 4,
        duration_days: 3,
        durationDays: 3,
        session_duration_minutes: 45,
        durationMinutes: 45,
        pre_instructions: 'Light morning walk only.',
        post_instructions: 'Gradual Samsarjana Krama dietary re-entry.',
        base_diet_framework: {
          allowed: ['Mudga Yusha', 'Vilepi'],
          forbidden: ['Spicy food'],
        },
      },
    ]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (pkg: TherapyPackage) => {
    setEditingPkg(pkg);
    setPkgName(pkg.name);
    setPkgDesc(pkg.description || '');
    setTherapyType(pkg.therapy_type || pkg.targetDosha || 'Virechana');
    setBasePrice(pkg.base_price || 12000);
    setPreInstructions(pkg.preProcedureInstructions || '');
    setPostInstructions(pkg.postProcedureInstructions || '');
    setDietFramework(pkg.dietFramework || '');
    setStages(
      (pkg.stages || []).map((s, idx) => ({
        ...s,
        stage_type: s.stage_type || s.stageCategory || 'Poorvakarma',
        stageCategory: s.stageCategory || s.stage_type || 'Poorvakarma',
        sequence_order: s.sequence_order ?? s.sequenceOrder ?? idx + 1,
        duration_days: s.duration_days ?? s.durationDays ?? 1,
        durationDays: s.durationDays ?? s.duration_days ?? 1,
        session_duration_minutes: s.session_duration_minutes ?? s.durationMinutes ?? 60,
        durationMinutes: s.durationMinutes ?? s.session_duration_minutes ?? 60,
      }))
    );
    setModalOpen(true);
  };

  const handleAddStage = () => {
    const nextSeq = stages.length + 1;
    const defaultCat: StageCategory = nextSeq === 1 ? 'Poorvakarma' : nextSeq === 2 ? 'Pradhanakarma' : 'Paschatkarma';
    const newStage: PackageStage = {
      id: `stg-${Date.now()}-${nextSeq}`,
      stageName: `${defaultCat} Stage`,
      stage_type: defaultCat,
      stageCategory: defaultCat,
      sequence_order: nextSeq,
      duration_days: 2,
      durationDays: 2,
      session_duration_minutes: 60,
      durationMinutes: 60,
      pre_instructions: 'Light warm food prior to therapy.',
      post_instructions: 'Rest in warm room after treatment.',
      base_diet_framework: {
        allowed: ['Warm water', 'Peya'],
        forbidden: ['Cold drinks', 'Heavy fried food'],
      },
    };
    setStages([...stages, newStage]);
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length <= 1) return;
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;
    const nextStages = [...stages];
    const temp = nextStages[index];
    nextStages[index] = nextStages[targetIdx];
    nextStages[targetIdx] = temp;
    setStages(nextStages);
  };

  const handleStageChange = (index: number, field: keyof PackageStage, value: any) => {
    const updated = [...stages];
    updated[index] = {
      ...updated[index],
      [field]: value,
      ...(field === 'stage_type' ? { stageCategory: value } : {}),
      ...(field === 'stageCategory' ? { stage_type: value } : {}),
      ...(field === 'duration_days' ? { durationDays: Number(value) } : {}),
      ...(field === 'durationDays' ? { duration_days: Number(value) } : {}),
      ...(field === 'session_duration_minutes' ? { durationMinutes: Number(value) } : {}),
      ...(field === 'durationMinutes' ? { session_duration_minutes: Number(value) } : {}),
    };
    setStages(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName?.trim()) return;

    let runningOffset = 0;
    const formattedStages: PackageStage[] = stages.map((s, i) => {
      const duration = Number(s.duration_days || s.durationDays) || 1;
      const stageObj: PackageStage = {
        id: s.id || `STG-${Date.now()}-${i + 1}`,
        stageName: s.stageName || `${s.stage_type || s.stageCategory} Stage`,
        name: s.stageName || `${s.stage_type || s.stageCategory} Stage`,
        stage_type: s.stage_type || s.stageCategory || 'Poorvakarma',
        stageCategory: s.stageCategory || s.stage_type || 'Poorvakarma',
        category: s.stageCategory || s.stage_type || 'Poorvakarma',
        sequence_order: i + 1,
        sequenceOrder: i + 1,
        day_offset: runningOffset,
        dayOffset: runningOffset,
        duration_days: duration,
        durationDays: duration,
        session_duration_minutes: Number(s.session_duration_minutes || s.durationMinutes) || 60,
        durationMinutes: Number(s.session_duration_minutes || s.durationMinutes) || 60,
        pre_instructions: s.pre_instructions || s.preInstructions || preInstructions,
        preInstructions: s.pre_instructions || s.preInstructions || preInstructions,
        post_instructions: s.post_instructions || s.postInstructions || postInstructions,
        postInstructions: s.post_instructions || s.postInstructions || postInstructions,
        base_diet_framework: s.base_diet_framework || (dietFramework ? { allowed: [dietFramework], forbidden: [] } : { allowed: [], forbidden: [] }),
      };
      runningOffset += duration;
      return stageObj;
    });

    if (editingPkg) {
      onEditPackage?.({
        ...editingPkg,
        name: pkgName.trim(),
        therapy_type: therapyType,
        targetDosha: therapyType,
        description: pkgDesc.trim() || `Classical purification protocol for ${therapyType} disorders`,
        base_price: Number(basePrice) || 0,
        durationDays: calculatedTotalDays,
        duration_days: calculatedTotalDays,
        stages: formattedStages,
        preProcedureInstructions: preInstructions,
        postProcedureInstructions: postInstructions,
        dietFramework: dietFramework,
      });
    } else {
      onAddPackage?.({
        name: pkgName.trim(),
        therapy_type: therapyType,
        targetDosha: therapyType,
        description: pkgDesc.trim() || `Classical purification protocol for ${therapyType} disorders`,
        base_price: Number(basePrice) || 0,
        durationDays: calculatedTotalDays,
        duration_days: calculatedTotalDays,
        stages: formattedStages,
        preProcedureInstructions: preInstructions,
        postProcedureInstructions: postInstructions,
        dietFramework: dietFramework,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
            Therapy Protocol & Package Management
          </h1>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Configure, review, and standardize multi-stage Panchakarma protocols and nested stage timelines.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
          className="self-start sm:self-auto"
        >
          New Package
        </Button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-6">
        {packages.map((pkg) => {
          const isExpanded = expandedPackageId === pkg.id;
          const isDoctorCreated = pkg.createdBy === 'doctor';

          return (
            <Card key={pkg.id} className="flex flex-col gap-4">
              {/* Card Top */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900 font-serif">
                      {pkg.name}
                    </h3>
                    <Badge variant="ayur" size="sm">
                      {pkg.therapy_type || pkg.targetDosha || 'Virechana'}
                    </Badge>
                    {pkg.base_price ? (
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <IndianRupee className="w-3 h-3" />
                        {Number(pkg.base_price).toLocaleString('en-IN')}
                      </span>
                    ) : null}
                    {isDoctorCreated && (
                      <Badge variant="warning" size="sm">
                        Created by {pkg.authorName}
                      </Badge>
                    )}
                    <Badge
                      variant={pkg.status === 'Active' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {pkg.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {pkg.durationDays || pkg.duration_days || 7} Days Total • {(pkg.stages || []).length} Procedure Stages • Author: {pkg.authorName || 'Clinic Administrator'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditModal(pkg)}
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedPackageId(isExpanded ? null : pkg.id)}
                    icon={isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  >
                    {isExpanded ? 'Hide Stages' : 'View Timeline'}
                  </Button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                {pkg.description || `Classical Panchakarma therapy package for ${pkg.name}.`}
              </p>

              {/* Expandable Protocol Stage Stepper */}
              {isExpanded && (
                <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4 animate-in fade-in duration-200">
                  <ProtocolStageStepper stages={pkg.stages || []} />

                  {/* Pre/Post & Diet Framework Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    {pkg.preProcedureInstructions && (
                      <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 text-xs">
                        <p className="font-bold text-gray-900 font-serif">Pre-Procedure Care</p>
                        <p className="text-gray-600 mt-1">{pkg.preProcedureInstructions}</p>
                      </div>
                    )}
                    {pkg.postProcedureInstructions && (
                      <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 text-xs">
                        <p className="font-bold text-gray-900 font-serif">Post-Procedure Care</p>
                        <p className="text-gray-600 mt-1">{pkg.postProcedureInstructions}</p>
                      </div>
                    )}
                    {pkg.dietFramework && (
                      <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 text-xs">
                        <p className="font-bold text-gray-900 font-serif">Base Diet Framework</p>
                        <p className="text-gray-600 mt-1">{pkg.dietFramework}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Package Modal with Dynamic Stages */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPkg ? 'Edit Protocol Blueprint' : 'Configure New Therapy Protocol'}
        subtitle="Define master template specifications and dynamic nested stage sequences."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-1">
          {/* Similarity Warning Banner */}
          {similarName && !editingPkg && (
            <div className="p-3.5 rounded-xl bg-[#fbeeed] border border-[#f4cbc6] text-xs text-[#a13c32] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Duplicate Similarity Detected:</span> A package named{' '}
                <span className="underline font-bold">&quot;{similarName}&quot;</span> already exists in the directory.
                Please ensure this is a distinct protocol variation.
              </div>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-ayur-sand/70 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-ayur-brown flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 1. Master Protocol Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-700">Protocol Name *</label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. 7-Day Classical Virechana Protocol"
                  className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-700">Therapy Type *</label>
                <select
                  value={therapyType}
                  onChange={(e) => setTherapyType(e.target.value)}
                  className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-ayur-primary font-medium"
                >
                  {THERAPY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-700">Clinical Description *</label>
                <input
                  type="text"
                  required
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  placeholder="e.g. Classical purification protocol for Pitta disorders"
                  className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-700">Base Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  placeholder="12000"
                  className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Nested Stages */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-ayur-brown flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-ayur-primary" /> 2. Nested Protocol Stages ({stages.length})
                </h4>
                <Badge variant="ayur" size="sm">
                  Total: {calculatedTotalDays} Days
                </Badge>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={handleAddStage}
              >
                Add Stage
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {stages.map((stage, idx) => (
                <div
                  key={stage.id || idx}
                  className="p-4 rounded-xl bg-[#fbf9f5] border border-ayur-sand/80 flex flex-col gap-3 transition-all hover:border-ayur-primary/40 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-gray-200/70 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-ayur-primary text-white font-bold text-xs flex items-center justify-center font-serif">
                        {idx + 1}
                      </span>
                      <select
                        value={stage.stage_type || stage.stageCategory || 'Poorvakarma'}
                        onChange={(e) => handleStageChange(idx, 'stage_type', e.target.value as StageCategory)}
                        className="rounded-lg border border-ayur-sand px-2.5 py-1 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                      >
                        {STAGE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveStage(idx, 'up')}
                        className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded hover:bg-white transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === stages.length - 1}
                        onClick={() => handleMoveStage(idx, 'down')}
                        className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded hover:bg-white transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={stages.length <= 1}
                        onClick={() => handleRemoveStage(idx)}
                        className="p-1 text-rose-600 hover:text-rose-800 disabled:opacity-30 rounded hover:bg-white transition-colors ml-1"
                        title="Delete Stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-700">Stage Name / Sub-Therapy</label>
                      <input
                        type="text"
                        value={stage.stageName || ''}
                        onChange={(e) => handleStageChange(idx, 'stageName', e.target.value)}
                        placeholder="e.g. Snehana (Oleation)"
                        className="rounded-lg border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-ayur-primary" /> Duration (Days)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={stage.duration_days ?? stage.durationDays ?? 1}
                        onChange={(e) => handleStageChange(idx, 'duration_days', Number(e.target.value))}
                        className="rounded-lg border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-ayur-primary" /> Session Duration (Mins)
                      </label>
                      <input
                        type="number"
                        min={15}
                        step={15}
                        max={240}
                        value={stage.session_duration_minutes ?? stage.durationMinutes ?? 60}
                        onChange={(e) => handleStageChange(idx, 'session_duration_minutes', Number(e.target.value))}
                        className="rounded-lg border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-700">Pre-Instructions</label>
                      <input
                        type="text"
                        value={stage.pre_instructions || stage.preInstructions || ''}
                        onChange={(e) => handleStageChange(idx, 'pre_instructions', e.target.value)}
                        placeholder="Light digestible meal (Peya) 2 hours prior."
                        className="rounded-lg border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-gray-700">Post-Instructions</label>
                      <input
                        type="text"
                        value={stage.post_instructions || stage.postInstructions || ''}
                        onChange={(e) => handleStageChange(idx, 'post_instructions', e.target.value)}
                        placeholder="Avoid cold drafts and direct AC exposure."
                        className="rounded-lg border border-ayur-sand/80 px-2.5 py-1.5 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: General Clinical Guidelines */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-ayur-sand/70 flex flex-col gap-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-ayur-brown flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" /> 3. Protocol Dietary Care & Guidelines
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-700">General Pre-Procedure Care</label>
                <input
                  type="text"
                  value={preInstructions}
                  onChange={(e) => setPreInstructions(e.target.value)}
                  placeholder="Drink lukewarm water, consume light warm food."
                  className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase text-gray-700">General Post-Procedure Care</label>
                <input
                  type="text"
                  value={postInstructions}
                  onChange={(e) => setPostInstructions(e.target.value)}
                  placeholder="Avoid strenuous exertion, follow diet regimen."
                  className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Base Diet Framework</label>
              <input
                type="text"
                value={dietFramework}
                onChange={(e) => setDietFramework(e.target.value)}
                placeholder="e.g. Peyadi Samsarjana Krama"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-xs text-gray-900 bg-white focus:outline-none focus:border-ayur-primary"
              />
            </div>
          </div>

          <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Total Package Duration: <strong className="text-gray-900">{calculatedTotalDays} Days</strong> ({stages.length} Stages)
            </span>

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {editingPkg ? 'Update Protocol' : 'Save Protocol'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackagesTab;
