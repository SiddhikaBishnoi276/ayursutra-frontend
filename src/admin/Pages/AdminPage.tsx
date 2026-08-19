import { useState } from 'react';
import { useAdminDashboard } from '../Hooks/useAdminDashboard';
import { Sidebar } from '../Components/Sidebar';
import { Topbar } from '../Components/Topbar';

// Tabs
import { DashboardTab } from '../Components/DashboardTab';
import { StaffTab } from '../Components/StaffTab';
import { PackagesTab } from '../Components/PackagesTab';
import { RoomsTab } from '../Components/RoomsTab';
import { AnalyticsTab } from '../Components/AnalyticsTab';
import { OversightTab } from '../Components/OversightTab';
import { QuestionnaireTab } from '../Components/QuestionnaireTab';
import { SettingsTab } from '../Components/SettingsTab';

const AdminPage = () => {
    const {
        staff,
        packages,
        rooms,
        questions,
        notifications,
        activities,
        isLoading,
        addStaff,
        suspendStaff,
        activateStaff,
        editStaff,
        addPackage,
        approvePackage,
        addRoom,
        setRoomStatus,
        retryNotification,
        addQuestion,
        editQuestion,
        removeQuestion
    } = useAdminDashboard();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbf9f6] text-slate-650">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-emerald-900/10 border-t-emerald-900"></div>
                        <span className="text-xs font-bold text-emerald-800 animate-pulse">☯</span>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-800">Synchronizing Dosha Matrix...</p>
                        <p className="text-xs text-slate-400">Loading clinic operations panel</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#fbf9f6] font-sans antialiased text-slate-800">
            
            {/* Scoped Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
            />

            {/* Main Application Container */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Scoped Top Bar */}
                <Topbar 
                    notifications={notifications} 
                    onRetryNotification={retryNotification} 
                    onTabChange={setActiveTab} 
                />

                {/* Sub-page Workspace Canvas */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-6xl animate-in fade-in duration-250">
                        {activeTab === 'dashboard' && (
                            <DashboardTab 
                                staff={staff} 
                                rooms={rooms} 
                                activities={activities} 
                                onTabChange={setActiveTab} 
                            />
                        )}
                        {activeTab === 'staff' && (
                            <StaffTab 
                                staff={staff} 
                                onAddStaff={addStaff} 
                                onSuspendStaff={suspendStaff} 
                                onActivateStaff={activateStaff} 
                                onEditStaff={editStaff}
                            />
                        )}
                        {activeTab === 'packages' && (
                            <PackagesTab 
                                packages={packages} 
                                onAddPackage={addPackage} 
                                onApprovePackage={approvePackage} 
                            />
                        )}
                        {activeTab === 'rooms' && (
                            <RoomsTab 
                                rooms={rooms} 
                                onSetRoomStatus={setRoomStatus} 
                                onAddRoom={addRoom}
                            />
                        )}
                        {activeTab === 'analytics' && (
                            <AnalyticsTab />
                        )}
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
                        {activeTab === 'settings' && (
                            <SettingsTab />
                        )}
                    </div>
                </main>
            </div>

        </div>
    );
};

export default AdminPage;