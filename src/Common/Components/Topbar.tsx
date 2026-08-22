import React, { useState, useMemo } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
  Stethoscope,
  Leaf,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logout } from '../../auth/authSlice';
import { Badge, BadgeVariant } from './Badge';
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
  userAvatar?: string;
  notifications?: TopbarNotification[];
  unreadCount?: number;
  onMenuToggle?: () => void;
  onSignOut?: () => void;
}

interface RoleBadgeConfig {
  label: string;
  variant: BadgeVariant;
  icon: React.ReactNode;
}

/**
 * Derives badge styling and icon based on user role string.
 */
export const getRoleBadgeConfig = (role: string = ''): RoleBadgeConfig => {
  const normalized = role.toLowerCase().replace(/[\s_-]+/g, '');

  if (normalized.includes('doctor') || normalized.includes('physician')) {
    return {
      label: 'Doctor',
      variant: 'success',
      icon: <Stethoscope className="w-3 h-3 text-emerald-700" />,
    };
  }
  if (normalized.includes('therapist')) {
    return {
      label: 'Therapist',
      variant: 'ayur',
      icon: <Sparkles className="w-3 h-3 text-ayur-brown" />,
    };
  }
  if (normalized.includes('admin')) {
    return {
      label: 'Clinic Admin',
      variant: 'info',
      icon: <Shield className="w-3 h-3 text-ayur-primary" />,
    };
  }
  if (normalized.includes('patient')) {
    return {
      label: 'Patient',
      variant: 'success',
      icon: <Leaf className="w-3 h-3 text-emerald-600" />,
    };
  }
  if (normalized.includes('solo')) {
    return {
      label: 'Solo Practitioner',
      variant: 'warning',
      icon: <Sparkles className="w-3 h-3 text-amber-700" />,
    };
  }

  const capitalized = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : 'Staff';
  return {
    label: capitalized,
    variant: 'info',
    icon: <User className="w-3 h-3 text-gray-600" />,
  };
};

