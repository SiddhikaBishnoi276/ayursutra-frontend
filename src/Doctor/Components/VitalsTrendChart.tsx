// src/Doctor/Components/VitalsTrendChart.tsx
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { ProgressPoint } from '../types/doctor.types';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import {
  Activity,
  HeartPulse,
  Flame,
  Moon,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';

export interface VitalsTrendChartProps {
  progressPoints: ProgressPoint[];
  className?: string;
}

export const VitalsTrendChart: React.FC<VitalsTrendChartProps> = ({
  progressPoints = [],
  className = '',
}) => {
  const [selectedPoint, setSelectedPoint] = useState<ProgressPoint | null>(null);

  if (!progressPoints || progressPoints.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500">
        No telemetry session logs recorded yet.
      </Card>
    );
  }

  // Format data for Recharts
  const chartData = progressPoints.map((p) => {
    let stageShort = 'POOR';
    if (p.stage === 'Pradhanakarma') stageShort = 'PRAD';
    if (p.stage === 'Paschatkarma') stageShort = 'PASC';

    return {
      ...p,
      dayLabel: `Day ${p.day}`,
      stageShort,
      clinicalVAS: Number(p.clinicalVASScore),
      patientVAS: Number(p.patientReportedVASScore),
    };
  });

  const activePoint =
    selectedPoint || progressPoints[progressPoints.length - 1];

  // Custom Dot renderer that shows a red alert pin for complication days
  const renderClinicalDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isFlagged = payload.complicationFlag;

    if (isFlagged) {
      return (
        <g key={`flag-${payload.day}`}>
          {/* Animated pulsing red halo */}
          <circle
            cx={cx}
            cy={cy}
            r={9}
            className="fill-rose-500 opacity-40 animate-ping"
          />
          <circle
            cx={cx}
            cy={cy}
            r={5.5}
            fill="#e11d48"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </g>
      );
    }

    return (
      <circle
        key={`dot-${payload.day}`}
        cx={cx}
        cy={cy}
        r={4.5}
        fill="#1b3b2b"
        stroke="#ffffff"
        strokeWidth={1.5}
        className="transition-all hover:r-6 cursor-pointer"
      />
    );
  };

  const renderPatientDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <circle
        key={`p-dot-${payload.day}`}
        cx={cx}
        cy={cy}
        r={4}
        fill="#d97706"
        stroke="#ffffff"
        strokeWidth={1.5}
        className="transition-all hover:r-5 cursor-pointer"
      />
    );
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as (typeof chartData)[0];
      return (
        <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-ayur-sand shadow-md text-xs font-sans min-w-[240px]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 mb-2">
            <span className="font-bold font-serif text-gray-900 text-sm">
              Day {data.day} ({data.date})
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-ayur-primary border border-emerald-200">
              {data.stage}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-emerald-950 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1b3b2b]"></span>
                Clinical VAS (Therapist):
              </span>
              <span className="font-bold font-serif text-sm">
                {data.clinicalVASScore} / 10
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-amber-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
                Patient Self-Report:
              </span>
              <span className="font-bold font-serif text-sm">
                {data.patientReportedVASScore} / 10
              </span>
            </div>

            <div className="text-[10px] text-gray-500 pt-1.5 border-t border-gray-100 mt-1 flex justify-between">
              <span>BP: {data.bloodPressure}</span>
              <span>Pulse: {data.pulseBpm} bpm</span>
              <span>Agni: {data.agniStatus}</span>
            </div>

            {data.therapistNotes && (
              <p className="text-[11px] text-gray-700 font-medium bg-[#fbf9f5] p-2 rounded-xl border border-ayur-sand/70 mt-1 leading-snug">
                <strong className="text-ayur-primary font-serif">Note:</strong> {data.therapistNotes}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom X-Axis Tick with Day and Stage Label
  const renderCustomXAxisTick = ({ x, y, payload }: any) => {
    const item = chartData.find((d) => d.dayLabel === payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={12}
          textAnchor="middle"
          fill="#374151"
          fontSize={11}
          fontWeight="bold"
        >
          {payload.value}
        </text>
        {item && (
          <text
            x={0}
            y={0}
            dy={24}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize={9}
            fontWeight="600"
          >
            {item.stageShort}
          </text>
        )}
      </g>
    );
  };

  return (
    <Card className={`flex flex-col gap-5 ${className}`}>
      {/* Header with Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h4 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
            <Activity className="w-5 h-5 text-ayur-primary" />
            Dual VAS Pain Trajectory & Stage Transitions
          </h4>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Synchronized comparison of Clinical Assessment (Green solid) vs. Patient Telemetry (Gold dashed).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1b3b2b]"></span>
            <span className="text-gray-800">Clinical VAS (Therapist)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
            <span className="text-gray-800">Patient Self-Report</span>
          </div>
        </div>
      </div>

      {/* Recharts Continuous Dual Line Chart */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 20, left: -10, bottom: 20 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                setSelectedPoint(state.activePayload[0].payload);
              }
            }}
          >
            {/* Stage Shaded Background Reference Areas */}
            <ReferenceArea
              x1="Day 1"
              x2="Day 3"
              fill="#10b981"
              fillOpacity={0.06}
              label={{
                value: 'Poorvakarma',
                position: 'insideTopLeft',
                fill: '#065f46',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />
            <ReferenceArea
              x1="Day 4"
              x2="Day 6"
              fill="#f59e0b"
              fillOpacity={0.06}
              label={{
                value: 'Pradhanakarma',
                position: 'insideTopLeft',
                fill: '#92400e',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />
            <ReferenceArea
              x1="Day 7"
              x2="Day 7"
              fill="#0d9488"
              fillOpacity={0.06}
              label={{
                value: 'Paschatkarma',
                position: 'insideTopRight',
                fill: '#115e59',
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5dec9"
              vertical={false}
              opacity={0.7}
            />

            <XAxis
              dataKey="dayLabel"
              tick={renderCustomXAxisTick}
              tickLine={false}
              axisLine={{ stroke: '#d6ceb8' }}
              interval={0}
            />

            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 'bold' }}
              tickLine={false}
              axisLine={{ stroke: '#d6ceb8' }}
              unit=""
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Series 1: Clinical VAS Line (Solid Green) */}
            <Line
              type="monotone"
              dataKey="clinicalVAS"
              name="Clinical VAS"
              stroke="#1b3b2b"
              strokeWidth={2.5}
              dot={renderClinicalDot}
              activeDot={{ r: 7, fill: '#1b3b2b', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={800}
            />

            {/* Series 2: Patient Reported VAS Line (Dashed Gold) */}
            <Line
              type="monotone"
              dataKey="patientVAS"
              name="Patient VAS"
              stroke="#d97706"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={renderPatientDot}
              activeDot={{ r: 6, fill: '#d97706', stroke: '#ffffff', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Day Telemetry & Vitals Strip */}
      <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-serif text-gray-900 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-ayur-primary" />
            Day {activePoint.day} Session Breakdown ({activePoint.sessionName})
          </span>

          <Badge variant="ayur" size="sm">
            Stage: {activePoint.stage}
          </Badge>
        </div>

        {/* Separated Clean Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-ayur-sand/70">
            <span className="text-[9px] font-bold uppercase text-gray-500 block">
              Clinical VAS
            </span>
            <span className="font-bold text-ayur-primary text-base font-serif block mt-0.5">
              {activePoint.clinicalVASScore} / 10
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Therapist Rated</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-ayur-sand/70">
            <span className="text-[9px] font-bold uppercase text-gray-500 block">
              Patient Self-Report
            </span>
            <span className="font-bold text-amber-700 text-base font-serif block mt-0.5">
              {activePoint.patientReportedVASScore} / 10
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">App Telemetry</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-ayur-sand/70">
            <span className="text-[9px] font-bold uppercase text-gray-500 block">
              Blood Pressure
            </span>
            <span className="font-bold text-gray-900 text-base font-serif block mt-0.5">
              {activePoint.bloodPressure}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">mmHg (Resting)</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-ayur-sand/70">
            <span className="text-[9px] font-bold uppercase text-gray-500 block">
              Pulse (Nadi)
            </span>
            <span className="font-bold text-emerald-800 text-base font-serif block mt-0.5">
              {activePoint.pulseBpm} bpm
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Regular Rhythm</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-ayur-sand/70">
            <span className="text-[9px] font-bold uppercase text-gray-500 block">
              Agni (Digestion)
            </span>
            <span className="font-bold text-amber-800 text-sm font-serif block mt-1">
              {activePoint.agniStatus}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Digestive Fire</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-ayur-sand/70">
            <span className="text-[9px] font-bold uppercase text-gray-500 block">
              Sleep Rating
            </span>
            <span className="font-bold text-indigo-700 text-sm font-serif block mt-1">
              ★ {activePoint.sleepQualityRating} / 5
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Sound Recovery</span>
          </div>
        </div>

        {/* Notes if present */}
        {activePoint.therapistNotes && (
          <p className="text-xs text-gray-700 font-medium bg-white p-2.5 rounded-xl border border-gray-100">
            <strong className="text-ayur-primary font-serif">Therapist Clinical Notes:</strong> {activePoint.therapistNotes}
          </p>
        )}
      </div>
    </Card>
  );
};

export default VitalsTrendChart;
