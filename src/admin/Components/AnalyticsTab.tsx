import React, { useState } from 'react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { StatCard } from '../../Common/Components/StatCard';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';

interface AnalyticsTabProps {
  stats?: {
    averageOccupancy?: number;
    dailySessionVolume?: number;
    noShowRate?: number;
    performanceScore?: number;
    sessionTrend?: number[];
  };
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ stats }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const avgOccupancy = stats?.averageOccupancy || 78;
  const sessionVolume = stats?.dailySessionVolume || 28;
  const noShowRate = stats?.noShowRate || 3.5;
  const performanceScore = stats?.performanceScore || 94;

  const weeklyData = [
    { day: 'Mon', count: 18, label: '18 sessions' },
    { day: 'Tue', count: 22, label: '22 sessions' },
    { day: 'Wed', count: 15, label: '15 sessions' },
    { day: 'Thu', count: 29, label: '29 sessions' },
    { day: 'Fri', count: 25, label: '25 sessions' },
    { day: 'Sat', count: 32, label: '32 sessions' },
    { day: 'Sun', count: 28, label: '28 sessions' },
  ];

  const maxVal = Math.max(...weeklyData.map((d) => d.count), 35);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 font-serif tracking-tight">
            Clinic-Wide Analytics & Intelligence
          </h1>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Evaluate Panchakarma room utilization, procedure throughput, and clinic operations health.
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-1.5 bg-white border border-ayur-sand/80 p-1 rounded-full shadow-2xs self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((rng) => (
            <button
              key={rng}
              type="button"
              onClick={() => setTimeRange(rng)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                timeRange === rng
                  ? 'bg-ayur-primary text-white shadow-2xs'
                  : 'text-gray-600 hover:text-ayur-primary'
              }`}
            >
              {rng === '7d' ? 'Last 7 Days' : rng === '30d' ? 'Last 30 Days' : 'Last Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <StatCard
          label="Chamber Occupancy"
          value={`${avgOccupancy}%`}
          context="vs. 73.8% target baseline"
          trend={{ text: '+4.2%', variant: 'success' }}
        />

        <StatCard
          label="Daily Session Volume"
          value={`${sessionVolume} Avg`}
          context="28 total sessions logged today"
          trend={{ text: '+1.5 vs avg', variant: 'success' }}
        />

        <StatCard
          label="No-Show Rate"
          value={`${noShowRate}%`}
          context="Patient adherence rate at 96.5%"
          trend={{ text: '-1.2% reduction', variant: 'info' }}
        />

        <StatCard
          label="Clinical Performance"
          value={`${performanceScore}/100`}
          context="AYUSH quality compliance score"
          trend={{ text: 'Excellent', variant: 'ayur' }}
        />
      </div>

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Session Volume SVG Chart (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-ayur-primary" />
                    Panchakarma Daily Volume Throughput
                  </h3>
                  <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                    Completed and scheduled treatment procedure sessions.
                  </p>
                </div>
                <Badge variant="ayur" size="sm">
                  Weekly Trend
                </Badge>
              </div>

              {/* Clean SVG Bar Chart */}
              <div className="pt-4 pb-2">
                <div className="h-48 flex items-end justify-between gap-3 px-2">
                  {weeklyData.map((item, idx) => {
                    const heightPercent = Math.round((item.count / maxVal) * 100);
                    const isToday = idx === weeklyData.length - 1;
                    return (
                      <div
                        key={item.day}
                        className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                      >
                        <div className="text-[11px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.count}
                        </div>
                        <div className="w-full max-w-[40px] bg-[#f4f7f4] rounded-t-lg overflow-hidden flex items-end h-full">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-t-lg transition-all duration-500 ${
                              isToday
                                ? 'bg-ayur-primary shadow-xs'
                                : 'bg-ayur-green-mid/70 group-hover:bg-ayur-primary'
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-semibold mt-1 ${
                            isToday ? 'text-ayur-primary font-bold' : 'text-gray-500'
                          }`}
                        >
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Peak Day: Saturday (32 sessions)</span>
              <span className="font-bold text-ayur-primary">Total: 169 procedures</span>
            </div>
          </Card>
        </div>

        {/* Therapy Mix Breakdown (4 cols) */}
        <div className="lg:col-span-4">
          <Card className="flex flex-col justify-between h-full">
            <div>
              <div className="border-b border-gray-100 pb-4 mb-5">
                <h3 className="text-base font-bold text-gray-900 font-serif flex items-center gap-2">
                  <Award className="w-5 h-5 text-ayur-brown" />
                  Therapy Category Share
                </h3>
                <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                  Breakdown by prescribed Panchakarma procedures.
                </p>
              </div>

              <div className="flex flex-col gap-3.5">
                {[
                  { name: 'Abhyanga & Swedana', percentage: 42, count: '71 sessions', color: 'bg-ayur-primary' },
                  { name: 'Basti Karma (Enemas)', percentage: 28, count: '48 sessions', color: 'bg-ayur-green-mid' },
                  { name: 'Shirodhara Protocols', percentage: 18, count: '30 sessions', color: 'bg-ayur-brown' },
                  { name: 'Nasya & Vamana', percentage: 12, count: '20 sessions', color: 'bg-[#9cb48c]' },
                ].map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-800 font-serif">{cat.name}</span>
                      <span className="text-gray-500">{cat.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#f4f7f4] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${cat.percentage}%` }}
                        className={`h-full rounded-full ${cat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Updated automatically</span>
              <span className="font-bold text-ayur-primary">100% Verified</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
