// src/admin/components/QuestionWeightEditor.tsx
import React from 'react';
import { PrakritiWeightOption } from '../types/admin.types';
import { Badge } from '../../Common/Components/Badge';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface QuestionWeightEditorProps {
  options: PrakritiWeightOption[];
  onChange: (options: PrakritiWeightOption[]) => void;
  className?: string;
}

export const QuestionWeightEditor: React.FC<QuestionWeightEditorProps> = ({
  options,
  onChange,
  className = '',
}) => {
  const handleTextChange = (idx: number, text: string) => {
    const next = [...options];
    next[idx] = { ...next[idx], text };
    onChange(next);
  };

  const handleWeightChange = (
    idx: number,
    dosha: 'vata' | 'pitta' | 'kapha',
    delta: number
  ) => {
    const next = [...options];
    const currentVal = next[idx][dosha];
    const newVal = Math.max(0, Math.min(5, currentVal + delta));
    next[idx] = { ...next[idx], [dosha]: newVal };
    onChange(next);
  };

  const handleAddOption = () => {
    onChange([
      ...options,
      { text: `Option ${String.fromCharCode(65 + options.length)} description`, vata: 1, pitta: 0, kapha: 0 },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== idx));
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-ayur-green-mid">
          Diagnostic Assessment Options & Dosha Weights
        </label>
        <button
          type="button"
          onClick={handleAddOption}
          className="text-xs font-bold text-ayur-primary hover:text-ayur-brown inline-flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Option
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-6 h-6 rounded-full bg-white border border-ayur-sand/80 text-ayur-primary font-bold text-xs flex items-center justify-center font-serif shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                  placeholder="Enter option description..."
                  className="flex-1 bg-white rounded-lg border border-ayur-sand/70 px-3 py-1.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-ayur-primary"
                />
              </div>

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                  title="Remove Option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dosha Weight Steppers */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-ayur-sand/40">
              {/* Vata Stepper */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-ayur-sand/50">
                <Badge variant="info" size="sm">
                  Vata
                </Badge>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWeightChange(idx, 'vata', -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-gray-900 w-3 text-center">
                    {opt.vata}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleWeightChange(idx, 'vata', 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Pitta Stepper */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-ayur-sand/50">
                <Badge variant="warning" size="sm">
                  Pitta
                </Badge>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWeightChange(idx, 'pitta', -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-gray-900 w-3 text-center">
                    {opt.pitta}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleWeightChange(idx, 'pitta', 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Kapha Stepper */}
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-ayur-sand/50">
                <Badge variant="ayur" size="sm">
                  Kapha
                </Badge>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWeightChange(idx, 'kapha', -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-gray-900 w-3 text-center">
                    {opt.kapha}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleWeightChange(idx, 'kapha', 1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
