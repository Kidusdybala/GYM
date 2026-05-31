import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Play, Calendar, Dumbbell, Trophy, Activity } from "lucide-react";
import { todaysDay } from "@/data/workouts";
import { useLogs, computeStreak } from "@/hooks/useLogs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Gym Tracker" },
      { name: "description", content: "Today's workout and your training streak." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const day = todaysDay();
  const { logs } = useLogs();
  const streak = computeStreak(logs);
  const last = logs[0];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">Let's crush it.</h1>
          <p className="text-lg text-muted-foreground max-w-lg">Transform your body, one rep at a time. Track your progress and stay motivated.</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-6 card-hover transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Flame className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wide">Streak</span>
          </div>
          <p className="text-4xl font-bold gold-glow">
            {streak}
            <span className="ml-1 text-lg font-medium text-muted-foreground">d</span>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 card-hover transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wide">Sessions</span>
          </div>
          <p className="text-4xl font-bold">{logs.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 card-hover transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wide">Exercises</span>
          </div>
          <p className="text-4xl font-bold">{day.exercises.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 card-hover transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wide">Focus</span>
          </div>
          <p className="text-4xl font-bold">{day.focus.split(' ')[0]}</p>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl gym-section p-8 text-foreground">
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Today's workout</p>
          <h2 className="text-4xl font-bold mb-2">{day.name}</h2>
          <p className="text-lg text-muted-foreground mb-4">{day.focus}</p>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">{day.exercises.length} exercises</span>
            </div>
          </div>
          <Link
            to="/session/$dayId"
            params={{ dayId: day.id }}
            className="inline-flex items-center gap-3 rounded-full gym-gradient px-8 py-4 text-base font-bold text-primary-foreground shadow-xl transition-all active:scale-95 hover:brightness-110 hover:scale-105"
          >
            <Play className="h-5 w-5 fill-current" />
            Start Workout
          </Link>
        </div>
      </section>

      {last && (
        <section className="rounded-2xl border border-border bg-card p-6 card-hover transition-all duration-300">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Last session</p>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-semibold">{last.dayName}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(last.date).toLocaleDateString()} · {Math.round(last.duration / 60)} min
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
