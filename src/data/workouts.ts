export type MuscleGroup = 'chest' | 'tryceps' | 'back' | 'byceps' | 'sholder' | 'for arm' | 'abs';

export type Video = { 
  path: string; 
  name: string;
};

export const ALL_VIDEOS: Record<MuscleGroup, Video[]> = {
  chest: [
    { path: "/videos/chest/chest 1.mp4", name: "Chest Fly Close Grip Press" },
    { path: "/videos/chest/chest 2.mp4", name: "Reverse Grip Dumbbell Press" },
    { path: "/videos/chest/chest 3.mp4", name: "Reverse Grip Single Side Press" },
    { path: "/videos/chest/chest 4.mp4", name: "Chest Exercise 4" },
    { path: "/videos/chest/chest 5.mp4", name: "Chest Exercise 5" },
    { path: "/videos/chest/chest 6.mp4", name: "Chest Exercise 6" },
    { path: "/videos/chest/chest 7.mp4", name: "Chest Exercise 7" },
    { path: "/videos/chest/0sv7Nzs1-AeGbw_remux.mp4", name: "Chest Exercise 8" },
    { path: "/videos/chest/74wStF5XsYF6Iw_remux.mp4", name: "Chest Exercise 9" },
    { path: "/videos/chest/9WUeizx8laGMmg_remux.mp4", name: "Chest Exercise 10" },
    { path: "/videos/chest/AJqWvPr5hrw_lQ_remux.mp4", name: "Chest Exercise 11" },
    { path: "/videos/chest/HPjYSXfVMaPIAg_remux.mp4", name: "Chest Exercise 12" },
    { path: "/videos/chest/QK1Xw9F1ANY5GA_remux.mp4", name: "Chest Exercise 13" },
  ],
  tryceps: [
    { path: "/videos/tryceps/triceps.mp4", name: "Seated Overhead Dumbbell Tricep Extension" },
    { path: "/videos/tryceps/triceps 2.mp4", name: "Triceps Exercise 2" },
    { path: "/videos/tryceps/triceps 3.mp4", name: "Triceps Exercise 3" },
    { path: "/videos/tryceps/triceps 4.mp4", name: "Triceps Exercise 4" },
    { path: "/videos/tryceps/triceps 5.mp4", name: "Triceps Exercise 5" },
    { path: "/videos/tryceps/4DmTxWQHsRNTwA_remux.mp4", name: "Triceps Exercise 6" },
    { path: "/videos/tryceps/NiU0k1GWbj8xKg_remux.mp4", name: "Triceps Exercise 7" },
    { path: "/videos/tryceps/OIfhQYUsa6w8NQ_remux.mp4", name: "Triceps Exercise 8" },
    { path: "/videos/tryceps/endLQujLD5z-Lw_remux.mp4", name: "Triceps Exercise 9" },
    { path: "/videos/tryceps/kSrjGXV4sA0zQw_remux.mp4", name: "Triceps Exercise 10" },
    { path: "/videos/tryceps/mHzixXlzKU7IrA_remux.mp4", name: "Triceps Exercise 11" },
  ],
  back: [
    { path: "/videos/back/CaYAuzAGFonF_Q_remux.mp4", name: "Underhand Barbell Row" },
    { path: "/videos/back/vCPajyZfB8x8tg_remux.mp4", name: "Wide Grip Lat Pulldown" },
    { path: "/videos/back/yDl3HitQ3t41YA_remux.mp4", name: "Heavy Barbell Row" },
  ],
  byceps: [
    { path: "/videos/byceps/3kOoAE8rItCnfw_remux.mp4", name: "Cross-Body Dumbbell Curls" },
    { path: "/videos/byceps/NnYY5RliRjvOGA_remux.mp4", name: "Biceps Exercise 2" },
    { path: "/videos/byceps/R_T2tz6c3VjlXw_remux.mp4", name: "Biceps Exercise 3" },
    { path: "/videos/byceps/TYdbkX78GZcFhg_remux.mp4", name: "Biceps Exercise 4" },
    { path: "/videos/byceps/XQD1Xlj5RTcPuA_remux.mp4", name: "Biceps Exercise 5" },
    { path: "/videos/byceps/_gTAN8wwZsrIpA_remux.mp4", name: "Biceps Exercise 6" },
    { path: "/videos/byceps/dquRwAAO1Hxlgw_remux.mp4", name: "Biceps Exercise 7" },
    { path: "/videos/byceps/nIGAB7KefkiE6A_remux.mp4", name: "Biceps Exercise 8" },
    { path: "/videos/byceps/q4FXWPp9MOkLpQ_remux.mp4", name: "Biceps Exercise 9" },
    { path: "/videos/byceps/w6PoqKEKSXKkUg_remux.mp4", name: "Biceps Exercise 10" },
  ],
  sholder: [
    { path: "/videos/sholder/3IwAq8V0-_m6QQ_remux.mp4", name: "Cable Lateral Raises" },
    { path: "/videos/sholder/ArVX0oZ2fK2APw_remux.mp4", name: "Seated Dumbbell Lateral Raises" },
    { path: "/videos/sholder/efTpfqQ_nA3OaQ_remux.mp4", name: "Seated Dumbbell Shoulder Press" },
    { path: "/videos/sholder/KMBis94BQVv5rA_remux.mp4", name: "Shoulder Exercise 4" },
    { path: "/videos/sholder/NAOv5X7L9XkClQ_remux.mp4", name: "Shoulder Exercise 5" },
    { path: "/videos/sholder/j2mXFa5DQRAkDQ_remux.mp4", name: "Shoulder Workout Routine" },
  ],
  'for arm': [
    { path: "/videos/for arm/fore arm excersie 1.mp4", name: "Forearm Workout Routine" },
    { path: "/videos/for arm/E10Fwkp0CmGwCA_remux.mp4", name: "Forearm Exercise 2" },
    { path: "/videos/for arm/K0qomdqvyrxbyA_remux.mp4", name: "Forearm Exercise 3" },
    { path: "/videos/for arm/RdIfHFLrqO7kZg_remux.mp4", name: "Forearm Exercise 4" },
    { path: "/videos/for arm/eGBtu5QWLaObNg_remux.mp4", name: "Forearm Exercise 5" },
    { path: "/videos/for arm/ol4R84EZsk7LwQ_remux.mp4", name: "Forearm Exercise 6" },
    { path: "/videos/for arm/vu_VZYplUx-rLQ_remux.mp4", name: "Forearm Exercise 7" },
  ],
  abs: [
    { path: "/videos/abs/0Ne_1cvlpL00LQ_remux.mp4", name: "Complete Abs Routine" },
    { path: "/videos/abs/7mItRgKwucm6PQ_remux.mp4", name: "Comprehensive Abs Workout" },
    { path: "/videos/abs/X7FSAOFM7JC_Dw_remux.mp4", name: "V-Ups" },
    { path: "/videos/abs/_gOM52zrtvXqDw_remux.mp4", name: "Abs Exercise 4" },
    { path: "/videos/abs/j1QEEU0dwsIkHA_remux.mp4", name: "Core Workout Routine" },
    { path: "/videos/abs/kayBvo5es4bkHg_remux.mp4", name: "Bodyweight Core Warmup" },
  ],
};

