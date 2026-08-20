// src/Therapist/Pages/TherapistPage.tsx
// Main Therapist Portal Workspace Coordinator
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Clock,
  Play,
  Calendar,
  Sparkles,
  BedDouble,
} from 'lucide-react';
import { Sidebar, NavItem } from '../../Common/Components/Sidebar';
import { Topbar } from '../../Common/Components/Topbar';
import { ErrorBoundary } from '../../Common/Components/ErrorBoundary';
import { TherapistDashboard } from './TherapistDashboard';
import { SessionQueuePage } from './SessionQueuePage';
import { SessionStartPage } from './SessionStartPage';
import { ActiveSessionPage } from './ActiveSessionPage';
import { AvailabilityPage } from './AvailabilityPage';
import { useActiveSession } from '../Hooks/useActiveSession';
import { useSessionQueue } from '../Hooks/useSessionQueue';
import { TherapistSession } from '../types/therapist.types';

const therapistNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue', label: "Today's Queue", icon: Clock },
  { id: 'availability', label: 'Duty & Availability', icon: Calendar },
];

export const TherapistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'start' | 'active' | 'availability'>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { rawQueue } = useSessionQueue();
  const [selectedSessionForStart, setSelectedSessionForStart] = useState<TherapistSession | null>(null);
  const [selectedSessionForActive, setSelectedSessionForActive] = useState<TherapistSession | null>(null);

  const {
    session: activeSessionFromHook,
    startSession,
  } = useActiveSession(selectedSessionForActive?.id || selectedSessionForStart?.id);

  // Auto-detect if there is an in-progress session on initial mount
  useEffect(() => {
    const inProgress = rawQueue.find((s) => s.status === 'in_progress' || s.status === 'paused_emergency');
    if (inProgress && !selectedSessionForActive) {
      setSelectedSessionForActive(inProgress);
    }
  }, [rawQueue, selectedSessionForActive]);

  // Handlers
  const handleSelectSessionForStart = (session: TherapistSession) => {
    setSelectedSessionForStart(session);
    setActiveTab('start');
  };

  const handleSelectSessionForActive = (session: TherapistSession) => {
    setSelectedSessionForActive(session);
    setActiveTab('active');
  };

  const handleStartSuccess = (session: TherapistSession) => {
    setSelectedSessionForActive(session);
    setActiveTab('active');
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f5] font-sans antialiased text-gray-800">
      {/* Role-Aware Reused Sidebar */}
      <Sidebar
        activeTab={activeTab === 'start' || activeTab === 'active' ? 'queue' : activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        roleTitle="Therapist Portal"
        adminName="Dr. Sandeep Kulkarni"
        adminEmail="sandeep.kulkarni@ayursutra.com"
        navItems={therapistNavItems}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <Topbar
          clinicName="AyurSutra Wellness & Panchakarma Clinic"
          certificationLabel="AYUSH Certified"
          adminName="Dr. Sandeep Kulkarni"
          adminRole="Senior Certified Therapist"
          adminEmail="sandeep.kulkarni@ayursutra.com"
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
              {activeTab === 'dashboard' && (
                <TherapistDashboard
                  onNavigateTab={(tab) => setActiveTab(tab as any)}
                  onSelectSessionForStart={handleSelectSessionForStart}
                  onSelectSessionForActive={handleSelectSessionForActive}
                />
              )}

              {activeTab === 'queue' && (
                <SessionQueuePage
                  onStartSession={handleSelectSessionForStart}
                  onResumeSession={handleSelectSessionForActive}
                />
              )}

              {activeTab === 'start' && selectedSessionForStart && (
                <SessionStartPage
                  session={selectedSessionForStart}
                  onBack={() => setActiveTab('queue')}
                  onStartSuccess={handleStartSuccess}
                  onStartSession={startSession}
                />
              )}

              {activeTab === 'active' && (selectedSessionForActive || activeSessionFromHook) && (
                <ActiveSessionPage
                  session={selectedSessionForActive || activeSessionFromHook!}
                  onBack={() => setActiveTab('queue')}
                  onSessionCompleteRedirect={() => setActiveTab('queue')}
                />
              )}

              {activeTab === 'availability' && (
                <AvailabilityPage onBack={() => setActiveTab('dashboard')} />
              )}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TherapistPage;
