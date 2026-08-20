// src/Doctor/Components/AIDietCard.tsx
import React, { useState } from 'react';
import { StageDietPlan } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import {
  Utensils,
  Ban,
  Activity,
  Droplets,
  Plus,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';

export interface AIDietCardProps {
  stage: StageDietPlan;
  stageIndex: number;
  isEditing: boolean;
  onUpdateDiet: (
    stageIndex: number,
    foodItem: string,
    action: 'add' | 'remove',
    type: 'pathya' | 'apathya'
  ) => void;
  onUpdateYoga: (stageIndex: number, asana: string, action: 'add' | 'remove') => void;
}

export const AIDietCard: React.FC<AIDietCardProps> = ({
  stage,
  stageIndex,
  isEditing,
  onUpdateDiet,
  onUpdateYoga,
}) => {
  const [newPathya, setNewPathya] = useState('');
  const [newApathya, setNewApathya] = useState('');
  const [newYoga, setNewYoga] = useState('');

  return (
    <Card className="flex flex-col gap-4">
      {/* Stage Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-ayur-primary text-white font-bold text-xs flex items-center justify-center font-serif">
            {stageIndex + 1}
          </span>
          <div>
            <h4 className="text-sm font-bold text-gray-900 font-serif">
              {stage.stageName}
            </h4>
            <p className="text-[11px] text-gray-500 font-medium">
              Category: {stage.stageCategory}
            </p>
          </div>
        </div>

        <Badge variant="ayur" size="sm">
          Stage {stageIndex + 1} Protocol
        </Badge>
      </div>

      {/* Pathya (Recommended) vs Apathya (Prohibited) Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Pathya */}
        <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Utensils className="w-3.5 h-3.5 text-emerald-700" />
            Pathya Ahara (Prescribed Nutrition)
          </span>

          <ul className="flex flex-col gap-1.5 text-xs text-gray-800">
            {stage.pathyaFoods.map((item, idx) => (
              <li key={idx} className="flex items-start justify-between gap-2">
                <span className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => onUpdateDiet(stageIndex, item, 'remove', 'pathya')}
                    className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isEditing && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-emerald-200/60">
              <input
                type="text"
                value={newPathya}
                onChange={(e) => setNewPathya(e.target.value)}
                placeholder="Add prescribed food..."
                className="flex-1 rounded-lg border border-emerald-300 px-2.5 py-1 text-xs bg-white focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  if (newPathya.trim()) {
                    onUpdateDiet(stageIndex, newPathya, 'add', 'pathya');
                    setNewPathya('');
                  }
                }}
              >
                +
              </Button>
            </div>
          )}
        </div>

        {/* Prohibited Apathya */}
        <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/80 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5 font-serif">
            <Ban className="w-3.5 h-3.5 text-rose-700" />
            Apathya Ahara (Strictly Prohibited)
          </span>

          <ul className="flex flex-col gap-1.5 text-xs text-gray-800">
            {stage.apathyaFoods.map((item, idx) => (
              <li key={idx} className="flex items-start justify-between gap-2">
                <span className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => onUpdateDiet(stageIndex, item, 'remove', 'apathya')}
                    className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {isEditing && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-rose-200/60">
              <input
                type="text"
                value={newApathya}
                onChange={(e) => setNewApathya(e.target.value)}
                placeholder="Add restricted food..."
                className="flex-1 rounded-lg border border-rose-300 px-2.5 py-1 text-xs bg-white focus:outline-none"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  if (newApathya.trim()) {
                    onUpdateDiet(stageIndex, newApathya, 'add', 'apathya');
                    setNewApathya('');
                  }
                }}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Yogic Exercises & Hydration Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/80 flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase text-ayur-primary tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            Recommended Asanas & Pranayama
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stage.yogaAsanas.map((yoga, idx) => (
              <span
                key={idx}
                className="bg-white border border-ayur-sand/80 px-2 py-0.5 rounded-lg text-gray-800 text-[11px] font-medium"
              >
                {yoga}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/80 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase text-ayur-brown tracking-wider flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-600" />
            Hydration & Ushnodaka Guidelines
          </span>
          <p className="text-gray-700 font-medium text-xs leading-snug">
            {stage.hydrationNotes}
          </p>
        </div>
      </div>
    </Card>
  );
};
