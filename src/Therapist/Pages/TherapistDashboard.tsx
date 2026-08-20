// src/Therapist/Pages/TherapistDashboard.tsx
import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { StatCard } from '../../Common/Components/StatCard';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { useSessionQueue } from '../Hooks/useSessionQueue';
import { useAvailability } from '../Hooks/useAvailability';
import { TherapistSession } from '../types/therapist.types';
import { getStatusBadgeConfig } from '../Services/therapistService';

export interface TherapistDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectSessionForStart: (session: TherapistSession) => void;
  onSelectSessionForActive: (session: TherapistSession) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({
  onNavigateTab,
  onSelectSessionForStart,
  onSelectSessionForActive,
}) => {
  const { rawQueue, stats, isLoading: isQueueLoading } = useSessionQueue();
  const {
    isTodayAvailable,
    toggleTodayAvailability,
    workload,
    profile,
  } = useAvailability();

  // Next 3 scheduled or in-progress sessions for preview
  const upcomingQueue = rawQueue.slice(0, 3);

  // Format Recharts workload data
  const chartData = (workload?.weeklyStats || [
    { day: 'Mon', sessionsCount: 6, completedCount: 6 },
    { day: 'Tue', sessionsCount: 7, completedCount: 7 },
    { day: 'Wed', sessionsCount: 5, completedCount: 5 },
    { day: 'Thu', sessionsCount: 6, completedCount: 6 },
    { day: 'Fri', sessionsCount: 6, completedCount: 1 },
    { day: 'Sat', sessionsCount: 4, completedCount: 0 },
    { day: 'Sun', sessionsCount: 0, completedCount: 0 },
  ]).map((d) => ({
    ...d,
    completed: d.completedCount,
    remaining: Math.max(0, d.sessionsCount - d.completedCount),
  }));

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/95 backdrop-blur-md rounded-xl border border-ayur-sand shadow-md text-xs font-sans">
          <p className="font-serif font-bold text-gray-900 mb-1">{label} Duty Workload</p>
          <div className="flex flex-col gap-1">
            <span className="text-emerald-800 font-semibold">
              Completed: {payload[0]?.value} sessions
            </span>
            {payload[1] && (
              <span className="text-amber-800 font-semibold">
                Upcoming/Pending: {payload[1]?.value} sessions
              </span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Welcome & Availability Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-serif font-black text-gray-900 tracking-tight">
              Namaste, {profile?.name || 'Dr. Sandeep Kulkarni'}
            </h1>
            <Badge variant="ayur" size="sm">
              Therapist Portal
            </Badge>
          </div>
          <p className="text-xs text-ayur-green-mid font-medium">
            {profile?.assignedChamber || 'Chamber 2 (Swedana Shala)'} • {profile?.shiftHours || 'Morning & Mid Shift'}
          </p>
        </div>

        {/* Duty Availability Toggle Card */}
        <div className="flex items-center gap-3 bg-[#fbf9f5] p-2.5 rounded-2xl border border-ayur-sand/80">
          <div className="flex flex-col text-right">
            <span className="text-xs font-serif font-bold text-gray-900">
              {isTodayAvailable ? 'Duty Active' : 'Off-Duty / On Leave'}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {isTodayAvailable ? 'Accepting Patients' : 'Scheduling Paused'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTodayAvailability}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-serif transition-all shadow-xs cursor-pointer ${
              isTodayAvailable
                ? 'bg-ayur-primary text-white hover:bg-[#0c4434]'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {isTodayAvailable ? 'Mark Unavailable' : 'Mark Available'}
          </button>
        </div>
      </div>

      {/* Row 1: Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Sessions"
          value={stats.totalToday}
          context="Scheduled across all chambers"
          trend={{
            text: 'On Schedule',
            variant: 'info',
            icon: <Clock className="w-3 h-3" />,
          }}
          onClick={() => onNavigateTab('queue')}
        />

        <StatCard
          label="Completed Today"
          value={stats.completed}
          context="Telemetry & notes logged"
          trend={{
            text: '100% Punctual',
            variant: 'success',
            icon: <CheckCircle2 className="w-3 h-3" />,
          }}
          onClick={() => onNavigateTab('queue')}
        />

        <StatCard
          label="Pending / Upcoming"
          value={stats.pending}
          context="Ready for pre-flight validation"
          trend={{
            text: 'Active Day',
            variant: 'ayur',
            icon: <TrendingUp className="w-3 h-3" />,
          }}
          onClick={() => onNavigateTab('queue')}
        />

        <StatCard
          label="Active Alerts"
          value={stats.flagged}
          context="Flagged sessions / Doctor reviews"
          trend={{
            text: stats.flagged > 0 ? 'Requires Review' : 'Zero Flags',
            variant: stats.flagged > 0 ? 'danger' : 'success',
            icon: <AlertTriangle className="w-3 h-3" />,
          }}
          alertPill={
            stats.flagged > 0
              ? {
                  text: 'Complication flagged in Chamber 3',
                  linkLabel: 'View Alert',
                  onViewDetails: () => onNavigateTab('queue'),
                }
              : undefined
          }
          onClick={() => onNavigateTab('queue')}
        />
      </div>

      {/* Row 2: Today's Queue Preview + Weekly Workload Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Today's Queue Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card className="flex flex-col gap-4 border border-ayur-sand/80">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-serif font-black text-gray-900 text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ayur-primary" />
                  Today's Session Queue Preview
                </h3>
                <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                  Sequential timeline of your clinical therapy sessions today.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => onNavigateTab('queue')}
                className="text-xs font-serif"
              >
                Full Queue ({stats.totalToday})
              </Button>
            </div>

            {/* Preview List */}
            <div className="space-y-3">
              {upcomingQueue.map((session) => {
                const badge = getStatusBadgeConfig(session.status);

                return (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-ayur-green-mid/40 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center justify-center rounded-xl bg-white border border-ayur-sand/70 p-2 min-w-[4.5rem] shrink-0 text-center">
                        <span className="text-xs font-serif font-black text-ayur-primary">
                          {session.scheduledTime}
                        </span>
                        <span className="text-[9px] text-gray-500 font-bold">
                          {session.durationMinutes}m
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-gray-900 text-sm">
                            {session.patientName}
                          </span>
                          <Badge variant={badge.variant} size="sm">
                            {badge.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">
                          Day {session.dayNumber}/{session.totalDays}: {session.stageName}
                        </p>
                        <span className="text-[11px] text-gray-400">
                          {session.roomNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      {session.status === 'scheduled' && (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Play className="w-3.5 h-3.5" />}
                          onClick={() => onSelectSessionForStart(session)}
                        >
                          Start
                        </Button>
                      )}
                      {session.status === 'in_progress' && (
                        <Button
                          variant="ayur"
                          size="sm"
                          icon={<RotateCcw className="w-3.5 h-3.5" />}
                          onClick={() => onSelectSessionForActive(session)}
                        >
                          Resume
                        </Button>
                      )}
                      {session.status === 'completed' && (
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Done
                        </span>
                      )}
                      {session.status === 'flagged' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onNavigateTab('queue')}
                        >
                          Alert
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right 5 Cols: Weekly Workload Mini-Chart */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="flex flex-col gap-4 border border-ayur-sand/80 h-full justify-between">
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-black text-gray-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-ayur-primary" />
                  Weekly Workload
                </h3>
                <Badge variant="ayur" size="sm">
                  This Week
                </Badge>
              </div>
              <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                Sessions completed vs. pending target this week.
              </p>
            </div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5dec9" vertical={false} opacity={0.6} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 'bold' }}
                    tickLine={false}
                    axisLine={{ stroke: '#d6ceb8' }}
                  />
                  <YAxis
                    domain={[0, 8]}
                    ticks={[0, 2, 4, 6, 8]}
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }}
                    tickLine={false}
                    axisLine={{ stroke: '#d6ceb8' }}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="completed" name="Completed" fill="#1b3b2b" stackId="a" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="remaining" name="Pending" fill="#d97706" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Workload Metric Footnote */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
              <div className="bg-[#fbf9f5] p-2.5 rounded-xl border border-ayur-sand/60">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">
                  Avg Duration
                </span>
                <span className="font-serif font-bold text-ayur-primary text-sm mt-0.5 block">
                  {workload?.avgSessionDurationMinutes || 52} mins
                </span>
              </div>
              <div className="bg-[#fbf9f5] p-2.5 rounded-xl border border-ayur-sand/60">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">
                  No-Show Rate
                </span>
                <span className="font-serif font-bold text-emerald-800 text-sm mt-0.5 block">
                  {workload?.noShowRatePercent || 1.4}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
