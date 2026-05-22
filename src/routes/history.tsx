import { createFileRoute } from "@tanstack/react-router";
import { useLogs } from "@/hooks/useLogs";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Gym Tracker" },
      { name: "description", content: "Your completed training sessions." },
    ],
  }),
  component: History,
});

function History() {
  const { logs, clear } = useLogs();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Log</p>
          <h1 className="text-4xl font-bold tracking-tight">History</h1>
        </div>
        {logs.length > 0 && (
          <button onClick={clear} className="text-xs text-muted-foreground underline">
            Clear all
          </button>
        )}
      </header>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">No sessions yet. Hit the gym.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {logs.map((l) => {
            const totalSets = l.exercises.reduce((a, e) => a + e.sets.length, 0);
            const doneSets = l.exercises.reduce(
              (a, e) => a + e.sets.filter((s) => s.done).length,
              0,
            );
            const date = new Date(l.date);
            return (
              <li key={l.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold">{l.dayName} Day</p>
                  <p className="text-xs text-muted-foreground">
                    {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                  <span>{Math.round(l.duration / 60)} min</span>
                  <span>·</span>
                  <span>{doneSets}/{totalSets} sets</span>
                  <span>·</span>
                  <span>{l.exercises.length} exercises</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
