import React from 'react';
import { Check } from 'lucide-react';
import benefitsImage from '../../../assets/07-ayur.jpeg';

const BENEFITS = [
  "Detoxifies body and mind",
  "Improves digestion & metabolism",
  "Boosts immunity and energy",
  "Relieves stress and anxiety",
  "Promotes better sleep",
  "Restores overall well-being"
];

export const BenefitsPanchakarmaSection: React.FC = () => {
  return (
    <section id="panchakarma" className="pt-4 pb-16 md:pt-8 md:pb-24 overflow-hidden" style={{ background: '#FCFBF5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 
              className="text-3xl md:text-4xl xl:text-5xl font-bold mb-8 tracking-tight text-[#15803d]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Benefits of Panchakarma
            </h2>
            <p 
              className="text-xl md:text-2xl font-bold text-[#111111] mb-8"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Rejuvenate. Detoxify. Rebalance.
            </p>

            <ul className="space-y-5">
              {BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#15803d] flex items-center justify-center">
                    <Check size={16} className="text-white" strokeWidth={3} />
                  </div>
                  <span 
                    className="text-[16px] md:text-[17px] font-bold text-[#111111]"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              src={benefitsImage} 
              alt="Panchakarma Herbs and Oils" 
              className="w-full h-auto max-w-lg lg:max-w-xl rounded-2xl shadow-xl object-cover mix-blend-multiply"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
