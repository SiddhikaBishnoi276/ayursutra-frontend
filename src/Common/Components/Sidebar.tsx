import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  BedDouble,
  BarChart3,
  ShieldCheck,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import ayursutraLogo from '../../assets/ayursutra_logo.png';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  roleTitle?: string;
  adminName?: string;
  adminEmail?: string;
  navItems?: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
  roleTitle = 'Admin Panel',
  adminName = 'Admin Director',
  adminEmail = 'admin@ayursutra.com',
  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'protocols', label: 'Therapy Protocols', icon: FileSpreadsheet },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'analytics', label: 'Clinic Analytics', icon: BarChart3 },
    { id: 'oversight', label: 'System Oversight', icon: ShieldCheck },
    { id: 'questionnaire', label: 'Prakriti Questionnaire', icon: ClipboardList },
  ],
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 md:z-20 flex h-screen flex-col border-r border-ayur-sand/60 bg-white transition-all duration-300 shadow-xs shrink-0 ${
          mobileOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0 ' + (collapsed ? 'md:w-20' : 'md:w-64')
        }`}
      >
        {/* Sidebar Header */}
        <div className="relative flex h-20 items-center justify-between px-5 border-b border-ayur-sand/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={ayursutraLogo}
              alt="AyurSutra Logo"
              className="w-10 h-10 object-contain shrink-0"
            />
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-black text-ayur-primary tracking-tight text-xl leading-none">
                  AyurSutra
                </span>
                <span className="text-[10px] font-bold text-ayur-brown tracking-widest uppercase mt-1">
                  {roleTitle}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapsible toggle button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-ayur-sand/80 bg-[#fbf9f5] text-ayur-green-mid hover:text-ayur-primary hover:bg-white transition-all absolute -right-3 top-7 shadow-xs cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Mobile Close Button */}
          {setMobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex md:hidden p-1.5 rounded-lg text-gray-500 hover:text-ayur-primary hover:bg-gray-100 cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1.5 p-3.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={`flex items-center gap-3.5 w-full rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'bg-ayur-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-[#fbf9f5] hover:text-ayur-primary'
                }`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${
                    isActive ? 'text-white' : 'text-ayur-green-mid'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate tracking-wide">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-ayur-sand/40 bg-[#fbf9f5]/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f7f4] font-bold text-ayur-primary text-xs uppercase border border-ayur-sand/60 font-serif">
              {adminName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-900 truncate leading-tight font-serif">
                  {adminName}
                </span>
                <span className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                  {adminEmail}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
