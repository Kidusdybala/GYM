import { createFileRoute, notFound, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Check, Info, X, ChevronRight, ChevronLeft, History as HistoryIcon, MessageSquare } from "lucide-react";
import { dayById, type Exercise } from "@/data/workouts";
import { useLogs, type LoggedExercise, type LoggedSet } from "@/hooks/useLogs";
import { useTimer, formatTime } from "@/hooks/useTimer";
import { ExerciseMedia } from "@/components/ExerciseMedia";

export const Route = createFileRoute("/session/$dayId")({
  loader: ({ params }) => {
    const day = dayById(params.dayId);
    if (!day) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.day.name ?? "Session"} — Gym Tracker` }],
  }),
  component: Session,
  notFoundComponent: () => <p className="text-muted-foreground">Day not found.</p>,
  errorComponent: ({ error }) => <p className="text-destructive">{error.message}</p>,
});

function Session() {
  const { day } = Route.useLoaderData();
  const { save } = useLogs();
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isRestRunning, setIsRestRunning] = useState(false);
  const [startTime] = useState(Date.now());
  const [activeSet, setActiveSet] = useState<number | null>(null);
  const [completedPRs, setCompletedPRs] = useState<string[]>([]);

  const restTimer = { seconds: restTimerSeconds };

  const [state, setState] = useState<LoggedExercise[]>(() =>
    day.exercises.map((e: Exercise) => {
      const parts = e.reps.includes("-") ? e.reps.split("-") : e.reps.includes("–") ? e.reps.split("–") : [e.reps];
      const firstRep = parts[0].trim();
      return {
        name: e.name,
        sets: Array.from({ length: e.sets }, () => ({
          reps: firstRep,
          weight: "",
          done: false,
          previousWeight: "",
          previousReps: "",
        })),
      };
    }),
  );

  const totalSets = useMemo(() => state.reduce((a, e) => a + e.sets.length, 0), [state]);
  const doneSets = useMemo(
    () => state.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0),
    [state],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedSeconds(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, startTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRestRunning && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRestRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestRunning, restTimerSeconds]);

  const getPreviousSessionForExercise = useCallback((exerciseName: string) => {
    const stored = localStorage.getItem("gym.logs.v1");
    if (!stored) return null;
    try {
      const logs: any[] = JSON.parse(stored);
      for (const log of logs) {
        const exerciseLog = log.exercises.find((e: any) => e.name === exerciseName);
        if (exerciseLog && exerciseLog.sets.some((s: any) => s.done)) {
          const doneSets = exerciseLog.sets.filter((s: any) => s.done);
          const totalWeight = doneSets.reduce((sum: number, s: any) => sum + (parseFloat(s.weight) || 0), 0);
          return {
            weight: doneSets[0]?.weight || "",
            reps: doneSets[0]?.reps || "",
            totalWeight,
            date: new Date(log.date),
          };
        }
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const updateSet = (ei: number, si: number, patch: Partial<LoggedExercise["sets"][number]>) => {
    setState((prev) =>
      prev.map((ex, i) =>
        i !== ei ? ex : { ...ex, sets: ex.sets.map((s, j) => (j !== si ? s : { ...s, ...patch })) },
      ),
    );
  };

  const toggleSet = (ei: number, si: number) => {
    const current = state[ei].sets[si];
    updateSet(ei, si, { done: !current.done });
    if (!current.done) {
      const ex = state[ei];
      const prev = getPreviousSessionForExercise(ex.name);
      if (prev && !doneSets) {
        updateSet(ei, si, {
          previousWeight: prev.weight,
          previousReps: prev.reps,
        });
      }
    }
  };

  const startWorkout = () => {
    setIsTimerRunning(true);
  };

  const currentEx = day.exercises[currentExercise];
  const allDone = doneSets === totalSets;
  const completedExercises = state.filter((ex) => ex.sets.every((s) => s.done)).length;
  const overallProgress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  const checkPR = (exerciseIndex: number, setIndex: number) => {
    const currentSet = state[exerciseIndex].sets[setIndex];
    if (!currentSet.done) return null;

    const exerciseName = state[exerciseIndex].name;
    const stored = localStorage.getItem("gym.logs.v1");
    if (!stored) return currentSet.weight ? "New PR!" : null;

    try {
      const logs: any[] = JSON.parse(stored);
      let bestWeight = 0;
      for (const log of logs) {
        const exerciseLog = log.exercises.find((e: any) => e.name === exerciseName);
        if (exerciseLog) {
          for (const s of exerciseLog.sets) {
            if (s.done && parseFloat(s.weight) > bestWeight) {
              bestWeight = parseFloat(s.weight);
            }
          }
        }
      }
      const currentWeight = parseFloat(currentSet.weight);
      if (currentWeight > bestWeight && currentWeight > 0) {
        return "New PR!";
      }
    } catch {
      // ignore
    }
    return null;
  };

  const finish = () => {
    if (!allDone) return;
    save({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      dayId: day.id,
      dayName: day.name,
      duration: elapsedSeconds,
      exercises: state,
    });
    navigate({ to: "/history" });
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="sticky top-0 -mx-4 z-50 bg-background/95 px-4 py-3 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
              <button onClick={() => navigate({ to: "/" })} className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50 hover:bg-accent transition-colors">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{day.focus}</p>
              <h3 className="font-bold text-xl tracking-tight">{day.name}</h3>
            </div>
          </div>
          <Link to="/history" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50 hover:bg-accent transition-colors">
            <HistoryIcon className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50">
              <span className="text-2xl font-bold font-mono text-primary">{doneSets}</span>
              <span className="text-sm text-muted-foreground">/ {totalSets} sets</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50">
              <span className="text-2xl font-bold font-mono">{completedExercises}</span>
              <span className="text-sm text-muted-foreground">/ {day.exercises.length} exercises</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold font-mono text-primary">{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        <div className="mt-4 h-1.5 bg-accent rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 px-1">
        {day.exercises.map((ex: Exercise, ei: number) => {
          const exerciseState = state[ei];
          const exerciseDone = exerciseState.sets.every((s) => s.done);
          const exerciseProgress = exerciseState.sets.filter((s) => s.done).length;
          const prev = getPreviousSessionForExercise(ex.name);

          return (
            <div
              key={ex.name}
              className={`rounded-2xl border bg-card overflow-hidden transition-all ${
                currentExercise === ei ? "border-primary shadow-xl" : "border-border"
              }`}
            >
              <div className="p-4 cursor-pointer" onClick={() => setCurrentExercise(ei)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {ex.image && (
                      <div className="w-16 h-16 rounded-xl border border-border overflow-hidden hidden sm:block shrink-0">
                        <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-full w-full" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">{ex.name}</h3>
                      {ex.targetMuscles && (
                        <p className="text-xs text-muted-foreground mt-1">{ex.targetMuscles}</p>
                      )}
                      {ex.equipment && (
                        <p className="text-xs text-muted-foreground mt-0.5">{ex.equipment}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {prev && !exerciseDone && (
                      <div className="text-right px-2 py-1 rounded-lg bg-accent/30">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Prev</p>
                        <p className="text-sm font-bold text-primary">{prev.weight || prev.reps}</p>
                      </div>
                    )}
                    {exerciseDone ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Check className="h-6 w-6" />
                      </div>
                    ) : currentExercise === ei ? (
                      <div className="h-10 w-10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{ei + 1}</span>
                      </div>
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center">
                        <span className="text-lg font-bold text-muted-foreground">{ei + 1}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(exerciseProgress / ex.sets) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground min-w-[2rem] text-right">
                    {exerciseProgress}/{ex.sets}
                  </span>
                </div>

                {!exerciseDone && (
                  <p className="text-xs text-primary mt-2">
                    {ex.steps && ex.steps.length > 0 ? `${ex.steps[0]}` : `Start with ${ex.reps} reps`}
                  </p>
                )}
              </div>

              {currentExercise === ei && !exerciseDone && (
                <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-52 sm:h-60" />

                  {prev && (
                    <div className="p-3 rounded-xl bg-accent/30 border border-border/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Previous Performance</span>
                        <span className="text-[10px] text-muted-foreground">
                          {prev.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Weight:</span>
                          <span className="font-bold ml-1.5 text-primary">{prev.weight ? `${prev.weight} kg` : "Bodyweight"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Reps:</span>
                          <span className="font-bold ml-1.5">{prev.reps}</span>
                        </div>
                        {prev.totalWeight > 0 && (
                          <div>
                            <span className="text-muted-foreground text-xs">Total:</span>
                            <span className="font-bold ml-1.5 text-primary">{prev.totalWeight.toFixed(1)} kg</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">
                        💡 Try to beat this or add one more rep!
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-[3rem_1fr_1fr_2.5rem] items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-1 px-1">
                    <span>Set</span>
                    <span>Reps</span>
                    <span>Weight</span>
                    <span>✓</span>
                  </div>

                  <div className="space-y-1.5">
                    {exerciseState.sets.map((s, si) => (
                      <div
                        key={si}
                        className={`grid grid-cols-[3rem_1fr_1fr_2.5rem] items-center gap-2 rounded-xl px-1 py-0.5 transition-all ${
                          s.done
                            ? "bg-primary/10 border-2 border-primary/30"
                            : si === activeSet && !s.done
                            ? "bg-accent border-2 border-primary/50"
                            : "bg-accent/50 border border-border"
                        }`}
                      >
                        <span className="text-center text-sm font-bold font-mono text-muted-foreground">
                          {si + 1}
                        </span>
                        <input
                          inputMode="numeric"
                          value={s.reps}
                          readOnly={s.done}
                          onChange={(e) => updateSet(ei, si, { reps: e.target.value })}
                          className={`h-11 rounded-lg border bg-background px-3 text-center text-sm font-mono font-semibold ${
                            s.done ? "border-primary/30 text-primary" : "border-border"
                          }`}
                          placeholder={ex.reps}
                        />
                        <input
                          inputMode="decimal"
                          placeholder="kg"
                          value={s.weight}
                          readOnly={s.done}
                          onChange={(e) => updateSet(ei, si, { weight: e.target.value })}
                          className={`h-11 rounded-lg border bg-background px-3 text-center text-sm font-mono font-semibold ${
                            s.done ? "border-primary/30 text-primary" : "border-border"
                          }`}
                        />
                        <button
                          onClick={() => {
                            toggleSet(ei, si);
                            if (!s.done && si < exerciseState.sets.length - 1) {
                              setActiveSet(si + 1);
                              setRestTimerSeconds(90);
                              setIsRestRunning(true);
                            } else if (s.done) {
                              setIsRestRunning(false);
                              setRestTimerSeconds(0);
                              setActiveSet(null);
                            }
                          }}
                          aria-label="Toggle done"
                          className={`flex h-11 w-full items-center justify-center rounded-lg border-2 transition-all ${
                            s.done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {s.done ? <Check className="h-5 w-5" /> : <span className="text-xs font-bold">DONE</span>}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowAlternatives(true);
                      const orig = day.exercises.find((e2) => e2.name === state[ei].name);
                      if (orig?.steps) {
                        updateSet(ei, 0, { reps: (orig.reps.includes("-") ? orig.reps.split("-")[0] : orig.reps).trim() });
                      }
                    }}
                    className="w-full py-2.5 rounded-lg border border-border text-sm hover:bg-accent/50 transition-colors mt-2"
                  >
                    Swap Exercise
                  </button>
                </div>
              )}

              {currentExercise === ei && (
                <div className="border-t border-border p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!isTimerRunning ? (
                      <button
                        onClick={startWorkout}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg"
                      >
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        Start
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/50">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-sm font-bold font-mono text-primary">{formatTime(elapsedSeconds)}</span>
                        </div>
                        <button
                          onClick={() => setIsTimerRunning(false)}
                          className="px-2 py-1 rounded text-xs bg-accent/50 hover:bg-accent"
                        >
                          Pause
                        </button>
                      </div>
                    )}
                  </div>
                  {currentExercise < day.exercises.length - 1 && (
                    <button
                      onClick={() => {
                        setCurrentExercise(currentExercise + 1);
                        setActiveSet(0);
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-accent text-sm font-semibold hover:bg-accent/80 transition-colors"
                    >
                      Next Exercise
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {restTimerSeconds > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-50 mx-auto max-w-md px-4">
          <div className="rounded-2xl bg-card border-2 border-primary shadow-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Rest Time</span>
              <button
                onClick={() => {
                  setIsRestRunning(false);
                  setRestTimerSeconds(0);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Skip
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold font-mono text-primary">{formatTime(restTimerSeconds)}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRestTimerSeconds(Math.max(0, restTimerSeconds - 15))}
                  className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold hover:bg-accent/80"
                >
                  -15s
                </button>
                <button
                  onClick={() => setRestTimerSeconds((s) => s + 15)}
                  className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold hover:bg-accent/80"
                >
                  +15s
                </button>
              </div>
            </div>
            <div className="h-1.5 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{
                  width: `${90 > 0 ? ((90 - restTimerSeconds) / 90) * 100 : 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {allDone && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl">Workout Complete!</h3>
              <p className="text-sm text-muted-foreground">
                {completedExercises} exercises · {doneSets} sets · {formatTime(elapsedSeconds)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <p className="text-2xl font-bold text-primary">{doneSets}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Final Sets</p>
            </div>
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <p className="text-2xl font-bold">{completedExercises}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Exercises</p>
            </div>
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <p className="text-2xl font-bold text-primary">{formatTime(elapsedSeconds)}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Duration</p>
            </div>
          </div>

          <button
            onClick={finish}
            className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground text-lg shadow-xl active:scale-[0.99]"
          >
            Save Workout
          </button>
        </div>
      )}

      {openInfo && (() => {
        const ex = day.exercises.find((e2: Exercise) => e2.name === openInfo);
        if (!ex) return null;
        return (
          <div
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenInfo(null)}
          >
            <div
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between sticky top-0 bg-card z-10 pb-2">
                <div>
                  <h3 className="font-bold text-2xl">{ex.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{ex.targetMuscles}</p>
                </div>
                <button
                  onClick={() => setOpenInfo(null)}
                  className="rounded-full h-10 w-10 flex items-center justify-center bg-accent/50 hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {ex.image && (
                <div className="rounded-2xl border border-border overflow-hidden">
                  <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} />
                </div>
              )}

              <div className="rounded-2xl bg-accent/30 border border-border/50 p-4 flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Equipment</p>
                  <p className="text-sm font-semibold">{ex.equipment || "Bodyweight"}</p>
                </div>
                <div className="border-l border-border pl-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Target</p>
                  <p className="text-sm font-semibold">{ex.targetMuscles}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Step-by-Step Guide
                </h4>
                <ol className="space-y-3 ml-1">
                  {ex.steps?.map((step: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-foreground/90 leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {ex.tips && ex.tips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">⚡ Pro Tips</h4>
                  <ul className="space-y-2">
                    {ex.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm text-foreground/80">
                        <span className="text-primary/70">•</span>
                        <span className="leading-relaxed pt-0.5">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {showAlternatives && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl">Alternative Exercises</h3>
              <button
                onClick={() => setShowAlternatives(false)}
                className="rounded-full h-10 w-10 flex items-center justify-center bg-accent/50 hover:bg-accent"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Replace the current exercise with one of these similar movements:
            </p>
            <div className="space-y-2">
              {day.exercises
                .filter((e) => e.targetMuscles && currentEx?.targetMuscles && e.targetMuscles.includes(currentEx.targetMuscles.split(",")[0]))
                .map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setState((prev) =>
                        prev.map((ex, i) =>
                          i === currentExercise
                            ? {
                                ...ex,
                                name: alt.name,
                                sets: Array.from({ length: alt.sets }, () => ({
                                  reps: (alt.reps.includes("-") ? alt.reps.split("-")[0] : alt.reps).trim(),
                                  weight: "",
                                  done: false,
                                  previousWeight: "",
                                  previousReps: "",
                                })),
                              }
                            : ex,
                        ),
                      );
                      setShowAlternatives(false);
                    }}
                    className="w-full p-4 rounded-xl bg-accent/40 border border-border hover:border-primary/50 text-left transition-all"
                  >
                    <p className="font-semibold">{alt.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alt.targetMuscles}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
