// src/Patient/Components/NotificationBell.tsx
// Dropdown component for patient notifications, appointment alerts, and doctor update prompts

import React, { useState } from 'react';
import { Bell, Sparkles, X, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../Hooks/useNotifications';
import { useClickOutside } from '../../Common/Hooks/useClickOutside';

export interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, dismissNotification } = useNotifications();
  const dropdownRef = useClickOutside(() => setIsOpen(false));
  const navigate = useNavigate();

  const handleNotificationClick = (actionUrl?: string) => {
    if (actionUrl) {
      navigate(actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-ayur-primary hover:bg-[#fbf9f5] transition cursor-pointer"
        title="Patient Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-700 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-ayur-sand/70 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-gray-100 bg-[#fbf9f5]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <h4 className="text-xs font-bold text-gray-900 font-serif">
                Notifications & Reminders
              </h4>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              {notifications.length} Active
            </span>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                No active notifications or alerts.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.actionUrl)}
                  className={`p-3.5 hover:bg-[#fbf9f5] transition cursor-pointer flex items-start justify-between gap-2.5 ${
                    !notif.read ? 'bg-purple-50/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {notif.type === 'doctor_update' ? (
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </div>
                      ) : notif.type === 'reminder' ? (
                        <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-900 block truncate">
                        {notif.title}
                      </span>
                      <p className="text-[11px] text-gray-600 font-medium leading-tight mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium block mt-1">
                        {notif.time}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notif.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-stone-100 shrink-0"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
