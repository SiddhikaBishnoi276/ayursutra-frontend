import { CircleCheck, Leaf } from "lucide-react";
import React from "react";
import heroImg from "../../../assets/ayursutra-landing-hero.jpg";

const FEATURE_BADGES = [
  "Smart Scheduling",
  "Complete Patient Care",
  "Holistic Analytics",
];

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="pt-24 pb-10 md:pt-28 md:pb-12 overflow-hidden"
      style={{ background: "#F8F7F2" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-stretch">

          {/* Left: Text Content */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E9EBDD] border border-[#C8CCBB] rounded-full w-fit">
              <Leaf size={13} className="text-[#3F913F]" />
              <span className="text-[11px] font-bold text-[#033015] tracking-[0.12em] uppercase">
                Digital &bull; Intelligent &bull; Ayurvedic
              </span>
            </div>

            {/* Main Heading */}
            <div className="flex flex-col gap-2">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl xl:text-[5.5rem] font-bold text-[#033015] leading-[1.05] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AyurSutra
              </h1>
              {/* Subtitle — Inter font, medium weight, clear readable size */}
              <p
                className="text-[1.1rem] md:text-[1.25rem] font-semibold text-[#3a4a38] leading-[1.45] mt-1"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.01em" }}
              >
                Panchakarma Patient Management
                <br />
                &amp; Therapy Scheduling Platform
              </p>
            </div>

            {/* Description */}
            <p
              className="text-[14.5px] text-[#667064] leading-[1.85] max-w-[400px]"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              A unified digital ecosystem for Ayurvedic centers to manage
              patients, therapies, schedules, practitioners and outcomes —
              seamlessly and intelligently.
            </p>

            {/* Feature badges pushed to bottom — aligns with image bottom */}
            <div className="mt-auto pt-6 flex flex-wrap gap-3">
              {FEATURE_BADGES.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E1E4DA] rounded-xl shadow-sm text-[13px] font-semibold text-[#30352F]"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  <CircleCheck size={15} className="text-[#3F913F] flex-shrink-0" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Image — clean, no wrapper card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[540px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-xl">
              <img
                src={heroImg}
                alt="Panchakarma therapy — AyurSutra"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
