import React from 'react';
import { ShieldCheck, BarChart3, Flower2, Globe } from 'lucide-react';

const BADGES = [
  {
    icon: <ShieldCheck size={26} className="text-[#033015]" />,
    title: 'Secure & Confidential',
    subtitle: 'Your data is safe',
  },
  {
    icon: <BarChart3 size={26} className="text-[#033015]" />,
    title: 'Evidence Based',
    subtitle: 'Data-driven insights',
  },
  {
    icon: <Flower2 size={26} className="text-[#3F913F]" />,
    title: 'Ayurveda Centric',
    subtitle: 'Rooted in tradition',
  },
  {
    icon: <Globe size={26} className="text-[#033015]" />,
    title: 'Accessible Anywhere',
    subtitle: 'Anytime, Anywhere',
  },
];

export const FeatureBadges: React.FC = () => {
  return (
    <section className="bg-[#FDFDFA] border-t border-[#E1E4DA] py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 group"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#E9EBDD] flex items-center justify-center transition-colors duration-200 group-hover:bg-[#033015] group-hover:[&>*]:text-white">
                {badge.icon}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#30352F]">
                  {badge.title}
                </p>
                <p className="text-[11px] text-[#667064]">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
