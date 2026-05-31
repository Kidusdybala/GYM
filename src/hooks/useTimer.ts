import { useState, useCallback } from "react";

export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback((s?: number) => {
    setSeconds(s ?? initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  const tick = useCallback(() => {
    setSeconds((s) => {
      if (s <= 1) {
        setIsRunning(false);
        return 0;
      }
      return s - 1;
    });
  }, []);

  const adjust = useCallback((delta: number) => {
    setSeconds((s) => Math.max(0, s + delta));
  }, []);

  return { seconds, isRunning, start, pause, resume, reset, tick, adjust };
}

export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
