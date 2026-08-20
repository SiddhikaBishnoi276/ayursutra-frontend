// src/Therapist/Components/LiveSessionTimer.tsx
import React from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Wifi,
  WifiOff,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../Common/Components/Badge';
import { formatDurationSeconds } from '../Services/therapistService';

export interface LiveSessionTimerProps {
  secondsElapsed: number;
  isRunning: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  targetMinutes?: number;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onToggleSimulatedOffline?: () => void;
  className?: string;
}

export const LiveSessionTimer: React.FC<LiveSessionTimerProps> = ({
  secondsElapsed,
  isRunning,
  isOnline,
  isSyncing,
  targetMinutes = 60,
  onStart,
  onPause,
  onReset,
  onToggleSimulatedOffline,
  className = '',
}) => {
  const targetSeconds = targetMinutes * 60;
  const progressPercent = Math.min(100, Math.round((secondsElapsed / targetSeconds) * 100));

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b3b2b] via-[#0c2f21] to-[#062016] text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40 ${className}`}
    >
      {/* Decorative background aura */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-emerald-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-800/80 text-emerald-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block font-serif">
              Procedure Heartbeat Timer
            </span>
            <span className="text-[11px] text-emerald-400/80 font-medium">
              Client-side fail-safe telemetry active
            </span>
          </div>
        </div>

        {/* Online / Offline / Sync Status Indicator */}
        <div className="flex items-center gap-3">
          {isSyncing ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Syncing…</span>
            </div>
          ) : isOnline ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Online (Live Sync)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold">
              <WifiOff className="w-3 h-3 text-rose-400" />
              <span>Offline (Tracking Locally)</span>
            </div>
          )}

          {/* Offline simulator toggle button for edge case verification */}
          {onToggleSimulatedOffline && (
            <button
              type="button"
              onClick={onToggleSimulatedOffline}
              className="text-[10px] font-bold text-emerald-300/80 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
              title="Toggle simulated network drop to test offline resilience"
            >
              [Simulate {isOnline ? 'Offline' : 'Online'}]
            </button>
          )}
        </div>
      </div>

      {/* Main Clock Face & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 my-6 relative z-10">
        {/* Large Digital Timer */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-black tracking-tight text-4xl sm:text-6xl text-emerald-50 drop-shadow-sm font-mono">
              {formatDurationSeconds(secondsElapsed)}
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Elapsed
            </span>
          </div>
          <span className="text-xs text-emerald-300/70 font-medium mt-1">
            Target protocol window: {targetMinutes} minutes ({formatDurationSeconds(targetSeconds)})
          </span>
        </div>

        {/* Quick Timer Controls */}
        <div className="flex items-center gap-3">
          {isRunning ? (
            <button
              type="button"
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-gray-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-md cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-400 text-gray-950 font-bold text-sm hover:bg-emerald-300 transition-all shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Resume
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-2xl bg-emerald-950/80 text-emerald-300 hover:text-white border border-emerald-800/80 hover:bg-emerald-900 transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="relative z-10 space-y-2">
        <div className="flex justify-between text-xs font-medium text-emerald-300/80">
          <span>Session Progress</span>
          <span className="font-bold text-emerald-200">{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-3 rounded-full bg-emerald-950 border border-emerald-800/60 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveSessionTimer;
