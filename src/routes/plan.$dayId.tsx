import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Dumbbell, Flame, Share2, MessageSquare, X } from "lucide-react";
import { dayById, type Exercise } from "@/data/workouts";
import { useLogs } from "@/hooks/useLogs";
import { ExerciseMedia } from "@/components/ExerciseMedia";

export const Route = createFileRoute("/plan/$dayId")({
  loader: ({ params }) => {
    const day = dayById(params.dayId);
    if (!day) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.day.name ?? "Plan"} — Gym Tracker` }],
  }),
  component: PlanDetail,
  notFoundComponent: () => <p className="text-muted-foreground">Day not found.</p>,
  errorComponent: ({ error }) => <p className="text-destructive">{error.message}</p>,
});

function PlanDetail() {
  const { day } = Route.useLoaderData();
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState<string | null>(null);

  const totalSets = useMemo(
    () => day.exercises.reduce((a, e) => a + e.sets, 0),
    [day],
  );

  const goToSession = () => {
    navigate({ to: `/session/$dayId`, params: { dayId: day.id } });
  };

  const goBack = () => {
    navigate({ to: "/plan" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/50 border border-border">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{day.name}</h2>
            <p className="text-sm text-muted-foreground">{day.focus}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Exercises</p>
            <p className="text-2xl font-bold">{day.exercises.length}</p>
          </div>
          <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Sets</p>
            <p className="text-2xl font-bold">{totalSets}</p>
          </div>
          <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Est. Time</p>
            <p className="text-2xl font-bold">~{totalSets * 2}m</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {day.exercises.map((ex: Exercise, idx: number) => (
          <div
            key={ex.name}
            className={`shrink-0 rounded-xl border px-3 py-2 flex items-center gap-2 cursor-pointer transition-all min-w-[200px] ${
              openInfo === ex.name
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
            onClick={() => setOpenInfo(ex.name === openInfo ? null : ex.name)}
          >
            <div className="h-8 w-8 rounded-lg bg-accent/50 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold">{idx + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{ex.name}</p>
              <p className="text-[10px] text-muted-foreground">{ex.sets} sets · {ex.reps} reps</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {day.exercises.map((ex: Exercise) => (
          <div key={ex.name} className="rounded-2xl border border-border bg-card overflow-hidden">
            <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-44" />
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight">{ex.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{ex.targetMuscles}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ex.equipment || "Bodyweight"}</p>
                </div>
                <button
                  onClick={() => setOpenInfo(ex.name === openInfo ? null : ex.name)}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-accent/50 text-muted-foreground hover:text-primary shrink-0 ml-2"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Sets</p>
                  <p className="text-xl font-bold text-primary">{ex.sets}</p>
                </div>
                <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Reps</p>
                  <p className="text-xl font-bold">{ex.reps}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={goBack}
          className="flex-1 rounded-full bg-accent py-4 font-bold text-sm shadow-xl active:scale-[0.99]"
        >
          Back
        </button>
        <button
          onClick={goToSession}
          className="flex-[2] rounded-full bg-primary py-5 font-bold text-primary-foreground text-lg shadow-xl active:scale-[0.99] flex items-center justify-center gap-3"
        >
          Start {day.name} Workout
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {openInfo && (() => {
        const ex = day.exercises.find((e2: Exercise) => e2.name === openInfo);
        if (!ex) return null;
        return (
          <div
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenInfo(null)}
          >
            <div
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between sticky top-0 bg-card z-10 pt-1 pb-2">
                <h3 className="font-bold text-2xl">{ex.name}</h3>
                <button
                  onClick={() => setOpenInfo(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50 hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <ExerciseMedia src={ex.image} alt={ex.name} steps={ex.steps} className="h-52" />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Target Muscles</p>
                  <p className="text-sm font-semibold">{ex.targetMuscles}</p>
                </div>
                <div className="rounded-xl bg-accent/30 p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Equipment</p>
                  <p className="text-sm font-semibold">{ex.equipment || "Bodyweight"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Workout Volume</p>
                  <p className="font-bold text-lg">
                    {ex.sets} sets × {ex.reps} reps
                  </p>
                </div>
              </div>

              <div className="space-y-3">
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
                      <span className="text-foreground/90 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {ex.tips && ex.tips.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Pro Tips</h4>
                  <ul className="space-y-2">
                    {ex.tips.map((tip: string, idx: number) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-primary/70 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={goToSession}
                className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground text-lg shadow-xl"
              >
                Start Exercise
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
