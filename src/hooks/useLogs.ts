import { useEffect, useState, useCallback } from "react";

export type LoggedSet = { reps: string; weight: string; done: boolean; previousWeight?: string; previousReps?: string };
export type LoggedExercise = { name: string; sets: LoggedSet[] };
export type SessionLog = {
  id: string;
  date: string;
  dayId: string;
  dayName: string;
  duration: number;
  exercises: LoggedExercise[];
};

const KEY = "gym.logs.v1";

const read = (): SessionLog[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export function useLogs() {
  const [logs, setLogs] = useState<SessionLog[]>([]);

  useEffect(() => {
    setLogs(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLogs(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((log: SessionLog) => {
    const next = [log, ...read()];
    localStorage.setItem(KEY, JSON.stringify(next));
    setLogs(next);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setLogs([]);
  }, []);

  return { logs, save, clear };
}

export const computeStreak = (logs: SessionLog[]): number => {
  if (!logs.length) return 0;
  const dates = new Set(logs.map((l) => new Date(l.date).toDateString()));
  let streak = 0;
  const cursor = new Date();
  // allow today missing
  if (!dates.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (dates.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
