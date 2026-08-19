import { useState } from 'react';
import { PrakritiQuestion, PrakritiWeightOption } from '../types/admin.types';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    AlertTriangle, 
    CheckCircle2, 
    Scale, 
    History,
    Save
} from 'lucide-react';

interface QuestionnaireTabProps {
    questions: PrakritiQuestion[];
    onAddQuestion: (q: Omit<PrakritiQuestion, 'id' | 'version' | 'hasHistoricalResponses'>) => void;
    onEditQuestion: (q: PrakritiQuestion) => void;
    onRemoveQuestion: (id: string) => void;
}

export const QuestionnaireTab = ({ 
    questions, 
    onAddQuestion, 
    onEditQuestion, 
    onRemoveQuestion 
}: QuestionnaireTabProps) => {
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [addDrawerOpen, setAddDrawerOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Edit state
    const [currentQuestion, setCurrentQuestion] = useState<PrakritiQuestion | null>(null);

    // Add state
    const [addForm, setAddForm] = useState({
        attribute: '',
        questionText: '',
        options: [
            { text: 'Option A (Vata)', vata: 3, pitta: 0, kapha: 0 },
            { text: 'Option B (Pitta)', vata: 0, pitta: 3, kapha: 0 },
            { text: 'Option C (Kapha)', vata: 0, pitta: 0, kapha: 3 }
        ] as PrakritiWeightOption[]
    });

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleEditClick = (q: PrakritiQuestion) => {
        setCurrentQuestion({ ...q });
        setEditDrawerOpen(true);
    };

    const handleEditSave = () => {
        if (!currentQuestion) return;
        onEditQuestion(currentQuestion);
        setEditDrawerOpen(false);
        setCurrentQuestion(null);
        showToast('Question details and version weights updated successfully.');
    };

    const handleAddSave = (e: React.FormEvent) => {
        e.preventDefault();
        onAddQuestion({
            attribute: addForm.attribute,
            questionText: addForm.questionText,
            options: addForm.options
        });
        setAddDrawerOpen(false);
        setAddForm({
            attribute: '',
            questionText: '',
            options: [
                { text: 'Option A (Vata)', vata: 3, pitta: 0, kapha: 0 },
                { text: 'Option B (Pitta)', vata: 0, pitta: 3, kapha: 0 },
                { text: 'Option C (Kapha)', vata: 0, pitta: 0, kapha: 3 }
            ]
        });
        showToast('New diagnostic attribute question added.');
    };

    const handleDeleteClick = (id: string) => {
        setPendingDeleteId(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (pendingDeleteId) {
            onRemoveQuestion(pendingDeleteId);
            showToast('Question attribute deleted successfully.');
        }
        setDeleteConfirmOpen(false);
        setPendingDeleteId(null);
    };

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Prakriti Questionnaire Management</h2>
                    <p className="text-sm text-slate-500 font-medium">Configure questions and weights that dynamically calculate Vata, Pitta, and Kapha metabolic classifications.</p>
                </div>
                
                <button
                    onClick={() => setAddDrawerOpen(true)}
                    title="Add a new metabolic attribute question"
                    tabIndex={0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-950 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-850"
                >
                    <Plus className="h-4.5 w-4.5" />
                    Add Question
                </button>
            </div>

            {/* List of Questions */}
            <div className="flex flex-col gap-5">
                {questions.map((q) => (
                    <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col gap-4">
                        
                        {/* Question Title Bar */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-3">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-xs font-bold text-slate-400">ID: {q.id}</span>
                                <h3 className="font-bold text-slate-800 text-sm">{q.attribute}</h3>
                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
                                    <History className="h-3 w-3" />
                                    v{q.version}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <button
                                    onClick={() => handleEditClick(q)}
                                    title={`Edit metabolic weights for ${q.attribute}`}
                                    tabIndex={0}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-250 px-3 py-1.5 text-xs font-bold text-slate-650 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-400"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                    Edit Weights
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(q.id)}
                                    title={`Permanently delete ${q.attribute}`}
                                    tabIndex={0}
                                    className="rounded-lg p-2 text-slate-450 hover:bg-red-50 hover:text-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Question Text */}
                        <p className="text-xs font-bold text-slate-705 leading-relaxed italic">"{q.questionText}"</p>

                        {/* Options Weights */}
                        <div className="flex flex-col gap-3">
                            {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex flex-col gap-2 rounded-xl bg-slate-50/50 border border-slate-200/50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-xs font-semibold text-slate-705 leading-relaxed">{opt.text}</span>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-sky-850 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/50">
                                            Vata +{opt.vata}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-850 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                                            Pitta +{opt.pitta}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-855 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                                            Kapha +{opt.kapha}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

            {/* Edit Slide-Over Drawer */}
            {editDrawerOpen && currentQuestion && (
                <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between overflow-y-auto border-l border-slate-200">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-850">Edit Prakriti Weights</h3>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Modify metabolic influence factors.</p>
                                </div>
                                <button 
                                    onClick={() => setEditDrawerOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                                    title="Close Edit Drawer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Version lock warning */}
                            {currentQuestion.hasHistoricalResponses && (
                                <div className="mt-4 rounded-xl bg-amber-50/50 border border-amber-200/50 p-4 text-amber-900 flex items-start gap-2.5 font-medium text-xs leading-relaxed">
                                    <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-amber-800">Historical Responses Locked</p>
                                        <p className="mt-0.5 text-[11px]">
                                            This question has historical responses. Saving changes will automatically increment the version to <strong>v{(currentQuestion.version + 0.1).toFixed(1)}</strong> to preserve audit trails.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Form */}
                            <div className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Attribute Title *</label>
                                    <input 
                                        type="text" 
                                        value={currentQuestion.attribute}
                                        onChange={(e) => setCurrentQuestion(prev => prev ? { ...prev, attribute: e.target.value } : null)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Question Content *</label>
                                    <input 
                                        type="text" 
                                        value={currentQuestion.questionText}
                                        onChange={(e) => setCurrentQuestion(prev => prev ? { ...prev, questionText: e.target.value } : null)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                {/* Options edit */}
                                <div className="flex flex-col gap-3 mt-2">
                                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Option Weights Configuration</label>
                                    {currentQuestion.options.map((opt, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/30 p-3">
                                            <input 
                                                type="text" 
                                                value={opt.text}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCurrentQuestion(prev => {
                                                        if (!prev) return null;
                                                        const updatedOpts = [...prev.options];
                                                        updatedOpts[idx] = { ...updatedOpts[idx], text: val };
                                                        return { ...prev, options: updatedOpts };
                                                    });
                                                }}
                                                className="rounded bg-white border border-slate-200 px-2 py-1 outline-none font-medium"
                                            />

                                            <div className="flex gap-2 mt-1">
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <span className="text-[9px] text-slate-400">Vata</span>
                                                    <input 
                                                        type="number"
                                                        value={opt.vata}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            setCurrentQuestion(prev => {
                                                                if (!prev) return null;
                                                                const updatedOpts = [...prev.options];
                                                                updatedOpts[idx] = { ...updatedOpts[idx], vata: val };
                                                                return { ...prev, options: updatedOpts };
                                                            });
                                                        }}
                                                        className="rounded border border-slate-200 bg-white px-2 py-1 outline-none"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <span className="text-[9px] text-slate-400">Pitta</span>
                                                    <input 
                                                        type="number"
                                                        value={opt.pitta}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            setCurrentQuestion(prev => {
                                                                if (!prev) return null;
                                                                const updatedOpts = [...prev.options];
                                                                updatedOpts[idx] = { ...updatedOpts[idx], pitta: val };
                                                                return { ...prev, options: updatedOpts };
                                                            });
                                                        }}
                                                        className="rounded border border-slate-200 bg-white px-2 py-1 outline-none"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <span className="text-[9px] text-slate-400">Kapha</span>
                                                    <input 
                                                        type="number"
                                                        value={opt.kapha}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 0;
                                                            setCurrentQuestion(prev => {
                                                                if (!prev) return null;
                                                                const updatedOpts = [...prev.options];
                                                                updatedOpts[idx] = { ...updatedOpts[idx], kapha: val };
                                                                return { ...prev, options: updatedOpts };
                                                            });
                                                        }}
                                                        className="rounded border border-slate-200 bg-white px-2 py-1 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3 border-t border-slate-100 pt-4 mt-6">
                            <button
                                onClick={() => setEditDrawerOpen(false)}
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="flex-1 rounded-lg bg-emerald-900 py-2.5 text-xs font-bold text-white hover:bg-emerald-950 transition flex items-center justify-center gap-1.5"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Slide-Over Drawer */}
            {addDrawerOpen && (
                <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-xs">
                    <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-350 flex flex-col justify-between overflow-y-auto border-l border-slate-200">
                        <div>
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-850">Add Diagnostic Question</h3>
                                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Define new diagnostic attributes for Prakriti.</p>
                                </div>
                                <button 
                                    onClick={() => setAddDrawerOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
                                    title="Close Add Drawer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form id="add-question-form" onSubmit={handleAddSave} className="mt-5 flex flex-col gap-4 text-xs font-semibold">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Attribute Target *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Skin Pigment, Sleep quality"
                                        value={addForm.attribute}
                                        onChange={(e) => setAddForm(prev => ({ ...prev, attribute: e.target.value }))}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-slate-500">Diagnostic Question *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. What type of sleep cycles do you experience?"
                                        value={addForm.questionText}
                                        onChange={(e) => setAddForm(prev => ({ ...prev, questionText: e.target.value }))}
                                        className="rounded-lg border border-slate-250 px-3 py-2 text-slate-850 outline-none focus:border-slate-350 transition"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-3 border-t border-slate-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setAddDrawerOpen(false)}
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="add-question-form"
                                className="flex-1 rounded-lg bg-emerald-900 py-2.5 text-xs font-bold text-white hover:bg-emerald-950 transition"
                            >
                                Publish Attribute
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Centered Deletion Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in scale-in duration-200 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-red-700">
                            <div className="rounded-full bg-red-50 p-2 border border-red-200">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h4 className="text-base font-extrabold text-slate-850">Confirm Deletion</h4>
                        </div>
                        
                        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                            Are you sure you want to delete this Prakriti diagnostic attribute? This will permanently delete this question, and historical patient responses associated with it will no longer display weight calculations.
                        </p>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => {
                                    setDeleteConfirmOpen(false);
                                    setPendingDeleteId(null);
                                }}
                                className="flex-1 rounded-lg border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 rounded-lg bg-red-700 py-2.5 text-xs font-bold text-white hover:bg-red-800 transition"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {toastMessage && (
                <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in slide-in-from-bottom-2 duration-300">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                    <span>{toastMessage}</span>
                </div>
            )}

        </div>
    );
};
