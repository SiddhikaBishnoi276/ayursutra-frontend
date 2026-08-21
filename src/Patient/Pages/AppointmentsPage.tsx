// src/Patient/Pages/AppointmentsPage.tsx
// Screen 3: Tabbed Appointments Management (Upcoming, Completed, Cancelled) with Calendar Export & Feedback Triggers

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { EmptyState } from '../../Common/Components/EmptyState';
import { Skeleton } from '../../Common/Components/Skeleton';
import { BackButton } from '../../Common/Components/BackButton';

import { useMyAppointments } from '../Hooks/useMyAppointments';
import { useFeedbackSubmit } from '../Hooks/useFeedbackSubmit';
import { AppointmentHistoryCard } from '../Components/AppointmentHistoryCard';
import { FeedbackFormModal } from '../Components/FeedbackFormModal';
import { formatDate, generateCalendarIcs } from '../Services/patientService';

type AppointmentTab = 'upcoming' | 'completed' | 'cancelled';

export const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppointmentTab>('upcoming');
  const { upcoming, completed, cancelled, isLoading } = useMyAppointments();
  const {
    isModalOpen,
    selectedAppointment,
    openFeedbackModal,
    closeFeedbackModal,
    submit,
    isLoading: isSubmittingFeedback,
    submittedMessage,
    clearSubmittedMessage,
  } = useFeedbackSubmit();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-14" />
        <Skeleton variant="card" className="h-44" />
        <Skeleton variant="card" className="h-44" />
      </div>
    );
  }

  const tabCounts = {
    upcoming: upcoming.length,
    completed: completed.length,
    cancelled: cancelled.length,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/dashboard" label="Dashboard" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif tracking-tight">
              My Therapy Appointments
            </h1>
            <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
              Track upcoming procedures, review therapist session notes, and export calendar reminders
            </p>
          </div>
        </div>
      </div>

      {/* 2. Success Alert when feedback is submitted */}
      {submittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">{submittedMessage}</span>
          </div>
          <button
            type="button"
            onClick={clearSubmittedMessage}
            className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Filter Tabs (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto flex-nowrap -mx-1 px-1 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${
            activeTab === 'upcoming'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <span>Upcoming Sessions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'upcoming' ? 'bg-purple-900 text-white' : 'bg-stone-100 text-gray-700'
            }`}
          >
            {tabCounts.upcoming}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${
            activeTab === 'completed'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <span>Completed History</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'completed' ? 'bg-purple-900 text-white' : 'bg-stone-100 text-gray-700'
            }`}
          >
            {tabCounts.completed}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${
            activeTab === 'cancelled'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-stone-100 border border-stone-200/80'
          }`}
        >
          <span>Cancelled / Missed</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === 'cancelled' ? 'bg-purple-900 text-white' : 'bg-stone-100 text-gray-700'
            }`}
          >
            {tabCounts.cancelled}
          </span>
        </button>
      </div>

      {/* 4. Tab Content */}

      {/* TAB 1: UPCOMING SESSIONS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcoming.length === 0 ? (
            <EmptyState
              title="No Upcoming Appointments"
              message="You have completed all scheduled appointments for the current protocol phase."
              icon={<Calendar className="w-6 h-6 text-purple-700" />}
            />
          ) : (
            upcoming.map((session, idx) => (
              <Card
                key={session.id}
                className={`border p-5 sm:p-6 transition-all ${
                  idx === 0
                    ? 'border-purple-300/90 bg-gradient-to-r from-white via-purple-50/15 to-white shadow-xs'
                    : 'border-stone-200/90 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          <Sparkles className="w-3 h-3" /> Next Up
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-ayur-brown uppercase tracking-wider">
                        Day {session.dayNumber} • {session.stageCategory}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-serif">
                      {session.stageName}
                    </h3>
                  </div>

                  <Badge variant="info" size="md">
                    Scheduled
                  </Badge>
                </div>

                {/* Session Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/60">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">
                      Date
                    </span>
                    <span className="font-bold text-gray-900 block mt-0.5">
                      {formatDate(session.date)}
                    </span>
                  </div>

                  <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/60">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">
                      Time & Duration
                    </span>
                    <span className="font-bold text-gray-900 block mt-0.5">
                      {session.time} ({session.durationMinutes}m)
                    </span>
                  </div>

                  <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/60">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">
                      Chamber
                    </span>
                    <span className="font-bold text-gray-900 block mt-0.5">
                      {session.roomNumber}
                    </span>
                  </div>

                  <div className="p-3 bg-[#fbf9f5] rounded-xl border border-ayur-sand/60">
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">
                      Assigned Therapist
                    </span>
                    <span className="font-bold text-gray-900 block mt-0.5 truncate">
                      {session.therapistName}
                    </span>
                  </div>
                </div>

                {/* Pre-care notes */}
                {session.preCareNotes && session.preCareNotes.length > 0 && (
                  <div className="mt-3.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-950 font-serif block mb-1">
                      Preparation Note:
                    </span>
                    <ul className="list-disc list-inside text-amber-900 space-y-0.5 text-[11px] font-medium">
                      {session.preCareNotes.map((note, noteIdx) => (
                        <li key={noteIdx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer with Add to Calendar CTA */}
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-500 font-medium">
                    Please arrive 15 minutes before your scheduled slot.
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => generateCalendarIcs(session)}
                    icon={<Download className="w-3.5 h-3.5 text-purple-700" />}
                    className="hover:border-purple-300 font-bold"
                  >
                    Add to Calendar (.ics)
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 2: COMPLETED HISTORY */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completed.length === 0 ? (
            <EmptyState
              title="No Completed Sessions Yet"
              message="Your session records and therapist progress summaries will appear here once procedures begin."
              icon={<Clock className="w-6 h-6 text-gray-400" />}
            />
          ) : (
            completed.map((apt) => (
              <AppointmentHistoryCard
                key={apt.id}
                appointment={apt}
                onGiveFeedback={openFeedbackModal}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 3: CANCELLED / MISSED */}
      {activeTab === 'cancelled' && (
        <div className="space-y-4">
          {cancelled.length === 0 ? (
            <EmptyState
              title="No Cancelled Sessions"
              message="Great! You have zero missed or cancelled appointments in your therapy history."
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
            />
          ) : (
            cancelled.map((apt) => (
              <Card
                key={apt.id}
                className="border border-rose-200 bg-rose-50/20 p-5 rounded-2xl shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-rose-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="danger" size="sm">
                        Cancelled Session
                      </Badge>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatDate(apt.date)} at {apt.time}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 font-serif">
                      {apt.stageName}
                    </h4>
                  </div>

                  <span className="text-xs font-semibold text-gray-500">
                    {apt.roomNumber}
                  </span>
                </div>

                {apt.cancellationReason && (
                  <div className="mt-3 p-3 rounded-xl bg-white border border-rose-200 text-xs">
                    <span className="font-bold text-rose-950 font-serif block mb-0.5">
                      Reason for Cancellation:
                    </span>
                    <p className="text-rose-800 font-medium text-[11px]">
                      {apt.cancellationReason}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-600 font-medium">
                    To reschedule or adjust therapy dates, contact clinic reception.
                  </span>

                  <a
                    href="tel:+919822089100"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-gray-800 hover:bg-stone-100 transition shadow-2xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                    <span>Call Reception (+91 98220 89100)</span>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* 5. Feedback Form Modal */}
      <FeedbackFormModal
        isOpen={isModalOpen}
        onClose={closeFeedbackModal}
        appointment={selectedAppointment}
        onSubmit={submit}
        isLoading={isSubmittingFeedback}
      />
    </div>
  );
};

export default AppointmentsPage;
