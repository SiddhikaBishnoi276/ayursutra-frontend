import { Eye, EyeOff, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ayursutraLogo from "../../assets/Ayur-Sutra-logo.png";
import loginImage from "../../assets/04-ayur.png";
import { useLoginMutation } from "../apis/Authapi";
import {
  LoginFormData,
  ROLE_DASHBOARD_MAP,
  ROLE_DISPLAY_NAMES,
  UserRole,
} from "../types/login";

interface RoleLoginFormProps {
  role: UserRole;
  onClose: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const RoleLoginForm: React.FC<RoleLoginFormProps> = ({
  role,
  onClose,
}) => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const roleLabel = ROLE_DISPLAY_NAMES[role];
  const dashboardRoute = ROLE_DASHBOARD_MAP[role];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({
        email: formData.email,
        password: formData.password,
        role,
      }).unwrap();
      onClose();
      navigate(dashboardRoute);
    } catch {
      setErrors({
        general: "Login failed. Please check your credentials and try again.",
      });
    }
  };

  const handleChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card */}
      <div
        className="w-full max-w-[95vw] sm:max-w-xl md:max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#E8E0C0]/40 flex flex-col md:flex-row max-h-[92vh] overflow-y-auto"
        style={{ background: "rgba(255,253,245,0.98)" }}
      >
        {/* LEFT — Branding */}
        <div
          className="w-full md:w-[42%] flex flex-col justify-between p-5 sm:p-8 md:p-10"
          style={{
            background: "linear-gradient(160deg, #FEFDF5 0%, #F4EFD8 100%)",
            borderRight: "1.5px solid rgba(212,201,138,0.3)",
          }}
        >
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4 sm:mb-8">
              <img
                src={ayursutraLogo}
                alt="AyurSutra Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-full shadow-sm"
              />
              <span
                className="text-xl sm:text-2xl font-bold text-[#15803d]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AyurSūtra
              </span>
            </div>

            {/* Welcome Heading */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] mb-2 sm:mb-4 leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome
              <br className="hidden sm:inline" /> {roleLabel}!
            </h1>

            <p
              className="text-xs sm:text-[14px] text-[#5a6472] leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Login to access your dashboard and manage your Ayurvedic health
              journey seamlessly.
            </p>
          </div>

          {/* Image — hidden on mobile to avoid vertical cramping */}
          <div className="hidden md:flex mt-8 justify-center">
            <img
              src={loginImage}
              alt="Ayurvedic Login"
              className="w-full object-contain"
              style={{ maxHeight: "180px" }}
            />
          </div>
        </div>

        {/* RIGHT — Login Form */}
        <div className="w-full md:w-[58%] flex flex-col justify-center p-5 sm:p-8 md:p-10 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 min-w-[40px] min-h-[40px] rounded-full bg-[#F3F0E8] flex items-center justify-center hover:bg-[#E8E0C0] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} className="text-[#555]" />
          </button>

          {/* Form Heading */}
          <h2
            className="text-xl sm:text-2xl font-bold text-[#111111] mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {roleLabel} Login
          </h2>
          <p className="text-xs sm:text-[13px] text-[#6b7280] mb-5 sm:mb-7">
            Enter your credentials to login
          </p>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">
              {errors.general}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                Email
              </label>
              <input
                id={`login-email-${role}`}
                type="email"
                placeholder={`${role}@ayursutra.com`}
                value={formData.email}
                onChange={handleChange("email")}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-xl border text-[14px] text-[#111111] bg-[#FEFDF9] focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#E1E4DA] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]/30"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-[#374151]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] text-[#15803d] font-medium hover:underline"
                  onClick={() => {
                    /* Forgot password — future OTP flow */
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id={`login-password-${role}`}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange("password")}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-[14px] text-[#111111] bg-[#FEFDF9] focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-[#E1E4DA] focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[12px] text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id={`remember-${role}`}
                type="checkbox"
                className="w-4 h-4 rounded border-[#E1E4DA] accent-[#15803d]"
              />
              <label
                htmlFor={`remember-${role}`}
                className="text-[13px] text-[#4b5563]"
              >
                Remember Me
              </label>
            </div>

            {/* Submit */}
            <button
              id={`submit-login-${role}`}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#033015] text-white font-bold text-[15px] hover:bg-[#0C3B17] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-[12px] text-[#9ca3af]">
            Don't have an account?{" "}
            <span className="text-[#15803d] font-semibold cursor-pointer hover:underline">
              Contact Admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
