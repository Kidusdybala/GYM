import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Flame, Trophy, TrendingUp, Dumbbell, Target, Award } from "lucide-react";
import { useLogs } from "@/hooks/useLogs";
import { WORKOUTS } from "@/data/workouts";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Gym Tracker" },
      { name: "description", content: "Track your strength gains and personal records." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { logs } = useLogs();

  const stats = {
    totalSessions: logs.length,
    totalSets: logs.reduce((a, l) => a + l.exercises.reduce((b, e) => b + e.sets.length, 0), 0),
    totalExercises: logs.reduce((a, l) => a + l.exercises.length, 0),
    totalTime: logs.reduce((a, l) => a + (l.duration || 0), 0),
  };

  const thisWeek = logs.filter((l) => {
    const d = new Date(l.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  });

  const lastWeek = logs.filter((l) => {
    const d = new Date(l.date);
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= twoWeeksAgo && d < weekAgo;
  });

  const weeklyVolumeLast7 = logs.filter((l) => {
    const d = new Date(l.date);
    const now = new Date();
    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }).length;

  const avgSessionDuration = stats.totalSessions > 0
    ? Math.round(stats.totalTime / stats.totalSessions / 60)
    : 0;

  const allExercises = WORKOUTS.flatMap((d) =>
    d.exercises.map((ex) => ({ ...ex, dayId: d.id, dayName: d.name }))
  );

  const personalRecords: { name: string; weight: string; reps: string; date: Date }[] = [];
  allExercises.forEach((ex) => {
    logs.forEach((log) => {
      const exerciseLog = log.exercises.find((e) => e.name === ex.name);
      if (exerciseLog) {
        exerciseLog.sets.forEach((s) => {
          if (s.done && s.weight) {
            const w = parseFloat(s.weight);
            if (w > 0) {
              personalRecords.push({
                name: ex.name,
                weight: s.weight,
                reps: s.reps,
                date: new Date(log.date),
              });
            }
          }
        });
      }
    });
  });

  const uniquePRs = personalRecords
    .reduce((acc, curr) => {
      const key = curr.name;
      if (!acc[key] || parseFloat(curr.weight) > parseFloat(acc[key].weight)) {
        acc[key] = curr;
      }
      return acc;
    }, {} as Record<string, { name: string; weight: string; reps: string; date: Date }>);

  const prList = Object.values(uniquePRs)
    .sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight))
    .slice(0, 8);

  const dayDistribution = WORKOUTS.map((day) => ({
    day: day.name,
    count: logs.filter((l) => l.dayId === day.id).length,
  }));

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Your journey</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Progress</h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Track your strength gains and personal records
          </p>
        </div>
        <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-primary/15 blur-3xl" />
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Flame className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-wide">Sessions</p>
          </div>
          <p className="text-3xl font-bold">{stats.totalSessions}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-wide">Total Sets</p>
          </div>
          <p className="text-3xl font-bold">{stats.totalSets.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-wide">Avg Duration</p>
          </div>
          <p className="text-3xl font-bold">{avgSessionDuration}<span className="text-sm text-muted-foreground">min</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Award className="h-4 w-4 text-primary" />
            <p className="text-xs uppercase tracking-wide">This Week</p>
          </div>
          <p className="text-3xl font-bold">{weeklyVolumeLast7}</p>
        </div>
      </div>

      {prList.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Personal Records</h2>
          </div>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-[2rem_1fr_4rem_4rem] items-center gap-2 px-4 py-2.5 border-b border-border bg-accent/20 text-xs uppercase tracking-wider text-muted-foreground">
              <span>#</span>
              <span>Exercise</span>
              <span className="text-center">Weight</span>
              <span className="text-center">Reps</span>
            </div>
            {prList.map((pr, idx) => (
              <div
                key={pr.name}
                className={`grid grid-cols-[2rem_1fr_4rem_4rem] items-center gap-2 px-4 py-3 transition-colors hover:bg-accent/30 ${
                  idx < prList.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{pr.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {pr.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span className="text-center font-bold text-primary">{pr.weight || "-"}</span>
                <span className="text-center text-sm">{pr.reps}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {logs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Training Volume</h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="space-y-2">
              {dayDistribution.map((d) => (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-16 truncate">{d.day}</span>
                  <div className="flex-1 h-4 bg-accent/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${logs.length > 0 ? (d.count / Math.max(...dayDistribution.map(dd => dd.count))) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground w-6 text-right">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {prList.length === 0 && logs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Complete a workout to see your progress and personal records.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg"
          >
            Start Workout
          </Link>
        </div>
      )}
    </div>
  );
}
