// src/Therapist/Pages/AvailabilityPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Lock,
} from 'lucide-react';
import { BackButton } from '../../Common/Components/BackButton';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { Modal } from '../../Common/Components/Modal';
import { AvailabilityCalendar } from '../Components/AvailabilityCalendar';
import { useAvailability } from '../Hooks/useAvailability';

export interface AvailabilityPageProps {
  onBack?: () => void;
}

export const AvailabilityPage: React.FC<AvailabilityPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    isTodayAvailable,
    blockedSlots,
    profile,
    workload,
    isLeaveModalOpen,
    setIsLeaveModalOpen,
    leaveReason,
    setLeaveReason,
    slotTime,
    setSlotTime,
    isFullDay,
    setIsFullDay,
    toggleTodayAvailability,
    addLeaveOrBlock,
    removeBlockedSlot,
  } = useAvailability();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/therapist/dashboard');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleBack} label="Back to Dashboard" />
          <div>
            <h1 className="text-2xl font-serif font-black text-gray-900 tracking-tight">
              Duty Availability & Personal Workload
            </h1>
            <p className="text-xs text-ayur-green-mid font-medium">
              Manage scheduled off-duty hours, view verified specializations, and track clinic productivity.
            </p>
          </div>
        </div>

        <Badge variant="ayur" size="md">
          Scheduling Engine Connected
        </Badge>
      </div>

      {/* 1. Read-Only Admin-Created Profile Card */}
      <Card className="border border-ayur-sand/80 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Bio */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1b3b2b] text-white font-serif font-black text-xl shadow-md shrink-0">
              {profile?.name
                ? profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                : 'SK'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg sm:text-xl font-serif font-black text-gray-900">
                  {profile?.name || 'Dr. Sandeep Kulkarni'}
                </h2>
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-700" />}>
                  Admin Verified
                </Badge>
                <Badge variant="ayur" size="sm">
                  {profile?.gender || 'Male'}
                </Badge>
              </div>

              <p className="text-xs text-gray-500 font-medium">
                {profile?.email || 'sandeep.kulkarni@ayursutra.com'} • {profile?.phone || '+91 98450 11223'}
              </p>

              {/* Specialization Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">
                  Certifications:
                </span>
                {(profile?.specializations || ['Kati Basti', 'Sarvanga Abhyanga', 'Virechana Karma', 'Pinda Sweda']).map(
                  (spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#fbf9f5] border border-ayur-sand/80 text-[11px] font-bold text-ayur-primary font-serif"
                    >
                      {spec}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right: Meta & Read-Only Notice */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 p-3.5 rounded-2xl bg-[#fbf9f5] border border-ayur-sand/60 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">
                Assigned Chamber
              </span>
              <span className="font-serif font-black text-gray-900 text-xs">
                {profile?.assignedChamber || 'Chamber 2 (Swedana Shala)'}
              </span>
            </div>

            <div className="text-left lg:text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">
                Shift Timing
              </span>
              <span className="text-xs text-gray-700 font-semibold">
                {profile?.shiftHours || '07:00 AM – 06:00 PM'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
              <Lock className="w-3 h-3" />
              <span>Admin-Managed Profile</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Interactive Duty Availability Calendar */}
      <AvailabilityCalendar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        blockedSlots={blockedSlots}
        onAddBlockedSlot={() => setIsLeaveModalOpen(true)}
        onRemoveBlockedSlot={removeBlockedSlot}
        isTodayAvailable={isTodayAvailable}
        onToggleTodayAvailability={toggleTodayAvailability}
      />

      {/* 3. Personal Workload Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-ayur-sand/80">
          <span className="text-[10px] font-bold uppercase text-ayur-green-mid tracking-wider block">
            Avg Session Duration
          </span>
          <div className="text-2xl font-black text-gray-900 font-serif my-1">
            {workload?.avgSessionDurationMinutes || 52} mins
          </div>
          <p className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            Consistent with classical protocol guidelines.
          </p>
        </Card>

        <Card className="border border-ayur-sand/80">
          <span className="text-[10px] font-bold uppercase text-ayur-green-mid tracking-wider block">
            No-Show Rate
          </span>
          <div className="text-2xl font-black text-emerald-800 font-serif my-1">
            {workload?.noShowRatePercent || 1.4}%
          </div>
          <p className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            High patient adherence & follow-through.
          </p>
        </Card>

        <Card className="border border-ayur-sand/80">
          <span className="text-[10px] font-bold uppercase text-ayur-green-mid tracking-wider block">
            Completed This Month
          </span>
          <div className="text-2xl font-black text-ayur-primary font-serif my-1">
            {workload?.totalCompletedThisMonth || 68} Sessions
          </div>
          <p className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            Across Swedana, Kati Basti, and Shirodhara.
          </p>
        </Card>

        <Card className="border border-ayur-sand/80">
          <span className="text-[10px] font-bold uppercase text-ayur-green-mid tracking-wider block">
            Punctuality Score
          </span>
          <div className="text-2xl font-black text-amber-800 font-serif my-1">
            {workload?.punctualityScorePercent || 99.2}%
          </div>
          <p className="text-[11px] text-gray-500 font-medium pt-2 border-t border-gray-100">
            Zero telemetry session dropouts.
          </p>
        </Card>
      </div>

      {/* Mark Leave / Block Slot Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Schedule Duty Block / Leave Request"
        subtitle={`Select time slot or full-day leave on ${selectedDate}`}
        maxWidth="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={addLeaveOrBlock}
              disabled={!leaveReason.trim()}
            >
              Save Duty Block
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-serif font-bold text-gray-900 mb-1">
              Leave Duration Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsFullDay(true)}
                className={`p-3 rounded-xl border text-center font-serif font-bold cursor-pointer transition ${isFullDay
                  ? 'bg-ayur-primary text-white border-ayur-primary'
                  : 'bg-[#fbf9f5] text-gray-700 border-ayur-sand/70'
                  }`}
              >
                Full Day Leave
              </button>
              <button
                type="button"
                onClick={() => setIsFullDay(false)}
                className={`p-3 rounded-xl border text-center font-serif font-bold cursor-pointer transition ${!isFullDay
                  ? 'bg-ayur-primary text-white border-ayur-primary'
                  : 'bg-[#fbf9f5] text-gray-700 border-ayur-sand/70'
                  }`}
              >
                Partial Time-Block
              </button>
            </div>
          </div>

          {!isFullDay && (
            <div>
              <label className="block font-serif font-bold text-gray-900 mb-1">
                Time Interval
              </label>
              <input
                type="text"
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                placeholder="e.g. 02:00 PM – 04:00 PM"
                className="w-full rounded-xl border border-ayur-sand/80 p-2.5 text-xs bg-[#fbf9f5] focus:outline-none focus:ring-2 focus:ring-ayur-primary"
              />
            </div>
          )}

          <div>
            <label className="block font-serif font-bold text-gray-900 mb-1">
              Reason for Absence / Block *
            </label>
            <input
              type="text"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              placeholder="e.g. Scheduled Weekly Off, Medical Leave, CME Workshop..."
              className="w-full rounded-xl border border-ayur-sand/80 p-2.5 text-xs bg-[#fbf9f5] focus:outline-none focus:ring-2 focus:ring-ayur-primary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AvailabilityPage;
