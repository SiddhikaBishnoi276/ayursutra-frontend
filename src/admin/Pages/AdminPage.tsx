import React, { useState } from 'react';
import { useAdminDashboard } from '../Hooks/useAdminDashboard';
import { useStaffManagement } from '../Hooks/useStaffManagement';
import { useProtocols } from '../Hooks/useProtocols';
import { useRooms } from '../Hooks/useRooms';
import { useQuestionnaire } from '../Hooks/useQuestionnaire';
import { Sidebar } from '../../Common/Components/Sidebar';
import { Topbar } from '../../Common/Components/Topbar';
import { DashboardTab } from '../Components/DashboardTab';
import { StaffTab } from '../Components/StaffTab';
import { PackagesTab } from '../Components/PackagesTab';
import { RoomsTab } from '../Components/RoomsTab';
import { AnalyticsTab } from '../Components/AnalyticsTab';
import { OversightTab } from '../Components/OversightTab';
import { QuestionnaireTab } from '../Components/QuestionnaireTab';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  // Hook 1: Dashboard Overview
  const {
    activities,
    stats,
    notifications,
    isLoading: isDashLoading,
    retryNotification,
  } = useAdminDashboard();

  // Hook 2: Staff Management
  const {
    staff,
    isLoading: isStaffLoading,
    addDoctor,
    addTherapist,
    toggleStaffStatus,
  } = useStaffManagement();

  // Hook 3: Protocols Management
  const {
    packages,
    isLoading: isProtocolsLoading,
    checkSimilarity,
    addPackage,
    editPackage,
    approvePackage,
  } = useProtocols();

  // Hook 4: Rooms
  const {
    rooms,
    isLoading: isRoomsLoading,
    addRoom,
  } = useRooms();

  // Hook 5: Questionnaire Management
  const {
    questions,
    isLoading: isQuestionsLoading,
    addQuestion,
    editQuestion,
    removeQuestion,
  } = useQuestionnaire();

  const isLoading =
    isDashLoading &&
    isStaffLoading &&
    isProtocolsLoading &&
    isRoomsLoading &&
    isQuestionsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] font-sans antialiased text-ayur-green-mid">
        <div className="text-center p-8">
          <p className="text-base font-bold font-serif text-ayur-primary tracking-wide">
            AyurSutra Operations Hub
          </p>
          <p className="text-sm text-ayur-green-mid font-medium mt-1">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fbf9f5] font-sans antialiased text-gray-800">
      {/* Role-Aware Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        roleTitle="Admin Panel"
        adminName="Admin Director"
        adminEmail="admin@ayursutra.com"
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <Topbar
          clinicName="AyurSutra Wellness Center"
          certificationLabel="AYUSH Certified"
          adminName="Admin Director"
          adminRole="Operations"
          adminEmail="admin@ayursutra.com"
        />

        {/* Main Content View Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && (
              <DashboardTab
                staff={staff}
                rooms={rooms}
                activities={activities}
                packages={packages}
                onTabChange={setActiveTab}
              />
            )}

            {activeTab === 'staff' && (
              <StaffTab
                staff={staff}
                onAddDoctor={addDoctor}
                onAddTherapist={addTherapist}
                onToggleStatus={toggleStaffStatus}
              />
            )}

            {activeTab === 'protocols' && (
              <PackagesTab
                packages={packages}
                onAddPackage={addPackage}
                onEditPackage={editPackage}
                onCheckSimilarity={checkSimilarity}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomsTab
                rooms={rooms}
                onAddRoom={addRoom}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}

            {activeTab === 'oversight' && (
              <OversightTab
                notifications={notifications}
                packages={packages}
                activities={activities}
                onRetryNotification={retryNotification}
                onApprovePackage={approvePackage}
              />
            )}

            {activeTab === 'questionnaire' && (
              <QuestionnaireTab
                questions={questions}
                onAddQuestion={addQuestion}
                onEditQuestion={editQuestion}
                onRemoveQuestion={removeQuestion}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;