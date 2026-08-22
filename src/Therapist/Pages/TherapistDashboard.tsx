// src/Therapist/Pages/TherapistDashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  ArrowRight,
  BarChart3,
  RotateCcw,
  UserCheck,
  CalendarCheck,
  Activity,
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
  onNavigateTab?: (tab: string) => void;
  onSelectSessionForStart?: (session: TherapistSession) => void;
  onSelectSessionForActive?: (session: TherapistSession) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({
  onNavigateTab,
  onSelectSessionForStart,
  onSelectSessionForActive,
}) => {
  const navigate = useNavigate();
  const { rawQueue, stats } = useSessionQueue();
  const {
    isTodayAvailable,
    toggleTodayAvailability,
    workload,
    profile,
  } = useAvailability();

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      navigate(`/therapist/${tab}`);
    }
  };

  const handleStartSession = (session: TherapistSession) => {
    if (onSelectSessionForStart) {
      onSelectSessionForStart(session);
    } else {
      navigate(`/therapist/session/${session.id}/start`);
    }
  };

  const handleActiveSession = (session: TherapistSession) => {
    if (onSelectSessionForActive) {
      onSelectSessionForActive(session);
    } else {
      navigate(`/therapist/session/${session.id}/active`);
    }
  };

  // Next 3-4 scheduled or in-progress sessions for preview
  const upcomingQueue = rawQueue.slice(0, 4);

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
        <div className="p-3 bg-white rounded-xl border border-ayur-sand/80 shadow-md text-xs font-sans">
          <p className="font-serif font-bold text-gray-900 mb-1.5">{label} Sessions</p>
          <div className="flex flex-col gap-1">
            <span className="text-ayur-primary font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ayur-primary" />
              Completed: {payload[0]?.value}
            </span>
            {payload[1] && (
              <span className="text-amber-800 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                Remaining: {payload[1]?.value}
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
      {/* ── Section A: Greeting Header + Live Date & Availability Pill ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 font-serif tracking-tight">
              Namaste, {profile?.name || localStorage.getItem('name') || 'Therapist'}
            </h1>
            <Badge variant="ayur" size="sm">
              Therapist Portal
            </Badge>
          </div>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            {profile?.assignedChamber || 'Droni Suite 1'} • {profile?.shiftHours || 'Morning & Mid Shift'}
          </p>
        </div>

        {/* Section 4: Quick Availability Toggle Switch */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-white border border-ayur-sand/80 p-2 sm:px-4 sm:py-2 rounded-2xl shadow-2xs">
          <div className="flex flex-col text-left sm:text-right">
            <span className="text-xs font-serif font-bold text-gray-900 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isTodayAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'
                }`}
              />
              {isTodayAvailable ? 'Duty Active' : 'Off-Duty (On Leave)'}
            </span>
            <span className="text-[10px] text-gray-500 font-medium hidden sm:inline">
              {isTodayAvailable ? 'Accepting Patients' : 'Scheduling Paused'}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTodayAvailability}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-serif transition-all shadow-xs cursor-pointer ${
              isTodayAvailable
                ? 'bg-ayur-primary text-white hover:opacity-90'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {isTodayAvailable ? 'Set Off Duty' : 'Set On Duty'}
          </button>
        </div>
      </div>

      {/* ── Section B: 4 StatCards Grid (Exact visual weight as Admin/Doctor) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <StatCard
          label="Today's Sessions"
          value={`${stats.totalToday} Sessions`}
          context={`${stats.completed} completed, ${stats.pending} remaining`}
          trend={{
            text: 'On Track',
            variant: 'info',
            icon: <Clock className="w-3 h-3 text-ayur-green-mid" />,
          }}
          onClick={() => handleNavigate('queue')}
        />

        <StatCard
          label="Completed Today"
          value={`${stats.completed} Completed`}
          context="Telemetry & procedure logs saved"
          trend={{
            text: '100% Punctual',
            variant: 'success',
            icon: <CheckCircle2 className="w-3 h-3 text-emerald-700" />,
          }}
          onClick={() => handleNavigate('queue')}
        />

        <StatCard
          label="Flagged / Pending"
          value={stats.flagged > 0 ? `${stats.flagged} Alert` : '0 Alerts'}
          context={
            stats.flagged > 0
              ? 'Meera Joshi (Chamber 3) flagged'
              : 'Zero complications recorded today'
          }
          trend={{
            text: stats.flagged > 0 ? 'Requires Review' : 'Healthy',
            variant: stats.flagged > 0 ? 'danger' : 'success',
            icon: <AlertTriangle className="w-3 h-3" />,
          }}
          alertPill={
            stats.flagged > 0
              ? {
                  text: 'Doctor review pending in Chamber 3',
                  linkLabel: 'View Alert',
                  onViewDetails: () => handleNavigate('queue'),
                }
              : undefined
          }
          onClick={() => handleNavigate('queue')}
        />

        <StatCard
          label="Duty Availability"
          value={isTodayAvailable ? 'Available' : 'On Leave'}
          context={
            isTodayAvailable
              ? 'Chamber 2 open for Scheduling Engine'
              : 'Marked unavailable for bookings'
          }
          trend={{
            text: isTodayAvailable ? 'Active Shift' : 'Leave Blocked',
            variant: isTodayAvailable ? 'ayur' : 'warning',
            icon: <UserCheck className="w-3 h-3 text-ayur-brown" />,
          }}
          onClick={() => handleNavigate('availability')}
        />
      </div>

      {/* ── Quick Workflow Action Bubbles (Therapist amber-tinted theme) ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
          Therapist Clinical Workflows
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => handleNavigate('queue')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold font-serif text-gray-900 truncate">Today's Session Queue</h4>
              <p className="text-[10px] text-gray-500 font-medium truncate">{stats.totalToday} Scheduled Today</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              const sched = rawQueue.find((s) => s.status === 'scheduled');
              if (sched) handleStartSession(sched);
              else handleNavigate('queue');
            }}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Play className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold font-serif text-gray-900 truncate">Pre-Flight Checklist</h4>
              <p className="text-[10px] text-gray-500 font-medium truncate">Verify Chamber & Stocks</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              const inProg = rawQueue.find((s) => s.status === 'in_progress' || s.status === 'paused_emergency');
              if (inProg) handleActiveSession(inProg);
              else handleNavigate('queue');
            }}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold font-serif text-gray-900 truncate">Active Heartbeat Timer</h4>
              <p className="text-[10px] text-gray-500 font-medium truncate">Live Session Workspace</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('availability')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold font-serif text-gray-900 truncate">Duty & Availability</h4>
              <p className="text-[10px] text-gray-500 font-medium truncate">Calendar & Leave Blocks</p>
            </div>
          </button>
        </div>
      </div>

      {/* ── Section C & D: Today's Queue Preview + Weekly Workload Mini-Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Section 2 - Today's Queue Preview Card */}
        <div className="lg:col-span-7">
          <Card className="flex flex-col gap-4 border border-ayur-sand/80 h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <div>
                  <h3 className="font-serif font-black text-gray-900 text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ayur-primary" />
                    Today's Session Queue Preview
                  </h3>
                  <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                    Sequential clinical appointments assigned to your chamber today.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  onClick={() => handleNavigate('queue')}
                  className="text-xs font-serif"
                >
                  View All ({stats.totalToday})
                </Button>
              </div>

              {/* Preview Rows */}
              <div className="divide-y divide-gray-100 text-xs">
                {upcomingQueue.map((session) => {
                  const badge = getStatusBadgeConfig(session.status);

                  return (
                    <div
                      key={session.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fbf9f5]/60 transition px-2 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center justify-center rounded-xl bg-[#fbf9f5] border border-ayur-sand/70 p-2 min-w-[4.5rem] shrink-0 text-center">
                          <span className="text-xs font-serif font-black text-ayur-primary">
                            {session.scheduledTime}
                          </span>
                          <span className="text-[9px] text-gray-500 font-bold">
                            {session.durationMinutes}m
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif font-bold text-gray-900 text-sm">
                              {session.patientName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                session.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : session.status === 'in_progress'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                                  : session.status === 'flagged' || session.status === 'paused_emergency'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium mt-0.5">
                            Day {session.dayNumber}/{session.totalDays}: {session.stageName} •{' '}
                            <span className="text-ayur-primary font-semibold">{session.roomNumber}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end shrink-0">
                        {session.status === 'scheduled' && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Play className="w-3 h-3" />}
                            onClick={() => handleStartSession(session)}
                          >
                            Start
                          </Button>
                        )}
                        {session.status === 'in_progress' && (
                          <Button
                            variant="ayur"
                            size="sm"
                            icon={<RotateCcw className="w-3 h-3" />}
                            onClick={() => handleActiveSession(session)}
                          >
                            Resume
                          </Button>
                        )}
                        {session.status === 'completed' && (
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Completed
                          </span>
                        )}
                        {(session.status === 'flagged' || session.status === 'paused_emergency') && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleNavigate('queue')}
                          >
                            View Alert
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Chamber Allocation: Auto-assigned</span>
              <span className="text-ayur-primary font-bold">AYUSH Standard Protocol</span>
            </div>
          </Card>
        </div>

        {/* Right 5 Cols: Section 3 - Weekly Workload Chart */}
        <div className="lg:col-span-5">
          <Card className="flex flex-col gap-4 border border-ayur-sand/80 h-full justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                <div>
                  <h3 className="font-serif font-black text-gray-900 text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-ayur-primary" />
                    Weekly Workload
                  </h3>
                  <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                    Sessions completed vs. pending target this week.
                  </p>
                </div>
                <Badge variant="ayur" size="sm">
                  This Week
                </Badge>
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
            </div>

            {/* Workload Metrics Strip */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
              <div className="bg-[#fbf9f5] p-2.5 rounded-xl border border-ayur-sand/60">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">
                  Avg Duration
                </span>
                <span className="font-serif font-black text-ayur-primary text-sm mt-0.5 block">
                  {workload?.avgSessionDurationMinutes || 52} mins
                </span>
              </div>
              <div className="bg-[#fbf9f5] p-2.5 rounded-xl border border-ayur-sand/60">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">
                  No-Show Rate
                </span>
                <span className="font-serif font-black text-emerald-800 text-sm mt-0.5 block">
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
