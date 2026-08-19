import { useState } from 'react';
import { ActivityLog, StaffMember, Room } from '../types/admin.types';
import { 
    Users, 
    FileSpreadsheet, 
    BedDouble, 
    TrendingUp, 
    AlertCircle, 
    CalendarCheck, 
    Clock, 
    ArrowRight,
    Sparkles,
    X
} from 'lucide-react';

interface DashboardTabProps {
    staff: StaffMember[];
    rooms: Room[];
    activities: ActivityLog[];
    onTabChange: (tab: string) => void;
}

export const DashboardTab = ({ staff, rooms, activities, onTabChange }: DashboardTabProps) => {
    const [judgesPanelExpanded, setJudgesPanelExpanded] = useState(false);
    
    // Stats calculation
    const activeStaff = staff.filter(s => s.status === 'Active').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const roomOccupancyRate = Math.round((occupiedRooms / rooms.length) * 100);

    const quickCards = [
        {
            title: 'Staff Management',
            description: 'Onboard doctors & therapists, audit medical credentials, and toggle status.',
            count: `${activeStaff} Active Staff`,
            actionLabel: 'Manage Directory',
            icon: Users,
            color: 'border-emerald-900/10 hover:border-emerald-900 bg-emerald-50/10',
            iconColor: 'text-emerald-900 bg-emerald-50',
            tabId: 'staff'
        },
        {
            title: 'Therapy Protocols',
            description: 'Configure standard multi-stage blueprints for Virechana, enemas, and cleansing.',
            count: '3 Active Blueprints',
            actionLabel: 'Open Protocol Builder',
            icon: FileSpreadsheet,
            color: 'border-amber-900/10 hover:border-amber-900 bg-amber-50/10',
            iconColor: 'text-amber-800 bg-amber-50',
            tabId: 'packages'
        },
        {
            title: 'Chambers & Equipment',
            description: 'Monitor wooden Droni beds, steam cabinets, and toggle maintenance cycles.',
            count: `${rooms.filter(r => r.status === 'Available').length} Rooms Available`,
            actionLabel: 'Inspect Rooms',
            icon: BedDouble,
            color: 'border-slate-200 hover:border-slate-400 bg-slate-50/30',
            iconColor: 'text-slate-650 bg-slate-100',
            tabId: 'rooms'
        }
    ];

    return (
        <div className="flex flex-col gap-6">
            
            {/* Greeting & Date Header */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Welcome Back, Ops Director
                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">Here is the active operational health summary for AyurSutra Hospital today.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Wednesday, August 19, 2026
                </div>
            </div>

            {/* At-a-glance Clinic Health Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* Stat 1: Today's Volume */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Sessions</p>
                            <h3 className="mt-1 text-2xl font-black text-slate-800">28 Volumes</h3>
                        </div>
                        <span className="flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-100">
                            <TrendingUp className="h-3 w-3" />
                            +12%
                        </span>
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-slate-400">18 completed, 10 scheduled remaining</p>
                </div>

                {/* Stat 2: Active Staff */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Staff</p>
                            <h3 className="mt-1 text-2xl font-black text-slate-800">{activeStaff} On-Duty</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            100% Active
                        </span>
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-slate-400">1 Doctor, 3 Therapists active now</p>
                </div>

                {/* Stat 3: Room Occupancy */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chamber Occupancy</p>
                            <h3 className="mt-1 text-2xl font-black text-slate-800">{roomOccupancyRate}% Cap</h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            roomOccupancyRate > 75 
                                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                            Peak Hour
                        </span>
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-slate-400">3 chambers currently active, 1 out</p>
                </div>

                {/* Stat 4: Pending Alerts */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Operations Alerts</p>
                            <h3 className="mt-1 text-2xl font-black text-red-750">2 Critical</h3>
                        </div>
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-700 animate-pulse">
                            <AlertCircle className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-3 text-[11px] font-medium text-red-700 bg-red-50 border border-red-200/50 px-2.5 py-1 rounded-lg">
                        1 complication, 1 SMS delivery failure
                    </p>
                </div>

            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {quickCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div 
                            key={idx}
                            onClick={() => onTabChange(card.tabId)} 
                            className={`rounded-2xl border p-5 shadow-2xs transition duration-300 cursor-pointer flex flex-col justify-between gap-5 group ${card.color}`}
                        >
                            <div className="flex flex-col gap-3">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                                    <Icon className="h-5.5 w-5.5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-emerald-950 transition">{card.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{card.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs">
                                <span className="font-bold text-slate-500">{card.count}</span>
                                <span className="flex items-center gap-1 font-bold text-emerald-900 group-hover:translate-x-1 transition-transform">
                                    {card.actionLabel}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Operations Activity Log & Quick Action Banner */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* Operations Activity Feed (8 cols) */}
                <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-850 tracking-tight flex items-center gap-2">
                            <CalendarCheck className="h-5 w-5 text-emerald-800" />
                            Clinical Activity & Operations Feed
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time status updates across Doctors, Therapists, and Room assignments.</p>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                        {activities.map((log) => {
                            let severityBadge = '';
                            if (log.severity === 'critical') severityBadge = 'bg-red-50 text-red-800 border-red-200/50';
                            else if (log.severity === 'warning') severityBadge = 'bg-amber-50 text-amber-800 border-amber-200/50';
                            else severityBadge = 'bg-slate-100 text-slate-600 border-slate-200/30';

                            return (
                                <div key={log.id} className="py-4.5 flex items-start gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 mt-0.5 ${severityBadge}`}>
                                        {log.severity}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 leading-snug">
                                            {log.action}
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400 font-medium">
                                            <span className="font-semibold text-slate-500">{log.user} ({log.role})</span>
                                            <span>•</span>
                                            <span>{log.time}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Info Block (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    
                    {/* Collapsible Judges Panel */}
                    {!judgesPanelExpanded ? (
                        <button 
                            onClick={() => setJudgesPanelExpanded(true)}
                            title="Expand judges guidelines panel"
                            className="w-full text-left rounded-2xl border border-emerald-900/10 bg-emerald-900 p-4 text-white shadow-sm flex items-center justify-between hover:bg-emerald-950 transition focus:outline-none focus:ring-2 focus:ring-emerald-800"
                        >
                            <span className="text-xs font-bold flex items-center gap-2">
                                <span>ℹ️</span> For the Judges — tap to expand
                            </span>
                            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Expand</span>
                        </button>
                    ) : (
                        <div className="rounded-2xl border border-emerald-900/10 bg-emerald-900 p-5 text-white shadow-sm flex flex-col gap-3 relative animate-in fade-in duration-200">
                            <button 
                                onClick={() => setJudgesPanelExpanded(false)}
                                className="absolute top-4 right-4 text-emerald-200 hover:text-white transition"
                                title="Collapse Judges Panel"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                            <div className="flex flex-col gap-1">
                                <h4 className="font-bold text-amber-300 text-[10px] tracking-wider uppercase">For the Judges</h4>
                                <h3 className="font-extrabold text-sm leading-snug">AyurSutra Operations Hub</h3>
                            </div>
                            <div className="text-xs leading-relaxed text-emerald-100/90 font-medium flex flex-col gap-3 mt-1">
                                <p>
                                    <strong className="text-amber-200 block text-[10px] uppercase tracking-wider mb-0.5">What this solves</strong>
                                    Coordinates gender-matched therapist assignment, multi-stage protocol tracking, chamber/equipment status, and Prakriti assessments in one system.
                                </p>
                                <p>
                                    <strong className="text-amber-200 block text-[10px] uppercase tracking-wider mb-0.5">How to explore</strong>
                                    Use the sidebar to try credential onboarding, protocol building, room maintenance flows, and delivery-retry logs.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Quick System Integrity Status */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col gap-3.5">
                        <h4 className="font-bold text-slate-800 text-sm">System Health</h4>
                        <div className="flex flex-col gap-2.5 text-xs font-semibold">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Database Connection</span>
                                <span className="text-emerald-700">✓ Healthy</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">SMS/WhatsApp Gateway</span>
                                <span className="text-amber-800">⚠️ 2 Failed Items</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">Credential Tokens</span>
                                <span className="text-emerald-700">Active</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};
