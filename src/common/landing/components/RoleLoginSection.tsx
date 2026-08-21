import {
  ChevronRight,
  Leaf,
  ShieldCheck,
  Stethoscope,
  User,
  Truck,
  X,
} from "lucide-react";
import React from "react";
import ayursutraLogo from "../../../assets/Ayur-Sutra-logo.jpg";
import loginImage from "../../../assets/AyurSutra-login.png";

const ROLES = [
  {
    id: "admin",
    label: "Admin",
    description: "Manage clinic operations",
    icon: <ShieldCheck size={22} className="text-[#15803d]" />,
    iconBg: "#f0fdf4",
    iconBorder: "#dcfce7",
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Access patient records",
    icon: <Stethoscope size={22} className="text-[#1d4ed8]" />,
    iconBg: "#eff6ff",
    iconBorder: "#dbeafe",
  },
  {
    id: "therapist",
    label: "Therapist",
    description: "Manage therapy sessions",
    icon: <Leaf size={22} className="text-[#ea580c]" />,
    iconBg: "#fff7ed",
    iconBorder: "#fed7aa",
  },
  {
    id: "patient",
    label: "Patient",
    description: "View your health journey",
    icon: <User size={22} className="text-[#7e22ce]" />,
    iconBg: "#faf5ff",
    iconBorder: "#e9d5ff",
  },
  
];

interface RoleLoginSectionProps {
  onRoleSelect?: (roleId: string) => void;
  onClose?: () => void;
}

export const RoleLoginSection: React.FC<RoleLoginSectionProps> = ({
  onRoleSelect,
  onClose,
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.hash = "";
      window.scrollTo(0, 0);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center pt-16"
      style={{
        background: "linear-gradient(135deg, #FEFDF8 0%, #F5F0DC 60%, #EDF5EE 100%)",
      }}
    >
      {/* Outer Card Container */}
      <div
        className="w-full max-w-5xl mx-4 my-8 rounded-3xl overflow-hidden shadow-2xl border border-[#E8E0C0]/60"
        style={{ background: "rgba(255,253,245,0.95)" }}
      >
        <div className="flex flex-col lg:flex-row items-stretch min-h-[580px]">

          {/* LEFT SIDE */}
          <div
            className="w-full lg:w-[45%] flex flex-col justify-between p-10"
            style={{
              background: "linear-gradient(160deg, #FEFDF5 0%, #F7F2E0 100%)",
              borderRight: "1.5px solid rgba(212,201,138,0.35)",
            }}
          >
            <div>
              {/* Logo + Name */}
              <div className="flex items-center gap-3 mb-10">
                <img
                  src={ayursutraLogo}
                  alt="AyurSutra Logo"
                  className="w-12 h-12 object-contain rounded-full shadow-sm"
                />
                <span
                  className="text-3xl font-bold text-[#15803d] tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  AyurSūtra
                </span>
              </div>

              {/* Heading */}
              <h1
                className="text-4xl md:text-5xl font-bold text-[#111111] mb-5 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Welcome Back!
              </h1>

              {/* Subtitle */}
              <p
                className="text-[15px] text-[#5a6472] leading-relaxed max-w-xs"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Login to continue to your account and manage your Ayurvedic health journey seamlessly.
              </p>
            </div>

            {/* Image at bottom */}
            <div className="flex justify-center mt-8">
              <img
                src={loginImage}
                alt="Ayurvedic Login"
                className="w-full object-contain"
                style={{ maxHeight: "240px" }}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center p-10 relative">
            {/* Close Button */}
            <button
              id="role-login-close-btn"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full border border-[#E8E0C0] text-[#6b7280] hover:bg-[#f0fdf4] hover:text-[#15803d] hover:border-[#15803d] transition-all duration-200"
            >
              <X size={18} />
            </button>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#111111] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Select Your Role
            </h2>
            <p
              className="text-[14px] text-[#6b7280] mb-8"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Choose your role to login
            </p>

            {/* Role Cards */}
            <div className="flex flex-col gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  id={`role-select-${role.id}`}
                  onClick={() => onRoleSelect?.(role.id)}
                  className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl border border-[#E8E0C0] hover:border-[#15803d] hover:shadow-md transition-all duration-200 group text-left"
                  style={{ background: "rgba(255,253,245,0.8)" }}
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm"
                    style={{
                      backgroundColor: role.iconBg,
                      borderColor: role.iconBorder,
                    }}
                  >
                    {role.icon}
                  </div>

                  {/* Label & Description */}
                  <div className="flex-1">
                    <p
                      className="text-[16px] font-bold text-[#111111] group-hover:text-[#15803d] transition-colors"
                      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                      {role.label}
                    </p>
                    <p className="text-[12px] text-[#6b7280]">
                      {role.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    size={20}
                    className="text-[#9ca3af] group-hover:text-[#15803d] transition-colors flex-shrink-0"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
