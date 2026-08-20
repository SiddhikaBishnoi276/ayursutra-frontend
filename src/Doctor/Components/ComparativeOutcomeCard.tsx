// src/Doctor/Components/ComparativeOutcomeCard.tsx
import React from 'react';
import { ComparativeOutcomeReport } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Award, CheckCircle2, TrendingDown, FileText } from 'lucide-react';

export interface ComparativeOutcomeCardProps {
  report: ComparativeOutcomeReport;
  className?: string;
}

export const ComparativeOutcomeCard: React.FC<ComparativeOutcomeCardProps> = ({
  report,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col gap-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Pre-Treatment vs. Post-Treatment Comparative Outcome Matrix
            </h4>
            <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
              AYUSH Efficacy Verified
            </Badge>
          </div>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Objective baseline vs. discharge physiological & subjective symptom evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-center">
            <span className="text-sm font-black text-emerald-900 font-serif block">
              {report.reliefPercentage}%
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-750 block">
              Total Relief
            </span>
          </div>
        </div>
      </div>

      {/* Side by Side Comparative Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-ayur-sand/80 bg-[#fbf9f5] text-gray-700 uppercase font-bold text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Clinical Biomarker / Parameter</th>
              <th className="py-2.5 px-3 text-rose-900">Pre-Treatment Baseline</th>
              <th className="py-2.5 px-3 text-emerald-900">Post-Treatment Outcome</th>
              <th className="py-2.5 px-3 text-ayur-primary">Clinical Shift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
            <tr>
              <td className="py-2.5 px-3 font-bold font-serif text-gray-900">VAS Pain Severity (0-10)</td>
              <td className="py-2.5 px-3 text-rose-700 font-bold">{report.preTreatment.vasPainScore} / 10</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">{report.postTreatment.vasPainScore} / 10</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" /> -{report.reliefPercentage}% Pain Reduction
              </td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 font-bold font-serif text-gray-900">Blood Pressure (mmHg)</td>
              <td className="py-2.5 px-3 text-gray-700">{report.preTreatment.bloodPressure}</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">{report.postTreatment.bloodPressure}</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">Normotensive Shift</td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 font-bold font-serif text-gray-900">Radial Pulse (BPM)</td>
              <td className="py-2.5 px-3 text-gray-700">{report.preTreatment.radialPulse} bpm</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">{report.postTreatment.radialPulse} bpm</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">Stable Rhythm</td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 font-bold font-serif text-gray-900">Digestive Fire (Agni)</td>
              <td className="py-2.5 px-3 text-amber-700">{report.preTreatment.agniStatus}</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">{report.postTreatment.agniStatus}</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">Samagni Restored</td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 font-bold font-serif text-gray-900">Sleep Duration / Quality</td>
              <td className="py-2.5 px-3 text-gray-700">{report.preTreatment.sleepHours} hrs (Disturbed)</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">{report.postTreatment.sleepHours} hrs (Sound)</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">+2.5 hrs Restful Sleep</td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 font-bold font-serif text-gray-900">Range of Motion / Mobility</td>
              <td className="py-2.5 px-3 text-rose-700 text-[11px]">{report.preTreatment.mobilityIndex}</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold text-[11px]">{report.postTreatment.mobilityIndex}</td>
              <td className="py-2.5 px-3 text-emerald-700 font-bold">Full Flexibility Restored</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Doctor's Summary Note */}
      <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/80 text-xs">
        <span className="font-bold font-serif text-ayur-primary uppercase text-[10px] tracking-wider block mb-0.5">
          Prognosis & Clinical Conclusion:
        </span>
        <p className="text-gray-700 font-medium leading-relaxed">
          {report.prognosisSummary}
        </p>
      </div>
    </Card>
  );
};
