import React from 'react';
import { TrendingUp, Leaf, Heart } from 'lucide-react';

interface StatCardProps {
  type: 'appointments' | 'therapies' | 'satisfaction';
}

const STAT_DATA = {
  appointments: {
    label: "Today's Appointments",
    value: '128',
    subtext: '+12% vs yesterday',
    subtextColor: 'text-emerald-600',
    icon: <TrendingUp size={18} className="text-emerald-500" />,
    showStars: false,
  },
  therapies: {
    label: 'Active Therapies',
    value: '64',
    subtext: 'Ongoing',
    subtextColor: 'text-[#667064]',
    icon: <Leaf size={18} className="text-[#3F913F]" />,
    showStars: false,
  },
  satisfaction: {
    label: 'Patient Satisfaction',
    value: '4.9/5',
    subtext: '',
    subtextColor: '',
    icon: <Heart size={18} className="text-purple-400 fill-purple-300" />,
    showStars: true,
  },
};

export const StatCard: React.FC<StatCardProps> = ({ type }) => {
  const data = STAT_DATA[type];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E1E4DA] px-4 py-3.5 min-w-[190px] flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-[#667064] uppercase tracking-wide">
          {data.label}
        </span>
        <div className="flex-shrink-0">{data.icon}</div>
      </div>

      {/* Value */}
      <div
        className="text-2xl font-bold text-[#033015] leading-none"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {data.value}
      </div>

      {/* Subtext or Stars */}
      {data.showStars ? (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.784.57-1.838-.197-1.539-1.118l1.285-3.957a1 1 0 00-.363-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
            </svg>
          ))}
        </div>
      ) : (
        <span className={`text-[12px] font-medium ${data.subtextColor}`}>
          {data.subtext}
        </span>
      )}
    </div>
  );
};
