import { useState } from 'react';
import { Bell, User, LogOut, Settings, Shield, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationLog } from '../types/admin.types';

interface TopbarProps {
    notifications: NotificationLog[];
    onRetryNotification: (id: string) => void;
    onTabChange: (tab: string) => void;
}

export const Topbar = ({ notifications, onRetryNotification, onTabChange }: TopbarProps) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const navigate = useNavigate();

    const failedNotifs = notifications.filter(n => n.status === 'Failed');

    // Scoped admin alerts list
    const adminAlerts = [
        {
            id: 'alert-1',
            type: 'failed_sms',
            message: 'Credentials SMS failed to deliver to Rahul Verma',
            time: '18:45 today',
            actionTab: 'oversight'
        },
        {
            id: 'alert-2',
            type: 'audit_required',
            message: 'Dr. Ravi Sharma submitted "Nasya Cleansing Template" for audit',
            time: '13:15 today',
            actionTab: 'oversight'
        },
        {
            id: 'alert-3',
            type: 'complication',
            message: 'Pooja Nair flagged patient complication in Room 102',
            time: '11:00 today',
            actionTab: 'dashboard'
        }
    ];

    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
            
            {/* Left: Clinic Context */}
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800 tracking-wide">AyurSutra Wellness Center</span>
                <span className="h-4 w-[1px] bg-slate-200"></span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                    AYUSH Certified
                </span>
            </div>

            {/* Right: Notifications & Profile */}
            <div className="flex items-center gap-4">
                
                {/* Notification Dropdown Button */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setNotificationsOpen(!notificationsOpen);
                            setProfileOpen(false);
                        }}
                        title="Operations Alerts & Notifications"
                        tabIndex={0}
                        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-850 transition focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    >
                        <Bell className="h-5 w-5" />
                        {adminAlerts.length > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                                {adminAlerts.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Panel */}
                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h4 className="font-bold text-slate-800 text-sm">Operations Alerts</h4>
                                <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200/50">
                                    {adminAlerts.length} Critical
                                </span>
                            </div>
                            <div className="mt-3 flex flex-col gap-2.5 max-h-64 overflow-y-auto">
                                {adminAlerts.map((alert) => (
                                    <div 
                                        key={alert.id} 
                                        className="flex flex-col gap-1 rounded-xl bg-slate-50 p-2.5 hover:bg-slate-100/50 cursor-pointer border border-slate-100 transition"
                                        onClick={() => {
                                            onTabChange(alert.actionTab);
                                            setNotificationsOpen(false);
                                        }}
                                    >
                                        <p className="text-xs font-semibold text-slate-700 leading-snug">
                                            {alert.message}
                                        </p>
                                        <span className="text-[9px] font-medium text-slate-400">{alert.time}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                                <button 
                                    onClick={() => {
                                        onTabChange('oversight');
                                        setNotificationsOpen(false);
                                    }}
                                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline transition"
                                >
                                    Open System Oversight Log
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vertical Divider */}
                <span className="h-6 w-[1px] bg-slate-200"></span>

                {/* Profile Dropdown Button */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setProfileOpen(!profileOpen);
                            setNotificationsOpen(false);
                        }}
                        title="Admin Profile Menu"
                        tabIndex={0}
                        className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-800 to-teal-900 text-sm font-bold text-white shadow-xs">
                            AD
                        </div>
                        <div className="hidden md:flex flex-col items-start text-left">
                            <span className="text-xs font-bold text-slate-800 leading-none">Admin Director</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 leading-none">Operations</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>

                    {/* Profile Dropdown Panel */}
                    {profileOpen && (
                        <div className="absolute right-0 mt-2.5 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="border-b border-slate-100 px-3.5 py-2.5">
                                <p className="text-xs font-bold text-slate-800">Super Administrator</p>
                                <p className="text-[10px] text-slate-400 truncate">admin@ayursutra.com</p>
                            </div>
                            <div className="flex flex-col gap-0.5 p-1">
                                <button 
                                    onClick={() => {
                                        onTabChange('settings');
                                        setProfileOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-650 hover:bg-slate-50 transition"
                                >
                                    <User className="h-4 w-4 text-slate-400" />
                                    Clinic Profile
                                </button>
                                <button 
                                    onClick={() => {
                                        onTabChange('settings');
                                        setProfileOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-650 hover:bg-slate-50 transition"
                                >
                                    <Settings className="h-4 w-4 text-slate-400" />
                                    System Settings
                                </button>
                            </div>
                            <div className="border-t border-slate-100 p-1">
                                <button 
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate('/');
                                    }}
                                    className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-650 hover:bg-red-50 hover:text-red-700 transition"
                                >
                                    <LogOut className="h-4 w-4 text-red-400" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};
