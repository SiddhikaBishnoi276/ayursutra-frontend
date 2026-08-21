// src/Therapist/Pages/SessionQueuePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../Common/Components/Button';
import { EmptyState } from '../../Common/Components/EmptyState';
import { useSessionQueue } from '../Hooks/useSessionQueue';
import { SessionQueueCard } from '../Components/SessionQueueCard';
import { SessionDetailDrawer } from '../Components/SessionDetailDrawer';
import { TherapistSession } from '../types/therapist.types';

export interface SessionQueuePageProps {
  onStartSession?: (session: TherapistSession) => void;
  onResumeSession?: (session: TherapistSession) => void;
}

export const SessionQueuePage: React.FC<SessionQueuePageProps> = ({
  onStartSession,
  onResumeSession,
}) => {
  const navigate = useNavigate();
  const {
    sessions,
    filter,
    setFilter,
    stats,
    refetch,
  } = useSessionQueue();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerSession, setActiveDrawerSession] = useState<TherapistSession | null>(null);

  const handleOpenDrawer = (session: TherapistSession) => {
    setActiveDrawerSession(session);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setActiveDrawerSession(null);
  };

  const handleStart = (session: TherapistSession) => {
    if (onStartSession) {
      onStartSession(session);
    } else {
      navigate(`/therapist/session/${session.id}/start`);
    }
  };

  const handleResume = (session: TherapistSession) => {
    if (onResumeSession) {
      onResumeSession(session);
    } else {
      navigate(`/therapist/session/${session.id}/active`);
    }
  };

  const filterTabs: { id: typeof filter.status; label: string; count: number }[] = [
    { id: 'all', label: 'All Sessions', count: stats.totalToday },
    { id: 'today', label: 'Today', count: stats.totalToday },
    { id: 'upcoming', label: 'Scheduled', count: stats.scheduled },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'flagged', label: 'Flagged Alerts', count: stats.flagged },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-ayur-primary" />
            Therapy Session Queue & Daily Schedule
          </h1>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            Real-time chronological queue of assigned clinical procedures, chamber allocations, and stage continuity.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => refetch()}
        >
          Sync Queue
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-ayur-sand/80 shadow-2xs">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const isActive = filter.status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter({ ...filter, status: tab.id })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-ayur-primary text-white shadow-sm'
                    : 'bg-[#fbf9f5] text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-ayur-sand/70'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
            placeholder="Search patient, package, room..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#fbf9f5] border border-ayur-sand/80 focus:outline-none focus:ring-2 focus:ring-ayur-primary font-medium"
          />
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <EmptyState
          title="No Sessions in Queue"
          message="There are no therapy sessions matching the selected filter criteria."
          icon={<Sparkles className="w-10 h-10 text-ayur-green-mid" />}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilter({ status: 'all', searchQuery: '', categoryFilter: 'all' })}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionQueueCard
              key={session.id}
              session={session}
              onSelect={handleOpenDrawer}
              onStartSession={handleStart}
              onResumeSession={handleResume}
              onViewAlert={handleOpenDrawer}
              onViewNotes={handleOpenDrawer}
            />
          ))}
        </div>
      )}

      {/* Session Detail Drawer */}
      <SessionDetailDrawer
        session={activeDrawerSession}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onStartSession={handleStart}
        onResumeSession={handleResume}
        onViewNotes={handleOpenDrawer}
      />
    </div>
  );
};

export default SessionQueuePage;
