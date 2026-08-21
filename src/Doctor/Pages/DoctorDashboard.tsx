// src/Doctor/Pages/DoctorDashboard.tsx
import React from 'react';
import { StatCard } from '../../Common/Components/StatCard';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { ActionCard } from '../../Common/Components/ActionCard';
import {
  Users,
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Sparkles,
  Layers,
  Apple,
  BarChart3,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export interface DoctorDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigateTab }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
              Doctor Clinical Workspace
            </h1>
            <Badge variant="ayur" size="sm">
              AyurSutra Panchakarma Suite
            </Badge>
          </div>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Real-time patient intake, Prakriti evaluation, protocol design, and clinical telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="primary"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={() => onNavigateTab('patients')}
          >
            Onboard Patient
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <StatCard
          label="Total Active Patients"
          value="42"
          context="Under active Panchakarma care"
          trend={{ text: '+12% this month', variant: 'success' }}
        />

        <StatCard
          label="Today's Procedures"
          value="18"
          context="Scheduled across 6 therapy suites"
          trend={{ text: '8 Completed', variant: 'info' }}
        />

        <StatCard
          label="Complication Alerts"
          value="1"
          context="Meera Joshi (PAT-103) flagged"
          trend={{ text: 'Action Required', variant: 'danger' }}
        />

        <StatCard
          label="Therapy Adherence Rate"
          value="96.8%"
          context="Diet & session attendance"
          trend={{ text: 'Optimal', variant: 'ayur' }}
        />
      </div>

      {/* Quick Clinical Actions Row */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-700 font-serif">
          Quick Clinical Workflows
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('patients')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex flex-col gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-ayur-primary flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-serif text-gray-900">My Patients</h4>
              <p className="text-[10px] text-gray-500 font-medium">Directory & Actions</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('prakriti')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex flex-col gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-serif text-gray-900">Assess Prakriti</h4>
              <p className="text-[10px] text-gray-500 font-medium">10-Point Evaluation</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('plan-builder')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex flex-col gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-serif text-gray-900">Protocols & Plans</h4>
              <p className="text-[10px] text-gray-500 font-medium">Author & Schedule</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('plan-builder')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex flex-col gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-serif text-gray-900">Plan Builder</h4>
              <p className="text-[10px] text-gray-500 font-medium">Schedule & Assign</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('ai-diet')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex flex-col gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition">
              <Apple className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-serif text-gray-900">AI Diet & Yoga</h4>
              <p className="text-[10px] text-gray-500 font-medium">Review & Dispatch</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('analytics')}
            className="p-3.5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs hover:border-ayur-primary hover:shadow-xs transition text-left flex flex-col gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-serif text-gray-900">Progress Telemetry</h4>
              <p className="text-[10px] text-gray-500 font-medium">Dual VAS Trends</p>
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Today's Schedule + Clinical Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Procedures */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold font-serif text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-ayur-primary" />
              Today's Scheduled Panchakarma Procedures
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">18 Sessions Today</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {[
              {
                time: '08:30 AM',
                patient: 'Rahul Verma (PAT-101)',
                room: 'Suite 2 (Swedana)',
                therapist: 'Dr. Sandeep Kulkarni',
                therapy: 'Kati Basti & Nadi Swedana',
                status: 'In Progress',
                statusVariant: 'amber',
              },
              {
                time: '10:00 AM',
                patient: 'Ananya Sen (PAT-102)',
                room: 'Suite 1 (Snehan)',
                therapist: 'Therapist Lakshmi Menon',
                therapy: 'Mahatiktaka Ghritha Snehapana',
                status: 'Completed',
                statusVariant: 'emerald',
              },
              {
                time: '11:30 AM',
                patient: 'Meera Joshi (PAT-103)',
                room: 'Suite 4 (Basti)',
                therapist: 'Therapist Arjun Nair',
                therapy: 'Janu Basti & Patra Pinda Sweda',
                status: 'Flagged (Review)',
                statusVariant: 'rose',
              },
              {
                time: '02:00 PM',
                patient: 'Kavita Nair (PAT-106)',
                room: 'Suite 3 (Shirodhara)',
                therapist: 'Therapist Deepa R.',
                therapy: 'Ksheerabala Shirodhara & Nasya',
                status: 'Upcoming',
                statusVariant: 'gray',
              },
            ].map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-gray-900 w-16 shrink-0">{item.time}</span>
                  <div>
                    <h5 className="font-bold text-gray-900 font-serif">{item.patient}</h5>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {item.therapy} • <span className="text-ayur-primary">{item.room}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-600 hidden sm:inline">
                    {item.therapist}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.statusVariant === 'emerald'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : item.statusVariant === 'amber'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : item.statusVariant === 'rose'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Clinical Activity Feed */}
        <div className="p-5 rounded-2xl bg-white border border-ayur-sand/80 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold font-serif text-gray-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-ayur-primary" />
              Clinical Activity Feed
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Live sync</span>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {[
              {
                time: '10 mins ago',
                title: 'VAS Pain Score Dropped to 2.5',
                desc: 'Rahul Verma (PAT-101) logged Day 4 improvement post Kati Basti.',
                icon: Activity,
                color: 'text-emerald-700 bg-emerald-50',
              },
              {
                time: '25 mins ago',
                title: 'Complication Flagged by Therapist',
                desc: 'Arjun Nair logged mild skin erythema for Meera Joshi (PAT-103).',
                icon: AlertTriangle,
                color: 'text-rose-700 bg-rose-50',
              },
              {
                time: '1 hour ago',
                title: 'Prakriti Locked: Pitta-Vata',
                desc: 'Ananya Sen completed 10-point constitution evaluation.',
                icon: Sparkles,
                color: 'text-amber-700 bg-amber-50',
              },
              {
                time: '2 hours ago',
                title: 'AI Diet Plan Approved & Emailed',
                desc: 'Dispatched to kavita.nair@example.com with SMS PIN.',
                icon: CheckCircle2,
                color: 'text-teal-700 bg-teal-50',
              },
            ].map((feed, idx) => {
              const Icon = feed.icon;
              return (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#fbf9f5] border border-ayur-sand/70">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${feed.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-gray-900 font-serif text-xs">{feed.title}</h5>
                      <span className="text-[9px] text-gray-400">{feed.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 font-medium mt-0.5 leading-snug">{feed.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
