import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Pause, Play } from "lucide-react";
import { dayById } from "@/data/workouts";
import { useLogs, type LoggedExercise } from "@/hooks/useLogs";

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

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

function Session() {
  const { day } = Route.useLoaderData();
  const { save } = useLogs();
  const navigate = useNavigate();

  const [state, setState] = useState<LoggedExercise[]>(() =>
    day.exercises.map((e) => ({
      name: e.name,
      sets: Array.from({ length: e.sets }, () => ({ reps: e.reps.split("-")[0], weight: "", done: false })),
    })),
  );
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const totalSets = useMemo(() => state.reduce((a, e) => a + e.sets.length, 0), [state]);
  const doneSets = useMemo(
    () => state.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0),
    [state],
  );

  const updateSet = (ei: number, si: number, patch: Partial<LoggedExercise["sets"][number]>) => {
    setState((prev) =>
      prev.map((ex, i) =>
        i !== ei ? ex : { ...ex, sets: ex.sets.map((s, j) => (j !== si ? s : { ...s, ...patch })) },
      ),
    );
  };

  const finish = () => {
    save({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      dayId: day.id,
      dayName: day.name,
      duration: seconds,
      exercises: state,
    });
    navigate({ to: "/history" });
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="sticky top-0 -mx-4 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{day.name}</p>
          <p className="font-mono text-2xl font-bold tabular-nums">{fmt(seconds)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-full border border-border p-3"
            aria-label={running ? "Pause" : "Resume"}
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <div className="text-right text-xs text-muted-foreground">
            <p className="text-base font-semibold text-foreground">{doneSets}/{totalSets}</p>
            <p>sets</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {state.map((ex, ei) => (
          <div key={ex.name} className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold">{ex.name}</h3>
            <div className="mt-3 grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span>Set</span>
              <span>Reps</span>
              <span>Weight</span>
              <span />
            </div>
            <div className="mt-1 space-y-2">
              {ex.sets.map((s, si) => (
                <div
                  key={si}
                  className={`grid grid-cols-[2rem_1fr_1fr_2.5rem] items-center gap-2 rounded-xl px-1 py-1 transition-colors ${s.done ? "bg-accent" : ""}`}
                >
                  <span className="text-center text-sm font-mono text-muted-foreground">{si + 1}</span>
                  <input
                    inputMode="numeric"
                    value={s.reps}
                    onChange={(e) => updateSet(ei, si, { reps: e.target.value })}
                    className="h-10 rounded-lg border border-border bg-background px-2 text-center text-sm"
                  />
                  <input
                    inputMode="decimal"
                    placeholder="kg"
                    value={s.weight}
                    onChange={(e) => updateSet(ei, si, { weight: e.target.value })}
                    className="h-10 rounded-lg border border-border bg-background px-2 text-center text-sm"
                  />
                  <button
                    onClick={() => updateSet(ei, si, { done: !s.done })}
                    aria-label="Toggle done"
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                      s.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={finish}
        className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.99]"
      >
        Finish workout
      </button>
    </div>
  );
}
