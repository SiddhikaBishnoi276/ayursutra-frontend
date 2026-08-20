import React, { useState } from 'react';
import { PrakritiQuestion, PrakritiWeightOption } from '../types/admin.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { EmptyState } from '../../Common/Components/EmptyState';
import { QuestionWeightEditor } from './QuestionWeightEditor';
import { Plus, Edit2, Trash2, HelpCircle, Sparkles, Scale, History } from 'lucide-react';

interface QuestionnaireTabProps {
  questions: PrakritiQuestion[];
  onAddQuestion?: (data: { attribute: string; questionText: string; options: PrakritiWeightOption[] }) => void;
  onEditQuestion?: (q: PrakritiQuestion) => void;
  onRemoveQuestion?: (id: string) => void;
}

export const QuestionnaireTab: React.FC<QuestionnaireTabProps> = ({
  questions,
  onAddQuestion,
  onEditQuestion,
  onRemoveQuestion,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PrakritiQuestion | null>(null);

  // Form states
  const [attribute, setAttribute] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<PrakritiWeightOption[]>([
    { text: 'Thin, lean, easily fatigued, dry cold skin', vata: 3, pitta: 0, kapha: 0 },
    { text: 'Medium muscular frame, warm oily skin, sharp hunger', vata: 0, pitta: 3, kapha: 0 },
    { text: 'Broad, heavy build, cool moist skin, calm demeanor', vata: 0, pitta: 0, kapha: 3 },
  ]);

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setAttribute('');
    setQuestionText('');
    setOptions([
      { text: 'Option A (Vata dominant traits)', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Option B (Pitta dominant traits)', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Option C (Kapha dominant traits)', vata: 0, pitta: 0, kapha: 3 },
    ]);
    setModalOpen(true);
  };

  const handleOpenEdit = (q: PrakritiQuestion) => {
    setEditingQuestion(q);
    setAttribute(q.attribute);
    setQuestionText(q.questionText);
    setOptions(q.options);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attribute || !questionText || options.length < 2) return;

    if (editingQuestion) {
      onEditQuestion?.({
        ...editingQuestion,
        attribute,
        questionText,
        options,
      });
    } else {
      onAddQuestion?.({
        attribute,
        questionText,
        options,
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
            Prakriti Assessment Diagnostic Questionnaire
          </h1>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Configure clinical diagnostic questions, dosha weighting algorithms, and historical version locks.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAdd}
          className="self-start sm:self-auto"
        >
          Add Question
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No Assessment Questions"
          message="No Prakriti assessment questions found in the questionnaire repository."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {questions.map((q, idx) => (
            <Card key={q.id} className="flex flex-col gap-4">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#f4f7f4] text-ayur-primary font-bold text-xs flex items-center justify-center font-serif shrink-0 border border-ayur-sand/50">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 font-serif">
                      {q.attribute}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Question ID: {q.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge variant="ayur" size="sm" icon={<History className="w-3 h-3" />}>
                    v{q.version.toFixed(1)}
                  </Badge>
                  {q.hasHistoricalResponses && (
                    <Badge variant="info" size="sm">
                      Locked Responses
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(q)}
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveQuestion?.(q.id)}
                    icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Question Text Prompt */}
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                "{q.questionText}"
              </p>

              {/* Answer Options with Inline Dosha Badges */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {q.options.map((opt, oIdx) => (
                  <div
                    key={oIdx}
                    className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start sm:items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white text-ayur-primary font-bold text-[10px] flex items-center justify-center border border-ayur-sand/70 shrink-0 font-serif">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="font-medium text-gray-800">
                        {opt.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      {opt.vata > 0 && (
                        <Badge variant="info" size="sm">
                          Vata +{opt.vata}
                        </Badge>
                      )}
                      {opt.pitta > 0 && (
                        <Badge variant="warning" size="sm">
                          Pitta +{opt.pitta}
                        </Badge>
                      )}
                      {opt.kapha > 0 && (
                        <Badge variant="ayur" size="sm">
                          Kapha +{opt.kapha}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingQuestion ? 'Edit Assessment Question' : 'Add Diagnostic Question'}
        subtitle="Configure physical attribute criteria and dosha weighting points."
        maxWidth="xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Diagnostic Attribute *</label>
            <input
              type="text"
              required
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
              placeholder="e.g. Skin Quality, Digestion Strength..."
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-700">Patient Question Text *</label>
            <textarea
              rows={2}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter the question as it appears to the patient during assessment..."
              className="rounded-xl border border-ayur-sand/80 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-ayur-primary resize-none"
            />
          </div>

          {/* Dosha Weight Stepper Editor */}
          <QuestionWeightEditor
            options={options}
            onChange={setOptions}
          />

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
              {editingQuestion ? 'Save Question Version' : 'Add Question'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
