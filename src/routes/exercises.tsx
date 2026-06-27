import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Dumbbell, Info, ChevronRight, Flame, X, MessageSquare } from "lucide-react";
import { WORKOUTS, type Exercise } from "@/data/workouts";
import { ExerciseMedia } from "@/components/ExerciseMedia";

export const Route = createFileRoute("/exercises")({
  head: () => ({
    meta: [
      { title: "Exercise Library — Gym Tracker" },
      { name: "description", content: "Browse all exercises with step-by-step instructions." },
    ],
  }),
  component: ExerciseLibrary,
});

function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<{ name: string; dayId: string } | null>(null);

  const allExercises = useMemo(
    () => WORKOUTS.flatMap((day) => day.exercises.map((ex) => ({ ...ex, dayId: day.id, dayName: day.name }))).filter(ex => !ex.image?.startsWith('http')),
    []
  );

  const muscleGroups = useMemo(() => {
    const muscles = new Set<string>();
    allExercises.forEach((ex) => {
      ex.targetMuscles?.split(",").forEach((m) => muscles.add(m.trim()));
    });
    return Array.from(muscles).sort();
  }, [allExercises]);

  const filteredExercises = useMemo(() => {
    let result = allExercises;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.targetMuscles?.toLowerCase().includes(q) ||
          ex.equipment?.toLowerCase().includes(q)
      );
    }
    if (selectedMuscles.length > 0) {
      result = result.filter((ex) =>
        selectedMuscles.some((muscle) => ex.targetMuscles?.toLowerCase().includes(muscle.toLowerCase()))
      );
    }
    return result;
  }, [allExercises, searchQuery, selectedMuscles]);

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const selectedDay = selectedDayId ? WORKOUTS.find((d) => d.id === selectedDayId) : null;
  const openExerciseData = selectedExercise
    ? allExercises.find((ex) => ex.name === selectedExercise.name && ex.dayId === selectedExercise.dayId)
    : null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {allExercises.length} Exercises
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Exercise Library</h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Expert-crafted exercises with step-by-step instructions and pro tips
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
      </section>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises, muscles, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl bg-card border border-border pl-11 pr-4 py-3.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedMuscles([])}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedMuscles.length === 0
                ? "bg-primary text-primary-foreground"
                : "bg-accent/50 text-muted-foreground border border-border"
            }`}
          >
            All
          </button>
          {muscleGroups.slice(0, 12).map((muscle) => (
            <button
              key={muscle}
              onClick={() => toggleMuscle(muscle)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedMuscles.includes(muscle)
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/50 text-muted-foreground border border-border hover:bg-accent"
              }`}
            >
              {muscle.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {selectedDay && !selectedExercise ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDayId(null);
                    setSelectedExercise(null);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/50 text-xs font-semibold hover:bg-accent transition-colors"
                >
                  ← All exercises
                </button>
              </div>

              <div className="space-y-3">
                {selectedDay.exercises.filter(ex => !ex.image?.startsWith('http')).map((ex: Exercise, idx: number) => (
                  <div
                    key={ex.name}
                    onClick={() => setSelectedExercise({ name: ex.name, dayId: selectedDay.id })}
                    className="rounded-2xl border border-border bg-card overflow-hidden cursor-pointer card-hover transition-all duration-300"
                  >
                    <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-36" />
                    <div className="p-4">
                      <h3 className="font-bold text-base">{ex.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{ex.targetMuscles}</p>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
                        <span className="text-lg font-bold text-primary">{ex.sets}</span>
                        <span className="text-xs text-muted-foreground">sets</span>
                        <span className="h-4 w-px bg-border" />
                        <span className="text-lg font-bold">{ex.reps}</span>
                        <span className="text-xs text-muted-foreground">reps</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedExercise && openExerciseData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedExercise(null);
                  if (selectedDayId) setSelectedDayId(selectedDayId);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/50 text-xs font-semibold hover:bg-accent transition-colors"
              >
                ← Back to exercises
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <ExerciseMedia src={openExerciseData.image} alt={openExerciseData.name} steps={openExerciseData.steps} className="h-48 sm:h-56" />
              <div className="p-5 space-y-5">
              <div>
                <h3 className="text-2xl font-bold">{openExerciseData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{openExerciseData.targetMuscles}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{openExerciseData.equipment}</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 rounded-xl bg-accent/50 p-4 text-center border border-border">
                  <p className="text-2xl font-bold text-primary">{openExerciseData.sets}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sets</p>
                </div>
                <div className="flex-1 rounded-xl bg-accent/50 p-4 text-center border border-border">
                  <p className="text-2xl font-bold">{openExerciseData.reps}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reps</p>
                </div>
              </div>

              {openExerciseData.steps && openExerciseData.steps.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Step-by-Step Guide</h4>
                  <ol className="space-y-3">
                    {openExerciseData.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {openExerciseData.tips && openExerciseData.tips.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Pro Tips</h4>
                  <ul className="space-y-2">
                    {openExerciseData.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-primary/70 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                to={`/plan/$dayId`}
                params={{ dayId: selectedExercise.dayId }}
                className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground text-lg shadow-xl flex items-center justify-center gap-2"
              >
                View in Plan <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold px-1">
              {searchQuery ? `Results (${filteredExercises.length})` : "All Exercises"}
            </h2>
          </div>

          {filteredExercises.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No exercises found. Try a different search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExercises.map((ex) => (
                <div
                  key={`${ex.dayId}-${ex.name}`}
                  className="rounded-2xl border border-border bg-card p-4 cursor-pointer card-hover transition-all duration-300"
                  onClick={() => setSelectedExercise({ name: ex.name, dayId: ex.dayId })}
                >
                  <div className="flex items-center gap-3">
                    {ex.image && (
                      <div className="w-14 h-14 rounded-xl border border-border overflow-hidden hidden sm:block shrink-0">
                        <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-full w-full" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{ex.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{ex.targetMuscles}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {ex.dayName} · {ex.equipment}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {ex.sets}×{ex.reps}
                      </span>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searchQuery && selectedMuscles.length === 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">By Workout Day</h3>
              {WORKOUTS.map((day) => {
            const filteredExercises = day.exercises.filter(ex => !ex.image?.startsWith('http'));
            if (filteredExercises.length === 0) return null;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className="w-full rounded-2xl border border-border bg-card p-4 flex items-center justify-between card-hover transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/50 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{day.name}</p>
                    <p className="text-[10px] text-muted-foreground">{day.focus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{filteredExercises.length} exercises</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </button>
            )
          })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
