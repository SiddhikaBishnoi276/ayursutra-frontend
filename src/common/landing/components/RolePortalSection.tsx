import React from "react";
import {
  ShieldCheck,
  Stethoscope,
  Flower2,
  UserRound,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { UserRole } from "../../../auth/types/login";

interface RoleConfig {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  buttonBg: string;
}

interface RolePortalSectionProps {
  onRoleLogin: (role: UserRole) => void;
}

const ROLES: RoleConfig[] = [
  {
    role: "admin",
    label: "Administrator",
    description: "Manage centers, users, resources and reports",
    icon: <ShieldCheck size={26} />,
    iconBg: "#E9EBDD",
    iconColor: "#033015",
    buttonBg: "#033015",
  },
  {
    role: "doctor",
    label: "Doctor",
    description: "Patient consultation, treatment planning",
    icon: <Stethoscope size={26} />,
    iconBg: "#EEF2FF",
    iconColor: "#3730a3",
    buttonBg: "#1e3a5f",
  },
  {
    role: "therapist",
    label: "Therapist",
    description: "Therapy execution, sessions & feedback",
    icon: <Flower2 size={26} />,
    iconBg: "#FDF3EC",
    iconColor: "#8B5E3C",
    buttonBg: "#8B5E3C",
  },
  {
    role: "patient",
    label: "Patient",
    description: "View appointments, treatment progress",
    icon: <UserRound size={26} />,
    iconBg: "#F3F0FF",
    iconColor: "#7c3aed",
    buttonBg: "#5b21b6",
  },
];

export const RolePortalSection: React.FC<RolePortalSectionProps> = ({ onRoleLogin }) => {

  const handleRoleLogin = (config: RoleConfig) => {
    onRoleLogin(config.role);
  };

  return (
    <section
      id="role-portal"
      style={{ background: "#F3F4EE" }}
      className="relative"
    >
      {/* Top wave curve — visually separates from hero */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden leading-none"
        style={{ height: "60px" }}
      >
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C360,60 1080,60 1440,0 L1440,0 L0,0 Z"
            fill="#FDFDFA"
          />
        </svg>
      </div>

      <div className="pt-12 pb-16 md:pt-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#C8CCBB]" />
              <Leaf size={15} className="text-[#3F913F]" />
              <div className="h-px w-12 bg-[#C8CCBB]" />
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#033015]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Access Portal by Your Role
            </h2>
            <p className="mt-2 text-[15px] text-[#667064]">
              Choose your role to continue
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLES.map((config) => {
              return (
                <div
                  key={config.role}
                  className="group bg-white rounded-2xl border border-[#E1E4DA] p-6 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => handleRoleLogin(config)}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: config.iconBg,
                      color: config.iconColor,
                    }}
                  >
                    {config.icon}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1 flex-1">
                    <h3
                      className="text-[17px] font-bold"
                      style={{
                        color: config.iconColor,
                        fontFamily: "'Playfair Display', serif",
                      }}
                    >
                      {config.label}
                    </h3>
                    <p className="text-[13px] text-[#667064] leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    id={`login-as-${config.role}-btn`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleLogin(config);
                    }}
                    className="flex items-center justify-between px-4 py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: config.buttonBg }}
                  >
                    <span>Login as {config.label}</span>
                    <ArrowRight size={16} className="ml-1 opacity-80" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
