// src/Patient/Pages/FeedbackPage.tsx
// Screen 4: Post-Session Feedback Hub, Pending Reviews, and Ratings History

import React from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  User,
  Activity,
} from 'lucide-react';
import { Card } from '../../Common/Components/Card';
import { Badge } from '../../Common/Components/Badge';
import { Button } from '../../Common/Components/Button';
import { EmptyState } from '../../Common/Components/EmptyState';
import { Skeleton } from '../../Common/Components/Skeleton';
import { BackButton } from '../../Common/Components/BackButton';

import { useMyAppointments } from '../Hooks/useMyAppointments';
import { useFeedbackSubmit } from '../Hooks/useFeedbackSubmit';
import { FeedbackFormModal } from '../Components/FeedbackFormModal';
import { formatDate } from '../Services/patientService';
import feedbackHistoryMock from '../data/myFeedback.json';

export const FeedbackPage: React.FC = () => {
  const { pendingFeedbackSessions, completed, isLoading } = useMyAppointments();
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

  // Completed sessions with feedback submitted
  const submittedSessions = completed.filter((apt) => apt.feedbackSubmitted);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="card" className="h-20" />
        <Skeleton variant="card" className="h-44" />
        <Skeleton variant="card" className="h-44" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <BackButton to="/patient/dashboard" label="Dashboard" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-serif tracking-tight">
              Therapy Feedback & Ratings
            </h1>
            <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
              Review completed Panchakarma sessions, rate therapist care, and track your clinical improvement
            </p>
          </div>
        </div>
      </div>

      {/* 2. Success Alert Banner */}
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

      {/* 3. Pending Feedback Section (If any session awaiting feedback) */}
      {pendingFeedbackSessions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-gray-900 font-serif">
              Pending Session Feedback ({pendingFeedbackSessions.length})
            </h2>
            <Badge variant="warning" size="sm">
              Action Needed
            </Badge>
          </div>

          <div className="space-y-3">
            {pendingFeedbackSessions.map((session) => (
              <Card
                key={session.id}
                className="border-2 border-purple-200/80 bg-gradient-to-r from-purple-50/30 via-white to-white p-5 sm:p-6 shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-purple-100">
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-0.5">
                      Day {session.dayNumber} • {session.stageCategory}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 font-serif">
                      {session.stageName}
                    </h3>
                  </div>

                  <span className="text-xs text-gray-500 font-medium">
                    Completed on {formatDate(session.date)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-purple-700" />
                      <span>Therapist: <strong className="text-gray-900">{session.therapistName}</strong></span>
                    </div>
                    {session.vasScoreBefore !== undefined && session.vasScoreAfter !== undefined && (
                      <div className="flex items-center gap-1.5 font-medium">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span>VAS: {session.vasScoreBefore} → {session.vasScoreAfter}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openFeedbackModal(session)}
                    icon={<Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
                    className="bg-purple-700 hover:bg-purple-800"
                  >
                    Rate & Review Session
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. Feedback History List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 font-serif">
            Submitted Feedback History ({submittedSessions.length + feedbackHistoryMock.length})
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            Confidential clinical reviews
          </span>
        </div>

        {submittedSessions.length === 0 && feedbackHistoryMock.length === 0 ? (
          <EmptyState
            title="No Feedback Submitted Yet"
            message="Your reviews and session improvement ratings will be archived here."
            icon={<MessageSquare className="w-6 h-6 text-purple-700" />}
          />
        ) : (
          <div className="space-y-3">
            {/* Realtime submitted items */}
            {submittedSessions.map((apt) => (
              <Card
                key={apt.id}
                className="border border-ayur-sand/60 p-5 bg-white shadow-2xs hover:border-purple-300 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[11px] font-bold text-ayur-brown uppercase tracking-wider block mb-0.5">
                      Day {apt.dayNumber} • {apt.stageCategory}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 font-serif">
                      {apt.stageName}
                    </h4>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          (apt.feedbackRating || 5) >= s
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-900 ml-1">
                      {apt.feedbackRating || 5}.0
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-600 space-y-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <span>
                      Therapist: <strong className="text-gray-900">{apt.therapistName}</strong>
                    </span>
                    <span>
                      Date: <strong className="text-gray-900">{formatDate(apt.date)}</strong>
                    </span>
                  </div>

                  {apt.therapistNotesSummary && (
                    <p className="text-gray-700 text-[11px] leading-relaxed bg-[#fbf9f5] p-3 rounded-xl border border-ayur-sand/50">
                      &quot;{apt.therapistNotesSummary}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submitted & Verified
                  </span>
                  <span>Stored in Medical Journal</span>
                </div>
              </Card>
            ))}

            {/* Static Historical Feedback Mock Items if not duplicated */}
            {feedbackHistoryMock.map((fb) => (
              <Card
                key={fb.id}
                className="border border-ayur-sand/60 p-5 bg-white shadow-2xs hover:border-purple-300 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <h4 className="text-base font-bold text-gray-900 font-serif">
                      {fb.stageName}
                    </h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Conducted with <strong className="text-gray-800">{fb.therapistName}</strong> on {formatDate(fb.date)}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          fb.rating >= s
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-900 ml-1">
                      {fb.rating}.0
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="ayur" size="sm">
                      {fb.overallExperience}
                    </Badge>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Post-Session VAS: <strong>{fb.symptomImprovementScore}/10</strong>
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-medium bg-[#fbf9f5] p-3 rounded-xl border border-ayur-sand/50">
                    &quot;{fb.comments}&quot;
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Patient Review
                  </span>
                  <span>Submitted: {formatDate(fb.submittedAt)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

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

export default FeedbackPage;
