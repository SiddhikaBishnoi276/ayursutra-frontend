import React from 'react';
import { Leaf, Droplet, Wind, Activity, Heart, Info } from 'lucide-react';
import processImage from '../../../assets/02_panchakarma_process.jpg';

const CARDS = [
  {
    id: 'vamana',
    title: 'Vamana',
    description: 'Therapeutic emesis to cleanse upper body.',
    icon: <Leaf size={24} className="text-[#15803d]" />,
  },
  {
    id: 'virechana',
    title: 'Virechana',
    description: 'Purgation therapy to detoxify the body.',
    icon: <Droplet size={24} className="text-[#15803d]" />,
  },
  {
    id: 'basti',
    title: 'Basti',
    description: 'Medicated enema to cleanse colon and balance doshas.',
    icon: <Wind size={24} className="text-[#15803d]" />,
  },
  {
    id: 'nasya',
    title: 'Nasya',
    description: 'Nasal therapy to clear head & sinuses.',
    icon: <Activity size={24} className="text-[#15803d]" />,
  },
  {
    id: 'raktamokshana',
    title: 'Raktamokshana',
    description: 'Blood purification therapy for deep cleansing.',
    icon: <Heart size={24} className="text-[#991b1b]" />, // using red for blood purification to match the mockup
  },
];

export const PanchakarmaProcessSection: React.FC = () => {
  return (
    <section className="pt-0 pb-16 md:pt-2 md:pb-24 overflow-hidden" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Part: Text and Image */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 mb-16">
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 
              className="text-3xl md:text-4xl xl:text-5xl font-bold mb-8 tracking-tight text-[#15803d]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Panchakarma Process
            </h2>
            <p 
              className="text-xl md:text-2xl font-bold text-[#111111] mb-12"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              The Fivefold Path to Natural Healing
            </p>
            <p 
              className="text-[16px] md:text-[17px] text-[#4b5563] leading-relaxed max-w-xl"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Panchakarma is a detoxification and rejuvenation therapy in Ayurveda that eliminates toxins, balances doshas and promotes overall well-being.
            </p>
          </div>

          {/* Right Image Content */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              src={processImage} 
              alt="Panchakarma Process Shirodhara" 
              className="w-full h-auto max-w-lg lg:max-w-xl rounded-2xl shadow-xl object-cover mix-blend-multiply"
            />
          </div>
        </div>

        {/* Bottom Part: Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {CARDS.map((card) => (
            <div 
              key={card.id}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-[#E1E4DA]/60 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon Circle */}
              <div className="w-14 h-14 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center mb-4">
                {card.icon}
              </div>
              
              {/* Title */}
              <h3 
                className={`text-[16px] font-bold mb-2 ${card.id === 'raktamokshana' ? 'text-[#991b1b]' : 'text-[#111111]'}`}
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {card.title}
              </h3>
              
              {/* Description */}
              <p 
                className="text-[13px] text-[#4b5563] leading-snug"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>

       

      </div>
    </section>
  );
};
