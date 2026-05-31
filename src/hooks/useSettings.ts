import { useState } from "react";
import { User, Target, Dumbbell, Calendar, Save, RotateCcw } from "lucide-react";

export type Goal = "muscle" | "strength" | "fat_loss" | "endurance" | "general";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Equipment = "full_gym" | "barbell" | "dumbbells" | "bodyweight";

export type UserSettings = {
  name: string;
  goal: Goal;
  experience: Experience;
  equipment: Equipment;
  daysPerWeek: number;
};

const KEY = "gym.settings.v1";

const defaults: UserSettings = {
  name: "",
  goal: "muscle",
  experience: "intermediate",
  equipment: "full_gym",
  daysPerWeek: 4,
};

const read = (): UserSettings => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch {
    return defaults;
  }
};

const write = (settings: UserSettings) => {
  localStorage.setItem(KEY, JSON.stringify(settings));
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(read);

  const update = (patch: Partial<UserSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    write(next);
  };

  const reset = () => {
    const next = defaults;
    setSettings(next);
    write(next);
  };

  return { settings, update, reset };
}
