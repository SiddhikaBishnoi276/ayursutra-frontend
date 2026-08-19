import { useState } from 'react';
import { 
    Calendar, 
    ArrowUpRight, 
    ArrowDownRight, 
    BarChart3, 
    TrendingUp, 
    Clock, 
    Award,
    Activity
} from 'lucide-react';
import { occupancyTrend, sessionVolumeTrend } from '../data/mockData';

export const AnalyticsTab = () => {
    const [dateRange, setDateRange] = useState('7d');

    // KPI stats calculations
    const averageOccupancy = 78;
    const averageSessions = 25;
    const noShowRate = 3.5;
    const performanceScore = 94;

    // Custom SVG Line Chart coordinates helper for Session Volume Trend
    // coordinates for: [18, 22, 15, 29, 25, 32, 28] (Min: 10, Max: 35)
    // Width: 500, Height: 150. X steps: 500/6 = 83.3.
    // Y formula: Height - ((Val - Min) / (Max - Min)) * Height
    const linePoints = [
        { x: 0 * 83.3, y: 150 - ((18 - 10) / 25) * 150 },
        { x: 1 * 83.3, y: 150 - ((22 - 10) / 25) * 150 },
        { x: 2 * 83.3, y: 150 - ((15 - 10) / 25) * 150 },
        { x: 3 * 83.3, y: 150 - ((29 - 10) / 25) * 150 },
        { x: 4 * 83.3, y: 150 - ((25 - 10) / 25) * 150 },
        { x: 5 * 83.3, y: 150 - ((32 - 10) / 25) * 150 },
        { x: 6 * 83.3, y: 150 - ((28 - 10) / 25) * 150 }
    ];

    const pathData = `M ${linePoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaData = `${pathData} L ${linePoints[linePoints.length - 1].x},150 L 0,150 Z`;

    return (
        <div className="flex flex-col gap-6">
            
            {/* Header with Date Select */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Clinic Performance Analytics</h2>
                    <p className="text-sm text-slate-500">Track Panchakarma room utilization efficiency, therapist occupancy, and therapy session throughput.</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">Date Range:</span>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-650 outline-none"
                    >
                        <option value="today">Today</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* KPI 1: Occupancy */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg. Chamber Occupancy</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-800">{averageOccupancy}%</h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-800">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            +4.2%
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">vs. 73.8% last week</p>
                </div>

                {/* KPI 2: Sessions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Session Volume</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-800">{averageSessions} Avg</h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-800">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            +1.5
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">28 volumes processed today</p>
                </div>

                {/* KPI 3: No-Show Rate */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">No-Show Rate</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-800">{noShowRate}%</h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-800">
                            <ArrowDownRight className="h-3.5 w-3.5" />
                            -1.2%
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Better patient reminder delivery</p>
                </div>

                {/* KPI 4: Quality Score */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinic Quality Score</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-800">{performanceScore}/100</h3>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-800">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            +2.0
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Based on audit checks & reviews</p>
                </div>

            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                {/* Chart 1: Volume Trend (8 Cols) */}
                <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-800" />
                                Therapy Session Throughput (Last 7 Days)
                            </h3>
                            <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Total count of poorva, pradhana, and paschat procedures completed</p>
                        </div>
                    </div>

                    {/* SVG Line/Area Chart */}
                    <div className="relative mt-4 h-48 w-full">
                        <svg className="h-full w-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#133E2B" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#133E2B" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Grid Lines */}
                            <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="1.5" />

                            {/* Area under curve */}
                            <path d={areaData} fill="url(#chart-area-grad)" />

                            {/* Line path */}
                            <path d={pathData} fill="none" stroke="#133E2B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Data points */}
                            {linePoints.map((p, idx) => (
                                <circle 
                                    key={idx} 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r="5.5" 
                                    fill="#C26D45" 
                                    stroke="#white" 
                                    strokeWidth="2.5" 
                                    className="cursor-pointer hover:r-7 transition-all duration-150"
                                />
                            ))}
                        </svg>

                        {/* X-Axis labels */}
                        <div className="mt-3 flex justify-between px-1 text-[10px] font-bold text-slate-400 font-mono">
                            {sessionVolumeTrend.map((t, idx) => (
                                <span key={idx}>{t.date}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart 2: Performance Donut Gauge (4 Cols) */}
                <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2">
                            <Award className="h-5 w-5 text-amber-600" />
                            Quality Index
                        </h3>
                        <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Clinic Performance KPI score</p>
                    </div>

                    {/* SVG Donut Circle */}
                    <div className="flex flex-col items-center justify-center py-4 relative">
                        <svg className="h-36 w-36 overflow-visible" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                            {/* Active stroke (StrokeDasharray = 2 * PI * r = 251.2. 94% = 236.1) */}
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke="#133E2B" 
                                strokeWidth="10" 
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 - (performanceScore / 100) * 251.2}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                            />
                        </svg>

                        {/* Label in center */}
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-800">{performanceScore}%</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Excellent</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-50 pt-3 text-center">
                        <p className="text-xs font-semibold text-slate-500">
                            AYUSH clinical guidelines audit score is at peak!
                        </p>
                    </div>
                </div>

            </div>

            {/* Room Occupancy Bar Chart Detail */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs flex flex-col gap-4">
                <div>
                    <h3 className="text-base font-bold text-slate-850 tracking-tight flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-800" />
                        Chamber Occupancy Analysis (Last 7 Days)
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Average hourly occupancy rate per chamber type</p>
                </div>

                {/* SVG Bar Chart */}
                <div className="relative mt-2 flex flex-col gap-3.5">
                    {occupancyTrend.map((data, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-xs font-semibold">
                            <span className="w-16 font-mono text-slate-400 font-bold">{data.date}</span>
                            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden relative">
                                <div 
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-emerald-950 transition-all duration-500" 
                                    style={{ width: `${data.rate}%` }}
                                />
                            </div>
                            <span className="w-10 text-right font-mono font-bold text-slate-700">{data.rate}%</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};
