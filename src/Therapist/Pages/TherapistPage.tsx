// src/Therapist/Pages/TherapistPage.tsx
// Main Therapist Portal Workspace Layout & Coordinator
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Calendar,
} from 'lucide-react';
import { Sidebar, NavItem } from '../../Common/Components/Sidebar';
import { Topbar } from '../../Common/Components/Topbar';
import { ErrorBoundary } from '../../Common/Components/ErrorBoundary';

export const therapistNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue', label: "Today's Queue", icon: Clock },
  { id: 'availability', label: 'Duty & Availability', icon: Calendar },
];

export const TherapistPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive active tab from current URL path
  const currentPath = location.pathname;
  let activeTab = 'dashboard';
  if (currentPath.includes('/queue') || currentPath.includes('/session/')) {
    activeTab = 'queue';
  } else if (currentPath.includes('/availability')) {
    activeTab = 'availability';
  }

  const handleTabChange = (tabId: string) => {
    navigate(`/therapist/${tabId}`);
  };

  const therapistName = localStorage.getItem('name') || 'Therapist';
  const therapistEmail = localStorage.getItem('email') || 'therapist@ayursutra.com';

  return (
    <div className="flex min-h-screen bg-[#fbf9f5] font-sans antialiased text-gray-800">
      {/* Role-Aware Reused Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        roleTitle="Therapist Portal"
        adminName={therapistName}
        adminEmail={therapistEmail}
        navItems={therapistNavItems}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <Topbar
          clinicName="AyurSutra Wellness & Panchakarma Clinic"
          certificationLabel="AYUSH Certified"
          adminName={therapistName}
          adminRole="Certified Panchakarma Therapist"
          adminEmail={therapistEmail}
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          notifications={[
            {
              id: 'tn-1',
              message: 'Mahatiktaka Ghrita batch replenishment verified for Chamber 2',
              time: '15 mins ago',
            },
            {
              id: 'tn-2',
              message: 'Doctor reviewed Day 4 Kati Basti plan for Rahul Verma',
              time: '1 hour ago',
            },
          ]}
          unreadCount={1}
        />

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TherapistPage;
