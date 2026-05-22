export type Exercise = { name: string; sets: number; reps: string };
export type Day = { id: string; name: string; focus: string; exercises: Exercise[] };

export const WORKOUTS: Day[] = [
  {
    id: "push",
    name: "Push",
    focus: "Chest · Shoulders · Triceps",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "6-8" },
      { name: "Overhead Press", sets: 3, reps: "8-10" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Tricep Pushdowns", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "pull",
    name: "Pull",
    focus: "Back · Biceps",
    exercises: [
      { name: "Deadlift", sets: 3, reps: "5" },
      { name: "Pull-ups", sets: 4, reps: "6-10" },
      { name: "Barbell Row", sets: 3, reps: "8-10" },
      { name: "Face Pulls", sets: 3, reps: "12-15" },
      { name: "Barbell Curl", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    focus: "Quads · Hamstrings · Glutes",
    exercises: [
      { name: "Back Squat", sets: 4, reps: "6-8" },
      { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
      { name: "Leg Press", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "12 each" },
      { name: "Standing Calf Raise", sets: 4, reps: "12-15" },
    ],
  },
  {
    id: "upper",
    name: "Upper",
    focus: "Full upper body",
    exercises: [
      { name: "Incline Bench Press", sets: 4, reps: "8" },
      { name: "Chest-Supported Row", sets: 4, reps: "8-10" },
      { name: "Arnold Press", sets: 3, reps: "10" },
      { name: "Lat Pulldown", sets: 3, reps: "10-12" },
      { name: "Hammer Curl", sets: 3, reps: "10-12" },
    ],
  },
  {
    id: "lower",
    name: "Lower",
    focus: "Posterior chain focus",
    exercises: [
      { name: "Front Squat", sets: 4, reps: "6-8" },
      { name: "Hip Thrust", sets: 4, reps: "8-10" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "10 each" },
      { name: "Leg Curl", sets: 3, reps: "12" },
      { name: "Seated Calf Raise", sets: 4, reps: "15" },
    ],
  },
];

export const dayById = (id: string) => WORKOUTS.find((d) => d.id === id);

export const todaysDay = (): Day => {
  // Mon=Push, Tue=Pull, Wed=Legs, Thu=Upper, Fri=Lower, Sat/Sun=Push rest fallback
  const idx = (new Date().getDay() + 6) % 7; // Mon=0
  return WORKOUTS[Math.min(idx, WORKOUTS.length - 1)];
};
