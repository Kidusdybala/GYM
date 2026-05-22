import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Play, Calendar } from "lucide-react";
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
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Let's lift.</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Streak</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{streak}<span className="ml-1 text-base font-medium text-muted-foreground">d</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wide">Sessions</span>
          </div>
          <p className="mt-2 text-3xl font-bold">{logs.length}</p>
        </div>
      </div>

      <section className="rounded-3xl bg-primary p-6 text-primary-foreground">
        <p className="text-xs uppercase tracking-widest opacity-70">Today's workout</p>
        <h2 className="mt-1 text-3xl font-bold">{day.name} Day</h2>
        <p className="mt-1 text-sm opacity-80">{day.focus}</p>
        <p className="mt-3 text-sm opacity-70">{day.exercises.length} exercises</p>
        <Link
          to="/session/$dayId"
          params={{ dayId: day.id }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-foreground transition-transform active:scale-95"
        >
          <Play className="h-4 w-4 fill-current" />
          Quick start
        </Link>
      </section>

      {last && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Last session</p>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-lg font-semibold">{last.dayName}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(last.date).toLocaleDateString()} · {Math.round(last.duration / 60)} min
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
