// src/Therapist/Components/AvailabilityCalendar.tsx
import React from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Button } from '../../Common/Components/Button';

export interface AvailabilityCalendarProps {
  viewMode: 'week' | 'month';
  onViewModeChange: (mode: 'week' | 'month') => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  blockedSlots: { date: string; slot: string; reason: string; isFullDayLeave?: boolean }[];
  onAddBlockedSlot: () => void;
  onRemoveBlockedSlot: (index: number) => void;
  isTodayAvailable: boolean;
  onToggleTodayAvailability: () => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  viewMode,
  onViewModeChange,
  selectedDate,
  onSelectDate,
  blockedSlots = [],
  onAddBlockedSlot,
  onRemoveBlockedSlot,
  isTodayAvailable,
  onToggleTodayAvailability,
}) => {
  // Generate current week days
  const weekDays = [
    { name: 'Mon', date: '2026-08-17', dayNum: '17' },
    { name: 'Tue', date: '2026-08-18', dayNum: '18' },
    { name: 'Wed', date: '2026-08-19', dayNum: '19' },
    { name: 'Thu', date: '2026-08-20', dayNum: '20' },
    { name: 'Fri', date: '2026-08-21', dayNum: '21', isToday: true },
    { name: 'Sat', date: '2026-08-22', dayNum: '22' },
    { name: 'Sun', date: '2026-08-23', dayNum: '23' },
  ];

  // Month days generator for August 2026
  const monthDays = Array.from({ length: 31 }, (_, i) => {
    const d = i + 1;
    const dateStr = `2026-08-${d.toString().padStart(2, '0')}`;
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      new Date(2026, 7, d).getDay()
    ];
    return {
      dayNum: d,
      date: dateStr,
      dayOfWeek,
      isToday: dateStr === '2026-08-21',
    };
  });

  return (
    <Card className="flex flex-col gap-6 border border-ayur-sand/80">
      {/* Top Controls: Week/Month toggle & Quick Today Availability Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-black text-gray-900 font-serif flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-ayur-primary" />
            Duty Availability & Leave Schedule
          </h3>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Synchronized directly with Scheduling Engine Filter 3 to prevent auto-assignment on leave.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Leave Toggle */}
          <button
            type="button"
            onClick={onToggleTodayAvailability}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-serif transition-all flex items-center gap-2 cursor-pointer ${
              isTodayAvailable
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-rose-50 text-rose-900 border border-rose-300'
            }`}
          >
            {isTodayAvailable ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Available Today
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-600" />
                Marked Off-Duty Today
              </>
            )}
          </button>

          {/* View Toggle */}
          <div className="flex bg-[#fbf9f5] p-1 rounded-xl border border-ayur-sand/70">
            <button
              type="button"
              onClick={() => onViewModeChange('week')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-ayur-primary text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('month')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-ayur-primary text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month View
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDate === day.date;
            const hasBlocks = blockedSlots.filter((b) => b.date === day.date);

            return (
              <div
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between min-h-[7rem] ${
                  isSelected
                    ? 'bg-emerald-50/70 border-ayur-primary shadow-xs ring-1 ring-ayur-primary/20'
                    : day.isToday
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-[#fbf9f5]/50 border-ayur-sand/70 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    {day.name}
                  </span>
                  <span
                    className={`text-lg font-black font-serif block mt-0.5 ${
                      day.isToday ? 'text-amber-800' : 'text-gray-900'
                    }`}
                  >
                    {day.dayNum}
                  </span>
                </div>

                <div className="w-full mt-2">
                  {hasBlocks.length > 0 ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 block text-center truncate">
                      {hasBlocks[0].slot === 'Full Day' ? 'Leave' : 'Blocked'}
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 block text-center truncate">
                      Available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center font-bold text-gray-400 text-[10px] uppercase py-1">
              {d}
            </div>
          ))}
          {monthDays.map((day) => {
            const isSelected = selectedDate === day.date;
            const hasBlocks = blockedSlots.filter((b) => b.date === day.date);

            return (
              <div
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-between min-h-[4.5rem] ${
                  isSelected
                    ? 'bg-emerald-50/70 border-ayur-primary font-bold shadow-xs'
                    : day.isToday
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-white border-gray-150 hover:bg-[#fbf9f5]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-serif font-bold text-gray-800">{day.dayNum}</span>
                  {day.isToday && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600" title="Today" />
                  )}
                </div>
                {hasBlocks.length > 0 && (
                  <span className="text-[8px] font-bold text-rose-700 bg-rose-50 px-1 rounded truncate w-full text-center">
                    {hasBlocks[0].slot === 'Full Day' ? 'Off' : 'Block'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Blocked Slots List for Selected Date */}
      <div className="bg-[#fbf9f5] p-4 rounded-2xl border border-ayur-sand/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold font-serif text-gray-900 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-ayur-primary" />
            Blocked Slots & Leaves on <strong>{selectedDate}</strong>
          </span>

          <Button variant="primary" size="sm" icon={<Plus className="w-3 h-3" />} onClick={onAddBlockedSlot}>
            Mark Leave / Block Slot
          </Button>
        </div>

        {blockedSlots.length === 0 ? (
          <p className="text-xs text-gray-500 font-medium py-3 text-center">
            No leave or blocked slots registered. Full day is open for automated scheduling.
          </p>
        ) : (
          <div className="space-y-2">
            {blockedSlots.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-ayur-sand/70 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <div>
                    <span className="font-bold font-serif text-gray-900">
                      {item.date} — {item.slot}
                    </span>
                    <span className="text-[11px] text-gray-500 block">{item.reason}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveBlockedSlot(idx)}
                  className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  title="Remove Block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AvailabilityCalendar;
