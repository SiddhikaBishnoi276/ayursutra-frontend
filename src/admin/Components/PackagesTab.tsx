import { useState } from 'react';
import { TherapyPackage, PackageStage } from '../types/admin.types';
import { PackageTemplateCard } from './PackageTemplateCard';
import { 
    Plus, 
    X, 
    ArrowRight, 
    ArrowLeft, 
    AlertTriangle, 
    Trash2, 
    Sparkles, 
    ShieldCheck, 
    ClipboardCheck, 
    Info,
    Save
} from 'lucide-react';

interface PackagesTabProps {
    packages: TherapyPackage[];
    onAddPackage: (pkg: Omit<TherapyPackage, 'id' | 'status' | 'createdBy' | 'authorName'>) => void;
    onApprovePackage: (id: string) => void;
}

export const PackagesTab = ({ packages, onAddPackage, onApprovePackage }: PackagesTabProps) => {
    const [isBuilding, setIsBuilding] = useState(false);
    const [step, setStep] = useState(1);

    // Form States
    const [pkgName, setPkgName] = useState('');
    const [pkgDesc, setPkgDesc] = useState('');
    const [pkgDosha, setPkgDosha] = useState('Pitta Shodhana');
    const [pkgDuration, setPkgDuration] = useState(5);
    
    // Stages array state
    const [stages, setStages] = useState<Omit<PackageStage, 'id'>[]>([
        { stageName: 'Abhyanga Massage', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 60 }
    ]);
    const [newStageName, setNewStageName] = useState('');
    const [newStageCategory, setNewStageCategory] = useState<PackageStage['stageCategory']>('Poorvakarma');
    const [newStageOffset, setNewStageOffset] = useState(0);
    const [newStageDuration, setNewStageDuration] = useState(45);

    // Step 3 States
    const [preInstructions, setPreInstructions] = useState('');
    const [postInstructions, setPostInstructions] = useState('');
    const [dietFramework, setDietFramework] = useState('');

    // Similarity Check
    const hasSimilarity = pkgName.toLowerCase().includes('virechana') || 
                          pkgName.toLowerCase().includes('basti') || 
                          pkgName.toLowerCase().includes('nasya');

    const similarPackageName = pkgName.toLowerCase().includes('virechana') 
        ? '7-Day Virechana Protocol' 
        : pkgName.toLowerCase().includes('basti')
        ? '5-Day Karma Basti Protocol'
        : pkgName.toLowerCase().includes('nasya')
        ? '5-Day Nasya Cleansing Template'
        : '';

    const handleAddStage = () => {
        if (!newStageName) return;
        setStages(prev => [...prev, {
            stageName: newStageName,
            stageCategory: newStageCategory,
            dayOffset: newStageOffset,
            durationMinutes: newStageDuration
        }]);
        setNewStageName('');
        // Autofill guess offsets
        setNewStageOffset(prev => prev + 1);
    };

    const handleRemoveStage = (idx: number) => {
        setStages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPackage({
            name: pkgName,
            description: pkgDesc,
            targetDosha: pkgDosha,
            durationDays: pkgDuration,
            stages: stages.map((s, i) => ({ ...s, id: `STG-${Date.now()}-${i}` })),
            preProcedureInstructions: preInstructions,
            postProcedureInstructions: postInstructions,
            dietFramework: dietFramework
        });

        // Reset
        setIsBuilding(false);
        setStep(1);
        setPkgName('');
        setPkgDesc('');
        setStages([{ stageName: 'Abhyanga Massage', stageCategory: 'Poorvakarma', dayOffset: 0, durationMinutes: 60 }]);
        setPreInstructions('');
        setPostInstructions('');
        setDietFramework('');
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Therapy Protocols & Blueprints</h2>
                    <p className="text-sm text-slate-500 font-medium">Configure standardized clinical steps, enema stages, and pre-care dietary requirements.</p>
                </div>
                <button
                    onClick={() => setIsBuilding(true)}
                    title="Open Protocol Builder Drawer"
                    tabIndex={0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-950 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-805"
                >
                    <Plus className="h-4.5 w-4.5" />
                    Create Protocol
                </button>
            </div>

            {/* Main Screen: Packages Grid & Doctor Audits */}
            <div className="flex flex-col gap-8">
                
                {/* Doctor Created Audits Row */}
                {packages.some(p => p.status === 'Pending Audit') && (
                    <div className="rounded-2xl border border-amber-250 bg-amber-50/15 p-5 shadow-2xs flex flex-col gap-3.5">
                        <div className="flex items-center gap-2 text-amber-800">
                            <AlertTriangle className="h-5 w-5" />
                            <h3 className="font-extrabold text-sm uppercase tracking-wider">Protocol Audit Pipeline</h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            {packages.filter(p => p.status === 'Pending Audit').map((pkg) => (
                                <div key={pkg.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-amber-200/50 p-4 rounded-xl shadow-3xs">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800 text-sm">{pkg.name}</h4>
                                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                                                Submitted by {pkg.authorName}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-505 mt-1 font-medium leading-relaxed">{pkg.description}</p>
                                    </div>
                                    <button
                                        onClick={() => onApprovePackage(pkg.id)}
                                        title={`Audit and approve package ${pkg.name}`}
                                        tabIndex={0}
                                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-950 transition focus:outline-none focus:ring-2 focus:ring-emerald-850"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Audit & Approve
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Packages Listing */}
                <div className="grid grid-cols-1 gap-6">
                    {packages.filter(p => p.status === 'Active').map((pkg) => (
                        <div key={pkg.id} className="relative">
                            <PackageTemplateCard package={pkg} />
                            {pkg.createdBy === 'doctor' && (
                                <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-250 px-2 py-0.5 rounded-full">
                                    Doctor Approved
                                </span>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            {/* Multi-Step Package Builder Drawer overlay */}
            {isBuilding && (
                <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="h-full w-full max-w-lg bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between overflow-y-auto border-l border-slate-200">
                        <div>
                            {/* Stepper Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs flex items-center justify-center border border-emerald-200">
                                        {step}
                                    </span>
                                    <div>
                                        <h3 className="font-extrabold text-slate-850 text-base">Panchakarma Protocol Builder</h3>
                                        <p className="text-xs text-slate-400 font-semibold mt-0.5">
                                            {step === 1 && 'Step 1: Core Details & Target Dosha'}
                                            {step === 2 && 'Step 2: Add Preparation & Treatment Stages'}
                                            {step === 3 && 'Step 3: Clinical Instructions & Diet Framework'}
                                        </p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        setIsBuilding(false);
                                        setStep(1);
                                    }}
                                    title="Close Protocol Builder"
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Step 1: Core Details */}
                            {step === 1 && (
                                <div className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-500">Protocol Name *</label>
                                        <input 
                                            type="text"
                                            required
                                            placeholder="e.g. 5-Day Shirodhara Rejuvenation"
                                            value={pkgName}
                                            onChange={(e) => setPkgName(e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                        />
                                        {hasSimilarity && (
                                            <div className="mt-2 rounded-xl bg-amber-50/50 border border-amber-200/50 p-3 text-amber-900 flex items-start gap-2.5 animate-in fade-in duration-200 font-medium">
                                                <AlertTriangle className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-amber-800">Similarity Warning</p>
                                                    <p className="mt-0.5 text-[11px] leading-relaxed">
                                                        A similar template named <strong>"{similarPackageName}"</strong> already exists. Consider reusing/modifying it.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-500">Description *</label>
                                        <textarea 
                                            rows={3}
                                            required
                                            placeholder="Describe the therapeutic purposes, symptoms targeted, and patient benefits..."
                                            value={pkgDesc}
                                            onChange={(e) => setPkgDesc(e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-slate-500">Target Dosha Cleansing *</label>
                                            <select
                                                value={pkgDosha}
                                                onChange={(e) => setPkgDosha(e.target.value)}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none"
                                            >
                                                <option value="Pitta Shodhana">Pitta Shodhana (Purgation)</option>
                                                <option value="Vata Shodhana">Vata Shodhana (Enemas)</option>
                                                <option value="Kapha Pacification">Kapha Pacification (Nasal/Emesis)</option>
                                                <option value="Tri-dosha Balancer">Tri-dosha Rejuvenation</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-slate-500">Duration (Total Days) *</label>
                                            <input 
                                                type="number"
                                                min={1}
                                                max={30}
                                                value={pkgDuration}
                                                onChange={(e) => setPkgDuration(parseInt(e.target.value) || 1)}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-855 outline-none focus:border-slate-350 transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Stages Configuration */}
                            {step === 2 && (
                                <div className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-505 uppercase tracking-wider text-[10px] font-bold">Sequential Stages Pipeline ({stages.length})</label>
                                        <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                                            {stages.map((stage, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200/50 p-2.5 rounded-xl">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                                                        <div>
                                                            <p className="font-bold text-slate-800">{stage.stageName}</p>
                                                            <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">
                                                                {stage.stageCategory} • Day {stage.dayOffset} • {stage.durationMinutes} min
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveStage(idx)}
                                                        className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-700 transition"
                                                        title="Remove stage"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add New Stage Block */}
                                    <div className="rounded-xl border border-dashed border-slate-300 p-3 bg-slate-50/20 flex flex-col gap-3">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                                            <ClipboardCheck className="h-4 w-4 text-emerald-800" />
                                            Configure Next Stage
                                        </h4>

                                        <div className="flex flex-col gap-2.5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-400">Stage/Procedure Name</span>
                                                <input 
                                                    type="text"
                                                    placeholder="e.g. Swedana Steam Cabin"
                                                    value={newStageName}
                                                    onChange={(e) => setNewStageName(e.target.value)}
                                                    className="rounded border border-slate-200 bg-white px-2.5 py-1.5 outline-none font-medium"
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-slate-400">Category</span>
                                                    <select
                                                        value={newStageCategory}
                                                        onChange={(e) => setNewStageCategory(e.target.value as any)}
                                                        className="rounded border border-slate-200 bg-white px-2 py-1.5 outline-none text-[11px]"
                                                    >
                                                        <option value="Poorvakarma">Prep (Poorva)</option>
                                                        <option value="Pradhanakarma">Main (Pradhana)</option>
                                                        <option value="Paschatkarma">Post (Paschat)</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-slate-400">Day Offset</span>
                                                    <input 
                                                        type="number"
                                                        value={newStageOffset}
                                                        onChange={(e) => setNewStageOffset(parseInt(e.target.value) || 0)}
                                                        className="rounded border border-slate-200 bg-white px-2 py-1 outline-none text-[11px]"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-slate-400">Duration (Mins)</span>
                                                    <input 
                                                        type="number"
                                                        value={newStageDuration}
                                                        onChange={(e) => setNewStageDuration(parseInt(e.target.value) || 0)}
                                                        className="rounded border border-slate-200 bg-white px-2 py-1 outline-none text-[11px]"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleAddStage}
                                                className="w-full mt-1.5 rounded-lg bg-emerald-900 px-3 py-2 font-bold text-white hover:bg-emerald-950 transition text-xs"
                                            >
                                                Add Stage to Pipeline
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Diet & Exercise Framework */}
                            {step === 3 && (
                                <div className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-500 flex items-center gap-1">
                                            <Info className="h-4 w-4 text-emerald-800" />
                                            Pre-Procedure Instructions (Poorvakarma guidelines)
                                        </label>
                                        <textarea 
                                            rows={2.5}
                                            placeholder="e.g. Snehapana should be taken in early morning on empty stomach with warm water."
                                            value={preInstructions}
                                            onChange={(e) => setPreInstructions(e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-350 transition resize-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-500 flex items-center gap-1">
                                            <Info className="h-4 w-4 text-emerald-800" />
                                            Post-Procedure Instructions (Paschatkarma recovery)
                                        </label>
                                        <textarea 
                                            rows={2.5}
                                            placeholder="e.g. Avoid direct wind drafts, loud noise, and emotional stress. Warm water wash only."
                                            value={postInstructions}
                                            onChange={(e) => setPostInstructions(e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-350 transition resize-none"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-500">Base Dietary Framework (Peya-adi Samsarjana Schedule)</label>
                                        <textarea 
                                            rows={2.5}
                                            placeholder="e.g. Day 1: Manda (Rice water). Day 2: Peya (Thin gruel). Day 3: Vilepi (Thick gruel)..."
                                            value={dietFramework}
                                            onChange={(e) => setDietFramework(e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-350 transition resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stepper Footer Controls */}
                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-6">
                            <button
                                type="button"
                                disabled={step === 1}
                                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                                className="rounded-lg border border-slate-250 px-3.5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-transparent"
                            >
                                <span className="flex items-center gap-1">
                                    <ArrowLeft className="h-4 w-4" />
                                    Prev
                                </span>
                            </button>

                            <div className="flex items-center gap-3">
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(prev => Math.min(3, prev + 1))}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-950 transition"
                                    >
                                        <span className="flex items-center gap-1">
                                            Next
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="rounded-lg bg-emerald-900 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-950 transition"
                                    >
                                        Save & Publish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
