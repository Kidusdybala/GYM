import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell, Calendar, ChevronRight, Info, Share2, Flame, X, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { WORKOUTS, dayById, type Exercise } from "@/data/workouts";
import { ExerciseMedia } from "@/components/ExerciseMedia";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Workout Plan — Gym Tracker" },
      { name: "description", content: "Your personalized training plan." },
    ],
  }),
  component: Plan,
});

function Plan() {
  const days = WORKOUTS;
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const totalExercises = useMemo(
    () => days.reduce((sum, d) => sum + d.exercises.length, 0),
    [],
  );

  const selectedDay = selectedDayId ? dayById(selectedDayId) : null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {days.length}-Day Split
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Workout Plan</h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            {days.length} training days · {totalExercises} exercises · Progressive overload built in
          </p>

          <div className="mt-6 flex items-center gap-4 text-sm">
            <div className="rounded-xl bg-accent/50 px-4 py-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Days/Week</p>
              <p className="text-2xl font-bold">{days.length}</p>
            </div>
            <div className="rounded-xl bg-accent/50 px-4 py-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Focus</p>
              <p className="text-2xl font-bold capitalize">Full Body</p>
            </div>
            <div className="rounded-xl bg-accent/50 px-4 py-3 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Exercises</p>
              <p className="text-2xl font-bold">{totalExercises}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight px-1">Weekly Schedule</h2>
        <p className="text-sm text-muted-foreground px-1">Tap a day to view exercises and start training</p>

        {selectedDay ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-1">
              <button
                onClick={() => setSelectedDayId(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/50 text-xs font-semibold hover:bg-accent transition-colors"
              >
                ← Back to all days
              </button>
            </div>

            <Link
              to={`/session/$dayId`}
              params={{ dayId: selectedDay.id }}
              className="block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/20 p-5 card-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedDay.name}</h3>
                    <p className="text-sm text-primary/80">{selectedDay.focus}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedDay.exercises.length} exercises · {selectedDay.exercises.reduce((a, e) => a + e.sets, 0)} sets
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </Link>

            <div className="space-y-3 pt-2">
              {selectedDay.exercises.map((ex, idx) => (
                <Link
                  key={ex.name}
                  to={`/plan/$dayId`}
                  params={{ dayId: selectedDay.id }}
                  className="block rounded-2xl border border-border bg-card overflow-hidden card-hover transition-all duration-300"
                >
                  <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-40" />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-base">{ex.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{ex.targetMuscles}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{ex.equipment}</p>
                      </div>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-2xl font-bold text-primary">{ex.sets}</span>
                            <span className="text-xs text-muted-foreground ml-1">sets</span>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div>
                            <span className="text-2xl font-bold">{ex.reps}</span>
                            <span className="text-xs text-muted-foreground ml-1">reps</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {days.map((day) => (
              <div
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className="rounded-2xl border border-border bg-card p-5 card-hover transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/50 border border-border">
                      <Dumbbell className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg truncate">{day.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{day.focus}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-xs text-muted-foreground">
                          {day.exercises.length} exercises
                        </p>
                        <span className="text-xs text-muted-foreground">·</span>
                        <p className="text-xs font-semibold text-primary">
                          {day.exercises.reduce((a, e) => a + e.sets, 0)} sets
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
