// src/Patient/Components/DietPlanCard.tsx
// Comprehensive Ayurvedic Diet Plan and Dosha Pacifying Meal Schedule Card

import React, { useState } from 'react';
import { AlertTriangle, Coffee, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { DietPlan } from '../types/patient.types';

export interface DietPlanCardProps {
  dietPlan: DietPlan;
  className?: string;
}

export const DietPlanCard: React.FC<DietPlanCardProps> = ({
  dietPlan,
  className = '',
}) => {
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  const toggleMeal = (idx: number) => {
    setExpandedMeal(expandedMeal === idx ? null : idx);
  };

  return (
    <Card className={`border border-ayur-sand/70 p-5 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Personalized Nutrition
            </span>
            <Badge variant="ayur" size="sm">
              AI + Doctor Validated
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-serif mt-0.5">
            {dietPlan.planTitle}
          </h3>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Target: <strong className="text-gray-800">{dietPlan.doshaTarget}</strong>
          </p>
        </div>
      </div>

      {/* General Guidelines Banner */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/60 text-xs">
        <span className="font-bold text-gray-900 font-serif block mb-1">
          Core Dietary Rules:
        </span>
        <ul className="list-disc list-inside text-gray-700 space-y-1 text-[11px]">
          {dietPlan.dietaryGuidelines.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </div>

      {/* Meal Timing Breakdown */}
      <div className="mt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
          Daily Meal Schedule
        </h4>

        <div className="space-y-2.5">
          {dietPlan.mealPlan.map((meal, idx) => {
            const isExpanded = expandedMeal === idx || expandedMeal === null;
            return (
              <div
                key={idx}
                className="rounded-xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleMeal(idx)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-[#fbf9f5] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 font-serif block">
                        {meal.mealTime}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {meal.timeRange}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-1 text-xs border-t border-stone-100 bg-[#fdfdfa]">
                    <div className="mb-2">
                      <span className="text-[11px] font-bold text-gray-700 block mb-1">
                        Recommended Items:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {meal.items.map((item, itemIdx) => (
                          <span
                            key={itemIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-gray-800 text-[11px] font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {meal.precautions && (
                      <p className="text-[11px] text-amber-800 font-medium bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                        <strong>Precaution:</strong> {meal.precautions}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forbidden Foods vs Permitted Drinks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-100">
        {/* Forbidden Foods */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70 text-xs">
          <div className="flex items-center gap-1.5 mb-2 text-rose-900 font-bold font-serif">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Strictly Avoid (Pathya Rules):</span>
          </div>
          <ul className="list-disc list-inside text-rose-800 space-y-1 text-[11px] font-medium">
            {dietPlan.forbiddenFoods.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Permitted Drinks & Teas */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs">
          <div className="flex items-center gap-1.5 mb-2 text-emerald-950 font-bold font-serif">
            <Coffee className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Beneficial Hydration & Herbal Drinks:</span>
          </div>
          <ul className="list-disc list-inside text-emerald-800 space-y-1 text-[11px] font-medium">
            {dietPlan.permittedDrinks.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default DietPlanCard;
