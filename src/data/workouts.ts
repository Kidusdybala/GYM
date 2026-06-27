export type Exercise = { 
  name: string; 
  sets: number; 
  reps: string;
  targetMuscles?: string;
  steps?: string[];
  tips?: string[];
  equipment?: string;
  image?: string;
};

export type Day = { 
  id: string; 
  name: string; 
  focus: string; 
  exercises: Exercise[];
};

export const WORKOUTS: Day[] = [
  {
    id: "monday",
    name: "Monday",
    focus: "Chest · Triceps",
    exercises: [
      { 
        name: "Chest Fly Close Grip Press", 
        sets: 3, 
        reps: "10",
        targetMuscles: "Pectoralis Major, Triceps",
        equipment: "Dumbbells, Flat Bench",
        steps: [
          "Lie flat on the bench with a dumbbell in each hand",
          "Perform a chest fly by lowering the dumbbells out to your sides",
          "Bring the dumbbells back together over your chest",
          "Immediately bring them down to your chest, keeping elbows close to your body",
          "Press them back up as a close-grip press",
          "Repeat the fly and press combination",
        ],
        tips: [
          "Keep your feet planted firmly on the floor",
          "Control the descent on the fly to feel the stretch in your pecs",
          "Keep dumbbells pressed together during the close-grip press",
        ],
        image: "/videos/chest/chest 1.mp4",
      },
      { 
        name: "Seated Overhead Dumbbell Tricep Extension", 
        sets: 3, 
        reps: "10-12",
        targetMuscles: "Triceps Brachii (Long Head)",
        equipment: "Bench with Back Support, Single Dumbbell",
        steps: [
          "Sit on a bench with back support, holding a dumbbell with both hands",
          "Raise the dumbbell overhead until your arms are fully extended",
          "Keep your elbows pointed straight up and close to your head",
          "Lower the dumbbell behind your head by bending your elbows",
          "Extend your arms back to the starting position",
          "Squeeze your triceps at the top",
        ],
        tips: [
          "Keep your elbows as stationary as possible",
          "Get a full stretch at the bottom of the movement",
          "Avoid flaring your elbows too much",
        ],
        image: "/videos/tryceps/triceps.mp4",
      },
    ],
  },
  {
    id: "tuesday",
    name: "Tuesday",
    focus: "Back · Biceps",
    exercises: [
      { 
        name: "Underhand Barbell Row", 
        sets: 3, 
        reps: "10",
        targetMuscles: "Lats, Biceps, Rhomboids",
        equipment: "Barbell, Weight Plates",
        steps: [
          "Stand with feet hip-width apart, gripping the barbell with an underhand grip (palms facing up)",
          "Hinge at the hips, keeping your back straight and chest up",
          "Pull the barbell towards your lower abdomen/hip crease",
          "Squeeze your lats and back muscles at the top of the movement",
          "Lower the bar slowly with control",
          "Do not let the bar rest on the ground between reps",
        ],
        tips: [
          "Keep your elbows tucked in close to your body",
          "An underhand grip emphasizes the lower lats and biceps more than an overhand grip",
          "Ensure your lower back remains neutral to avoid injury",
        ],
        image: "/videos/back/CaYAuzAGFonF_Q_remux.mp4",
      },
      { 
        name: "Cross-Body Dumbbell Curls", 
        sets: 3, 
        reps: "10-12",
        targetMuscles: "Brachialis, Biceps Brachii",
        equipment: "Dumbbells",
        steps: [
          "Stand tall holding a dumbbell in each hand at your sides",
          "Keep your palms facing your body (neutral grip)",
          "Curl one dumbbell across your body toward the opposite shoulder",
          "Squeeze the bicep at the top of the curl",
          "Slowly lower the dumbbell back to the starting position",
          "Repeat on the other side, alternating arms",
        ],
        tips: [
          "Do not use momentum by swinging your torso",
          "This variation effectively targets the brachialis, making the arm look thicker",
          "Keep the movement strict and controlled",
        ],
        image: "/videos/byceps/3kOoAE8rItCnfw_remux.mp4",
      },
    ],
  },
  {
    id: "thursday",
    name: "Thursday",
    focus: "Full upper body",
    exercises: [
      { 
        name: "Reverse Grip Single Side Press", 
        sets: 3, 
        reps: "10",
        targetMuscles: "Upper Chest, Triceps, Core",
        equipment: "Flat Bench, Dumbbells",
        steps: [
          "Lie flat on a bench holding a dumbbell in each hand",
          "Use a reverse grip (palms facing your head)",
          "Keep your core tight to stabilize your torso",
          "Press one dumbbell up while keeping the other at chest level",
          "Lower the dumbbell with control",
          "Repeat on the other side, or complete all reps on one side first",
        ],
        tips: [
          "The unilateral pressing engages your core significantly more",
          "Keep your non-working arm engaged and steady",
          "Control the descent to avoid dropping the weight too fast",
        ],
        image: "/videos/chest/chest 3.mp4",
      },
      { 
        name: "Wide Grip Lat Pulldown", 
        sets: 4, 
        reps: "10-12",
        targetMuscles: "Latissimus Dorsi (Upper, Middle, Lower)",
        equipment: "Cable Machine, Wide Pulldown Bar",
        steps: [
          "Sit at the lat pulldown machine and adjust the thigh pads to secure your legs",
          "Grip the bar wider than shoulder-width with an overhand grip",
          "Lean back slightly, keeping your chest up and core engaged",
          "Pull the bar down towards your upper chest",
          "Squeeze your lats firmly at the bottom of the movement",
          "Slowly release the bar back up until your arms are fully extended",
        ],
        tips: [
          "Focus on pulling down with your elbows rather than your hands",
          "Do not use excessive momentum or lean too far back",
          "A full stretch at the top is crucial for lat development",
        ],
        image: "/videos/back/vCPajyZfB8x8tg_remux.mp4",
      },
    ],
  },
  {
    id: "saturday",
    name: "Saturday",
    focus: "Upper body pump",
    exercises: [
      { 
        name: "Cable Lateral Raises", 
        sets: 3, 
        reps: "8-10",
        targetMuscles: "Lateral Deltoids",
        equipment: "Cable Machine, D-Handle",
        steps: [
          "Stand next to the cable machine, holding the handle with your outside hand",
          "Keep your core braced and feet shoulder-width apart",
          "Raise the cable out to the side until your arm is parallel to the floor",
          "Maintain a slight bend in your elbow",
          "Lower the handle slowly back to the starting position",
          "Complete all reps, then switch sides",
        ],
        tips: [
          "Lead with your elbows to ensure maximum lateral delt activation",
          "Avoid using momentum to swing the weight up",
          "Keep the movement controlled on the way down",
        ],
        image: "/videos/sholder/3IwAq8V0-_m6QQ_remux.mp4",
      },
      { 
        name: "Forearm Workout Routine", 
        sets: 3, 
        reps: "15",
        targetMuscles: "Inner and Outer Forearms, Brachioradialis",
        equipment: "Dumbbells",
        steps: [
          "This routine consists of several forearm isolation exercises",
          "Exercise 1: Seated Wrist Curls (Inner Forearms)",
          "Exercise 2: Standing Behind-the-Back Wrist Curls",
          "Exercise 3: Seated Reverse Wrist Curls (Outer Forearms)",
          "Exercise 4: Dumbbell Disc Grip Curls",
          "Exercise 5: Concentration Hammer Curls (Brachioradialis)",
        ],
        tips: [
          "Perform higher reps (15+) as forearms respond well to volume",
          "Ensure full range of motion at the wrist joint for the curls",
          "Keep the movements slow and controlled to maximize the burn",
        ],
        image: "/videos/for arm/fore arm excersie 1.mp4",
      },
    ],
  },
  {
    id: "sunday",
    name: "Sunday",
    focus: "Core · Abs · Obliques",
    exercises: [
      { 
        name: "Complete Abs Routine", 
        sets: 4, 
        reps: "15-30",
        targetMuscles: "Entire Core (Upper, Lower, Obliques)",
        equipment: "Bodyweight, Yoga Mat",
        steps: [
          "This routine consists of 5 different core exercises",
          "Exercise 1: Crunches (4x20)",
          "Exercise 2: Flutter Kicks (4x15)",
          "Exercise 3: Leg Raises (4x15)",
          "Exercise 4: Glute Bridges (4x30)",
          "Exercise 5: Plank variations (4x20 to 4x30 sec)",
        ],
        tips: [
          "Keep your lower back pressed into the mat during leg movements",
          "Focus on the mind-muscle connection and squeeze your abs",
          "Breathe steadily through each movement",
        ],
        image: "/videos/abs/0Ne_1cvlpL00LQ_remux.mp4",
      },
    ],
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