/**
 * Extracts 1-2 initials from full name, stripping honorifics cleanly.
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return 'U';
  const cleanName = name
    .replace(/^(Dr\.|Dr|Vaidya|Acharya|Mr\.|Mrs\.|Ms\.)\s+/i, '')
    .trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Topbar: React.FC<TopbarProps> = ({
  clinicName = 'AyurSutra Wellness Center',
  certificationLabel = 'AYUSH Certified',
  adminName = 'Admin Director',
  adminRole = 'Operations',
  adminEmail = 'admin@ayursutra.com',
  userAvatar,
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
  onSignOut,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'profile' | null>(null);
  const dropdownRef = useClickOutside(() => setOpenDropdown(null));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Retrieve User Session Data from Global Redux Auth State
  const reduxUser = useSelector((state: RootState) => state.auth?.user);

  // 2. Fallback to localStorage session keys if Redux is unset
  const sessionUser = useMemo(() => {
    if (reduxUser && (reduxUser.name || reduxUser.role)) {
      return reduxUser;
    }
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') return parsed;
        }
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        const clinicId = localStorage.getItem('clinicId');
        if (name || role || userId) {
          return {
            id: userId || 'u-1',
            name: name || '',
            role: (role as any) || '',
            email: email || '',
            clinicId: clinicId || undefined,
          };
        }
      }
    } catch (e) {
      console.error('Error parsing session data in Topbar:', e);
    }
    return null;
  }, [reduxUser]);

  // 3. Resolve dynamic values with cascade: Session User -> Props -> Fallbacks
  const currentName = sessionUser?.name?.trim() || adminName;
  const currentRole = sessionUser?.role || adminRole;
  const currentEmail = sessionUser?.email?.trim() || adminEmail;
  const currentAvatar = (sessionUser as any)?.avatar || userAvatar;

  const roleConfig = useMemo(() => getRoleBadgeConfig(currentRole), [currentRole]);
  const userInitials = useMemo(() => getInitials(currentName), [currentName]);

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-20 w-full items-center justify-between border-b border-ayur-sand/60 bg-white px-3.5 sm:px-6 md:px-8 shadow-2xs">
      {/* Left: Hamburger (Mobile & Tablet < lg) + Clinic Context */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex lg:hidden min-w-[44px] min-h-[44px] items-center justify-center p-2 rounded-xl border border-ayur-sand/80 text-gray-700 hover:bg-[#fbf9f5] hover:text-ayur-primary transition cursor-pointer shrink-0"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
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

        <h2 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight font-serif truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
          {clinicName}
        </h2>
        <span className="hidden sm:inline-block h-4 w-px bg-ayur-sand/80 shrink-0"></span>
        <Badge
          variant="ayur"
          size="sm"
          icon={<Sparkles className="w-3 h-3 text-ayur-brown" />}
          className="hidden xl:inline-flex shrink-0"
        >
          {certificationLabel}
        </Badge>
      </div>

      {/* Right: Notifications & Profile with dynamic user info */}
      <div ref={dropdownRef} className="flex items-center gap-2 sm:gap-4 shrink-0">
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
            aria-label="Notifications"
            className="relative flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full p-2 text-ayur-green-mid hover:bg-[#fbf9f5] hover:text-ayur-primary transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-ayur-brown text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {openDropdown === 'notifications' && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl border border-ayur-sand/60 bg-white p-4 shadow-xl ring-1 ring-black/5 z-30 animate-in fade-in zoom-in-95 duration-150">
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
                    className="p-2.5 rounded-xl bg-[#fbf9f5] border border-ayur-sand/30 hover:border-ayur-green-mid/30 transition-colors"
                  >
                    <p className="text-xs text-gray-800 font-medium leading-snug">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Section with Dynamic Name, Role Badge, and Avatar */}
        <div className="relative">
          <button
            type="button"
            id="topbar-profile-btn"
            onClick={() =>
              setOpenDropdown((prev) =>
                prev === 'profile' ? null : 'profile'
              )
            }
            className="flex items-center gap-2 sm:gap-3 min-h-[44px] rounded-2xl p-1 sm:p-1.5 hover:bg-[#fbf9f5] transition-all cursor-pointer border border-transparent hover:border-ayur-sand/60"
            aria-label="User Profile Menu"
          >
            {/* Avatar container with live status indicator */}
            <div className="relative shrink-0">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={currentName}
                  className="h-9 w-9 rounded-xl object-cover border border-ayur-sand/80 shadow-2xs"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] font-serif font-bold text-white text-xs border border-ayur-sand/60 shadow-2xs">
                  {userInitials}
                </div>
              )}
              {/* Online Indicator Badge */}
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Online"
              />
            </div>

            {/* Name and Role Info */}
            <div className="hidden md:flex flex-col text-left min-w-0 max-w-[140px] lg:max-w-[180px]">
              <span className="text-xs font-bold text-gray-900 leading-tight font-serif truncate">
                {currentName}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge
                  variant={roleConfig.variant}
                  size="sm"
                  icon={roleConfig.icon}
                  className="text-[10px] py-0 px-1.5 font-bold tracking-tight uppercase truncate"
                >
                  {roleConfig.label}
                </Badge>
              </div>
            </div>

            <ChevronDown
              className={`h-3.5 w-3.5 text-ayur-green-mid hidden sm:block shrink-0 transition-transform duration-200 ${
                openDropdown === 'profile' ? 'rotate-180 text-ayur-primary' : ''
              }`}
            />
          </button>

          {/* Dynamic Profile Dropdown Menu */}
          {openDropdown === 'profile' && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-ayur-sand/60 bg-white p-2.5 shadow-xl ring-1 ring-black/5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="border-b border-gray-100 px-3 py-3 bg-[#fbf9f5]/70 rounded-xl mb-1.5">
                <div className="flex items-center gap-2.5">
                  {currentAvatar ? (
                    <img
                      src={currentAvatar}
                      alt={currentName}
                      className="h-10 w-10 rounded-xl object-cover border border-ayur-sand/80 shadow-2xs shrink-0"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] font-serif font-bold text-white text-sm shadow-xs">
                      {userInitials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 font-serif truncate">
                      {currentName}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {currentEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-ayur-sand/40 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Role
                  </span>
                  <Badge
                    variant={roleConfig.variant}
                    size="sm"
                    icon={roleConfig.icon}
                    className="text-[10px]"
                  >
                    {roleConfig.label}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1">
                <button
                  type="button"
                  id="topbar-signout-btn"
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

export default Topbar;
