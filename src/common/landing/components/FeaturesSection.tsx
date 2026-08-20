import React from 'react';
import {
  CalendarDays,
  Users,
  Utensils,
  HeartPulse,
  Bell,
  MessageSquareShare
} from 'lucide-react';

const FEATURES = [
  {
    id: 'smart-scheduling',
    title: 'Smart Scheduling',
    description: 'Automated scheduling for therapies and appointments.',
    icon: <CalendarDays size={28} className="text-white" />,
    iconBg: '#15803d', // Green
    cardBg: '#FCFBF5', // Cream/Yellow white
  },
  {
    id: 'history-track',
    title: 'Patients History Track',
    description: 'Track patient history, therapies, progress and outcomes.',
    icon: <Users size={28} className="text-white" />,
    iconBg: '#1d4ed8', // Blue
    cardBg: '#F5F8FC', // Sky white
  },
  {
    id: 'ai-diet',
    title: 'AI Diet Plan',
    description: 'AI powered personalized diet plans for faster recovery.',
    icon: <Utensils size={28} className="text-white" />,
    iconBg: '#ea580c', // Orange
    cardBg: '#FCFBF5', // Cream/Yellow white
  },
  {
    id: 'pre-post-care',
    title: 'Pre & Post Care',
    description: 'Guidelines and care plans before and after Panchakarma.',
    icon: <HeartPulse size={28} className="text-white" />,
    iconBg: '#7e22ce', // Purple
    cardBg: '#F5F8FC', // Sky white
  },
  {
    id: 'notification',
    title: 'Notification',
    description: 'Smart reminders and alerts for appointments & follow ups.',
    icon: <Bell size={28} className="text-white" />,
    iconBg: '#f59e0b', // Yellow
    cardBg: '#FCFBF5', // Cream/Yellow white
  },
  {
    id: 'feedback',
    title: 'Feedback',
    description: 'Collect patient feedback and improve service continuity.',
    icon: <MessageSquareShare size={28} className="text-white" />,
    iconBg: '#0f766e', // Teal
    cardBg: '#F5F8FC', // Sky white
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section
      id="features"
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: '#FDFCF7' }} // Off-white cream background for the section
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl xl:text-5xl font-bold text-[#111111] leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Powerful Features for Modern Ayurveda
          </h2>
        </div>

        {/* Features Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center p-8 rounded-3xl border border-[#E1E4DA]/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              style={{ backgroundColor: feature.cardBg }}
            >
              {/* Icon Circle */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: feature.iconBg }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                className="text-[17px] font-bold text-[#111111] mb-3"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="text-[14px] text-[#4b5563] leading-[1.6]"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};
