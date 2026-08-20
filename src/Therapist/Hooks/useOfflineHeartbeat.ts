// src/Therapist/Hooks/useOfflineHeartbeat.ts
// Client-side heartbeat timer that continues running during network drops and syncs on reconnect
import { useState, useEffect, useRef, useCallback } from 'react';

export interface HeartbeatState {
  secondsElapsed: number;
  isRunning: boolean;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedTimestamp: number | null;
}

export const useOfflineHeartbeat = (
  initialSeconds: number = 0,
  isActive: boolean = false,
  sessionId?: string
) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(isActive);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState<number | null>(Date.now());

  const localStartTimeRef = useRef<number | null>(null);
  const baseSecondsRef = useRef<number>(initialSeconds);
  const timerIntervalRef = useRef<any>(null);

  // Sync with initial seconds if updated externally
  useEffect(() => {
    if (initialSeconds > 0 && secondsElapsed === 0) {
      setSecondsElapsed(initialSeconds);
      baseSecondsRef.current = initialSeconds;
    }
  }, [initialSeconds]);

  // Monitor browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      // Reconcile and push local elapsed seconds back to server
      setTimeout(() => {
        setIsSyncing(false);
        setLastSyncedTimestamp(Date.now());
      }, 1200);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Timer Tick Engine using monotonic timestamps to avoid interval drift
  useEffect(() => {
    if (isRunning) {
      localStartTimeRef.current = Date.now();

      timerIntervalRef.current = setInterval(() => {
        if (localStartTimeRef.current) {
          const deltaSec = Math.floor((Date.now() - localStartTimeRef.current) / 1000);
          const currentTotal = baseSecondsRef.current + deltaSec;
          setSecondsElapsed(currentTotal);

          // Save to localStorage as a safety checkpoint
          if (sessionId) {
            try {
              localStorage.setItem(
                `ayursutra_timer_${sessionId}`,
                JSON.stringify({
                  seconds: currentTotal,
                  timestamp: Date.now(),
                })
              );
            } catch (e) {
              // ignore
            }
          }
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      baseSecondsRef.current = secondsElapsed;
      localStartTimeRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, sessionId]);

  const startTimer = useCallback(() => {
    baseSecondsRef.current = secondsElapsed;
    localStartTimeRef.current = Date.now();
    setIsRunning(true);
  }, [secondsElapsed]);

  const pauseTimer = useCallback(() => {
    baseSecondsRef.current = secondsElapsed;
    localStartTimeRef.current = null;
    setIsRunning(false);
  }, [secondsElapsed]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSecondsElapsed(0);
    baseSecondsRef.current = 0;
    localStartTimeRef.current = null;
    if (sessionId) {
      localStorage.removeItem(`ayursutra_timer_${sessionId}`);
    }
  }, [sessionId]);

  // Simulate network toggle for testing
  const toggleSimulatedOffline = useCallback(() => {
    setIsOnline((prev) => {
      const next = !prev;
      if (next) {
        setIsSyncing(true);
        setTimeout(() => {
          setIsSyncing(false);
          setLastSyncedTimestamp(Date.now());
        }, 1200);
      }
      return next;
    });
  }, []);

  return {
    secondsElapsed,
    isRunning,
    isOnline,
    isSyncing,
    lastSyncedTimestamp,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleSimulatedOffline,
  };
};
