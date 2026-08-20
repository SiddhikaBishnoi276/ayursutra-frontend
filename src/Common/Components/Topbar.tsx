import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './Badge';
import { useClickOutside } from '../Hooks/useClickOutside';

export interface TopbarNotification {
  id: string;
  message: string;
  time: string;
}

export interface TopbarProps {
  clinicName?: string;
  certificationLabel?: string;
  adminName?: string;
  adminRole?: string;
  adminEmail?: string;
  notifications?: TopbarNotification[];
  unreadCount?: number;
  onMenuToggle?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  clinicName = 'AyurSutra Wellness Center',
  certificationLabel = 'AYUSH Certified',
  adminName = 'Admin Director',
  adminRole = 'Operations',
  adminEmail = 'admin@ayursutra.com',
  notifications = [
    {
      id: 'n1',
      message: 'Complication flagged in Room 102 during Swedana session',
      time: '3 hours ago',
    },
    {
      id: 'n2',
      message: 'Failed SMS delivery for Patient credentials (Rahul Verma)',
      time: 'Yesterday',
    },
  ],
  unreadCount = 2,
  onMenuToggle,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null);
  const dropdownRef = useClickOutside(() => setOpenDropdown(null));
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 w-full items-center justify-between border-b border-ayur-sand/60 bg-white px-4 sm:px-6 md:px-8 shadow-2xs">
      {/* Left: Hamburger (Mobile) + Clinic Context */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex md:hidden p-2 rounded-xl border border-ayur-sand/80 text-gray-700 hover:bg-[#fbf9f5] hover:text-ayur-primary transition cursor-pointer"
            title="Open Navigation Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight font-serif truncate max-w-[200px] sm:max-w-none">
          {clinicName}
        </h2>
        <span className="hidden sm:inline-block h-4 w-px bg-ayur-sand/80"></span>
        <Badge
          variant="ayur"
          size="sm"
          icon={<Sparkles className="w-3 h-3 text-ayur-brown" />}
          className="hidden lg:inline-flex"
        >
          {certificationLabel}
        </Badge>
      </div>

      {/* Right: Notifications & Profile with unified click outside container */}
      <div ref={dropdownRef} className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'notifications' ? null : 'notifications'
              )
            }
            title="Operations Alerts & Notifications"
            className="relative rounded-full p-2 text-ayur-green-mid hover:bg-[#fbf9f5] hover:text-ayur-primary transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-ayur-brown text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {openDropdown === 'notifications' && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-ayur-sand/60 bg-white p-4 shadow-xl ring-1 ring-black/5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h4 className="font-serif font-bold text-gray-900 text-sm">
                  Operations Alerts
                </h4>
                <Badge variant="warning" size="sm">
                  {unreadCount} Alerts
                </Badge>
              </div>
              <div className="mt-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/40 text-xs"
                  >
                    <p className="font-semibold text-gray-800 leading-snug">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="h-6 w-px bg-ayur-sand/60"></span>

        {/* Admin Profile Chip */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'profile' ? null : 'profile'
              )
            }
            className="flex items-center gap-3 rounded-2xl p-1.5 hover:bg-[#fbf9f5] transition-colors cursor-pointer border border-transparent hover:border-ayur-sand/60"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ayur-primary text-xs font-bold text-white shadow-xs font-serif">
              {adminName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-none font-serif">
                {adminName}
              </span>
              <span className="text-[11px] text-ayur-green-mid font-medium mt-0.5 leading-none">
                {adminRole}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-ayur-green-mid" />
          </button>

          {/* Profile Dropdown Menu */}
          {openDropdown === 'profile' && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-ayur-sand/60 bg-white p-2 shadow-xl ring-1 ring-black/5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-gray-100 px-3.5 py-2.5">
                <p className="text-xs font-bold text-gray-900 font-serif">
                  {adminName}
                </p>
                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                  {adminEmail}
                </p>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
