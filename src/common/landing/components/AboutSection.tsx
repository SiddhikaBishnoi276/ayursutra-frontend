import React from 'react';
import { HeartHandshake, Sprout, Cpu, Globe, CircleCheck } from 'lucide-react';
import aboutImg from '../../../assets/18-ayur.jpeg';
import platformImg from '../../../assets/21-ayur.png';

const VISION_CARDS = [
  {
    id: 'holistic-healing',
    icon: <HeartHandshake size={24} />,
    title: 'Holistic Healing',
  },
  {
    id: 'sustainable-wellness',
    icon: <Sprout size={24} />,
    title: 'Sustainable Wellness',
  },
  {
    id: 'technology-driven',
    icon: <Cpu size={24} />,
    title: 'Technology Driven',
  },
  {
    id: 'accessible-for-all',
    icon: <Globe size={24} />,
    title: 'Accessible for All',
  },
];

const PLATFORM_POINTS = [
  'Digital Patient Records',
  'Smart Scheduling',
  'Therapy Management',
  'Progress Tracking',
  'Reports & Analytics',
  'AI Based Diet Plans',
];

export const AboutSection: React.FC = () => {
  return (
    <>
      {/* ══════════════════════════════════════
          PART 1 — Our Vision
      ══════════════════════════════════════ */}
      <section
        id="about"
        className="bg-[#F8F7F2] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* TOP ROW: Text left + Image right */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* Left */}
            <div className="flex flex-col gap-4 pt-20 md:pt-28 pb-10 pr-0 lg:pr-8">
              <p
                className="text-[24px] font-bold text-[#3F913F] tracking-[0.18em] uppercase"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Our Vision
              </p>
              <h2
                className="text-3xl md:text-4xl xl:text-[2.75rem] font-bold text-[#033015] leading-[1.15] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Healthy Future,{' '}
                <span className="text-[#3F913F] italic">Naturally</span>
              </h2>
              <p
                className="text-[15px] text-[#667064] leading-[1.9] max-w-[440px] pt-5"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                We envision a world where ancient Ayurvedic wisdom and modern
                technology come together to build a sustainable, thriving world —
                making holistic healthcare accessible for every individual, everywhere.
              </p>
            </div>

            {/* Right: Image — pushed towards bottom */}
            <div className="hidden lg:block mt-24 lg:mt-24">
              <div className="w-full h-[400px] xl:h-[440px] rounded-b-[2.5rem] overflow-hidden shadow-2xl translate-y-4">
                <img
                  src={aboutImg}
                  alt="Ayurvedic nature — AyurSutra vision"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Mobile image */}
            <div className="block lg:hidden mb-6 mt-12">
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={aboutImg}
                  alt="Ayurvedic nature — AyurSutra vision"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4 CARDS */}
          <div className="mt-8 pb-20 md:pb-28 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {VISION_CARDS.map((card) => (
              <div
                key={card.id}
                id={`about-card-${card.id}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-[#E1E4DA] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default text-center"
                style={{ backgroundColor: '#F3F2EC' }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E3E5D8] flex items-center justify-center text-[#033015] group-hover:bg-[#033015] group-hover:text-white transition-all duration-300 flex-shrink-0">
                  {card.icon}
                </div>
                <h3
                  className="text-[13.5px] font-bold text-[#033015]"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {card.title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          PART 2 — About AyurSutra Platform
      ══════════════════════════════════════ */}
      <section
        id="about-platform"
        className="relative overflow-hidden"
        style={{ background: '#F0F7F0' }}
      >
        {/* Top wave separator */}
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden leading-none"
          style={{ height: '60px' }}
        >
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 C360,60 1080,60 1440,0 L1440,0 L0,0 Z"
              fill="#F8F7F2"
            />
          </svg>
        </div>
        <div className="pt-20 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* LEFT: Text content */}
            <div className="flex flex-col gap-6 order-2 lg:order-1">

              {/* Label */}
              <p
                className="text-[15px] font-bold text-[#3F913F] tracking-[0.14em] uppercase"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                About AyurSutra
              </p>

              {/* Heading */}
              <h2
                className="text-3xl md:text-4xl xl:text-[2.75rem] font-bold text-[#111111] leading-[1.15] tracking-tight whitespace-nowrap"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bridging Ayurveda with Technology
              </h2>

              {/* Description */}
              <p
                className="text-[15px] text-[#2e2e2e] leading-[1.9] max-w-[460px]"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                AyurSutra is a smart Panchakarma management platform that
                simplifies patient management, therapy scheduling, progress
                tracking and center operations.
              </p>

              {/* Point list */}
              <ul className="flex flex-col gap-4">
                {PLATFORM_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3.5"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    {/* Green circle icon bg */}
                    <span className="w-8 h-8 rounded-full bg-[#3F913F] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CircleCheck size={16} className="text-white" strokeWidth={2.5} />
                    </span>
                    <span className="text-[15.5px] font-semibold text-[#111111]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT: Dashboard / laptop image */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-[540px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
                <img
                  src={platformImg}
                  alt="AyurSutra platform dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
        </div>
      </section>
    </>
  );
};