export type Day = { 
  id: string; 
  name: string; 
  focus: string; 
  muscleGroups: MuscleGroup[];
};

export const WORKOUTS: Day[] = [
  {
    id: "monday",
    name: "Monday",
    focus: "Chest · Triceps",
    muscleGroups: ['chest', 'tryceps'],
  },
  {
    id: "tuesday",
    name: "Tuesday",
    focus: "Back · Biceps",
    muscleGroups: ['back', 'byceps'],
  },
  {
    id: "thursday",
    name: "Thursday",
    focus: "Full upper body",
    muscleGroups: ['chest', 'back', 'sholder', 'tryceps', 'byceps'],
  },
  {
    id: "saturday",
    name: "Saturday",
    focus: "Shoulder & Forearm Pump",
    muscleGroups: ['sholder', 'for arm'],
  },
  {
    id: "sunday",
    name: "Sunday",
    focus: "Core · Abs · Obliques",
    muscleGroups: ['abs'],
  },
];

export const dayById = (id: string) => WORKOUTS.find((d) => d.id === id);

export const todaysDay = (): Day => {
  const dayOfWeek = new Date().getDay();
  // Map: 0=Sunday, 1=Monday, 2=Tuesday, 4=Thursday, 6=Saturday
  const dayMap: Record<number, Day> = {
    0: WORKOUTS[4], // Sunday
    1: WORKOUTS[0], // Monday
    2: WORKOUTS[1], // Tuesday
    4: WORKOUTS[2], // Thursday
    6: WORKOUTS[3], // Saturday
  };
  return dayMap[dayOfWeek] || WORKOUTS[0]; // Default to Monday if day not in schedule
};
