import React, { useState } from 'react';
import { TherapyPackage, PackageStage } from '../types/admin.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { ProtocolStageStepper } from './ProtocolStageStepper';
import { Plus, Edit2, ChevronDown, ChevronUp, AlertTriangle, Calendar, Layers, Sparkles } from 'lucide-react';

interface PackagesTabProps {
  packages: TherapyPackage[];
  onAddPackage?: (pkg: Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>) => void;
  onEditPackage?: (pkg: TherapyPackage) => void;
  onCheckSimilarity?: (name: string) => string | null;
}

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
  const [pkgDosha, setPkgDosha] = useState('Pitta Shodhana');
  const [pkgDuration, setPkgDuration] = useState(7);
  const [preInstructions, setPreInstructions] = useState('');
  const [postInstructions, setPostInstructions] = useState('');
  const [dietFramework, setDietFramework] = useState('');
  const [stages, setStages] = useState<Omit<PackageStage, 'id'>[]>([
    { stageName: 'Snehana (Oleation)', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 45 },
    { stageName: 'Swedana (Sudation)', stageCategory: 'Poorvakarma', dayOffset: 3, durationMinutes: 30 },
    { stageName: 'Virechana (Purgation)', stageCategory: 'Pradhanakarma', dayOffset: 4, durationMinutes: 480 },
    { stageName: 'Samsarjana Krama (Diet)', stageCategory: 'Paschatkarma', dayOffset: 5, durationMinutes: 2880 },
  ]);

  // Similarity Check
  const similarName = pkgName ? onCheckSimilarity?.(pkgName) : null;

  const handleOpenAddModal = () => {
    setEditingPkg(null);
    setPkgName('');
    setPkgDesc('');
    setPkgDosha('Pitta Shodhana');
    setPkgDuration(7);
    setPreInstructions('Drink lukewarm water, consume light warm food.');
    setPostInstructions('Avoid strenuous exertion, follow diet regimen.');
    setDietFramework('Peyadi Samsarjana Krama');
    setStages([
      { stageName: 'Snehana (Oleation)', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 45 },
      { stageName: 'Swedana (Sudation)', stageCategory: 'Poorvakarma', dayOffset: 3, durationMinutes: 30 },
      { stageName: 'Virechana (Purgation)', stageCategory: 'Pradhanakarma', dayOffset: 4, durationMinutes: 480 },
    ]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (pkg: TherapyPackage) => {
    setEditingPkg(pkg);
    setPkgName(pkg.name);
    setPkgDesc(pkg.description);
    setPkgDosha(pkg.targetDosha);
    setPkgDuration(pkg.durationDays);
    setPreInstructions(pkg.preProcedureInstructions || '');
    setPostInstructions(pkg.postProcedureInstructions || '');
    setDietFramework(pkg.dietFramework || '');
    setStages(pkg.stages);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName || !pkgDesc) return;

    if (editingPkg) {
      onEditPackage?.({
        ...editingPkg,
        name: pkgName,
        description: pkgDesc,
        targetDosha: pkgDosha,
        durationDays: pkgDuration,
        stages: stages.map((s, i) => ({ ...s, id: `STG-${Date.now()}-${i}` })),
        preProcedureInstructions: preInstructions,
        postProcedureInstructions: postInstructions,
        dietFramework: dietFramework,
      });
    } else {
      onAddPackage?.({
        name: pkgName,
        description: pkgDesc,
        targetDosha: pkgDosha,
        durationDays: pkgDuration,
        stages: stages.map((s, i) => ({ ...s, id: `STG-${Date.now()}-${i}` })),
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
            Configure, review, and standardize multi-stage Panchakarma protocols and diet regimens.
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
                      {pkg.targetDosha}
                    </Badge>
                    {isDoctorCreated && (
                      <Badge variant="warning" size="sm">
                        Created by {pkg.authorName}
                      </Badge>
                    )}
                    <Badge
                      variant={pkg.status === 'Active' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {pkg.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {pkg.durationDays} Days Duration • {pkg.stages.length} Procedure Stages • Author: {pkg.authorName}
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
                {pkg.description}
              </p>

              {/* Expandable Protocol Stage Stepper */}
              {isExpanded && (
                <div className="mt-2 pt-4 border-t border-gray-100 flex flex-col gap-4 animate-in fade-in duration-200">
                  <ProtocolStageStepper stages={pkg.stages} />

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

      {/* Add / Edit Package Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPkg ? 'Edit Protocol Blueprint' : 'Configure New Therapy Protocol'}
        subtitle="Define procedure stages, duration, and patient dietary regimens."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Similarity Warning Banner */}
          {similarName && !editingPkg && (
            <div className="p-3.5 rounded-xl bg-[#fbeeed] border border-[#f4cbc6] text-xs text-[#a13c32] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Duplicate Similarity Detected:</span> A package named{' '}
                <span className="underline font-bold">"{similarName}"</span> already exists in the directory.
                Please ensure this is a distinct protocol variation.
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Protocol Name *</label>
              <input
                type="text"
                required
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
                placeholder="e.g. 7-Day Virechana Protocol"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Target Dosha *</label>
              <select
                value={pkgDosha}
                onChange={(e) => setPkgDosha(e.target.value)}
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              >
                <option value="Pitta Shodhana">Pitta Shodhana</option>
                <option value="Vata Shodhana">Vata Shodhana</option>
                <option value="Kapha Pacification">Kapha Pacification</option>
                <option value="Tridosha Shamana">Tridosha Shamana</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Description *</label>
            <textarea
              rows={2}
              required
              value={pkgDesc}
              onChange={(e) => setPkgDesc(e.target.value)}
              placeholder="Clinical description of the therapeutic purpose and cleansing sequence..."
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={pkgDuration}
                onChange={(e) => setPkgDuration(Number(e.target.value))}
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Pre-Procedure</label>
              <input
                type="text"
                value={preInstructions}
                onChange={(e) => setPreInstructions(e.target.value)}
                placeholder="Warm water, light diet"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-700">Diet Framework</label>
              <input
                type="text"
                value={dietFramework}
                onChange={(e) => setDietFramework(e.target.value)}
                placeholder="Peyadi Samsarjana"
                className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
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
        </form>
      </Modal>
    </div>
  );
};
