// src/Patient/Pages/PatientPage.tsx
// Main Patient Portal Layout Coordinator rendering Sidebar, Topbar, Persistent Allergy Banner, and <Outlet />

import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  MessageSquare,
  User,
  AlertTriangle,
  X,
  ArrowRight,
} from 'lucide-react';
import { Sidebar, NavItem } from '../../Common/Components/Sidebar';
import { Topbar } from '../../Common/Components/Topbar';
import { ErrorBoundary } from '../../Common/Components/ErrorBoundary';
import { useGetMyProfileQuery } from '../apis/patientApi';
import { useMyTherapyPlan } from '../Hooks/useMyTherapyPlan';

export const patientNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'therapy-plan', label: 'My Therapy Plan', icon: Sparkles },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'feedback', label: 'Session Feedback', icon: MessageSquare },
  { id: 'profile', label: 'My Profile', icon: User },
];

export const PatientPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch patient profile for persistent allergy banner and Topbar user info
  const { data: profile } = useGetMyProfileQuery();
  const { plan, isDoctorUpdateVisible, dismissDoctorUpdate } = useMyTherapyPlan();

  // Derive active tab from current URL path
  const currentPath = location.pathname;
  let activeTab = 'dashboard';
  if (currentPath.includes('/therapy-plan')) {
    activeTab = 'therapy-plan';
  } else if (currentPath.includes('/appointments')) {
    activeTab = 'appointments';
  } else if (currentPath.includes('/feedback')) {
    activeTab = 'feedback';
  } else if (currentPath.includes('/profile')) {
    activeTab = 'profile';
  }

  const handleTabChange = (tabId: string) => {
    navigate(`/patient/${tabId}`);
  };

  const patientName = profile?.name || 'Amit Sharma';
  const patientEmail = profile?.email || 'amit.sharma@example.com';

  return (
    <div className="flex min-h-screen bg-[#fbf9f5] font-sans antialiased text-gray-800">
      {/* Role-Aware Shared Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        roleTitle="Patient Portal"
        adminName={patientName}
        adminEmail={patientEmail}
        navItems={patientNavItems}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <Topbar
          clinicName="AyurSutra Wellness & Panchakarma Clinic"
          certificationLabel="AYUSH Certified"
          adminName={patientName}
          adminRole="Patient Portal"
          adminEmail={patientEmail}
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
        />

        {/* Main Canvas with Persistent Layout-Level Banners */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
            {/* 1. Doctor Plan Update Notification Banner (Persistent Dismissal) */}
            {isDoctorUpdateVisible && plan?.isPlanUpdatedByDoctor && (
              <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200/90 text-xs text-purple-950 flex items-start justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-800 shrink-0 mt-0.5">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="font-bold text-purple-950 font-serif text-sm block">
                      Treatment Plan Updated by {plan.doctorName}
                    </span>
                    <p className="text-purple-800 font-medium mt-0.5 leading-relaxed">
                      {plan.doctorUpdateNote || 'Your doctor has adjusted your therapeutic stage guidelines and formulations.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/patient/therapy-plan')}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                    >
                      <span>Review Updated Protocol</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={dismissDoctorUpdate}
                  className="p-1 rounded-lg text-purple-600 hover:text-purple-900 hover:bg-purple-100 transition cursor-pointer shrink-0"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 2. Persistent Allergy & Clinical Sensitivity Banner (Layout-level, visible across all routes) */}
            {profile?.allergies && profile.allergies.length > 0 && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-xs flex items-start gap-3 shadow-2xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-amber-950 font-serif text-xs sm:text-sm block">
                    Important Clinical Sensitivities & Precautions:
                  </span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-amber-900 font-medium">
                    <span>
                      <strong>Allergies: </strong>
                      {profile.allergies.join(', ')}
                    </span>
                    {profile.precautions && profile.precautions.length > 0 && (
                      <span>
                        <strong>• Key Precaution: </strong>
                        {profile.precautions[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Child Screen Routed via Outlet */}
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientPage;
