import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { WORKOUTS } from "@/data/workouts";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan — Gym Tracker" },
      { name: "description", content: "Your 5-day training split." },
    ],
  }),
  component: Plan,
});

function Plan() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">5-day split</p>
        <h1 className="text-4xl font-bold tracking-tight">Your plan</h1>
      </header>
      <ul className="space-y-3">
        {WORKOUTS.map((d, i) => (
          <li key={d.id}>
            <Link
              to="/plan/$dayId"
              params={{ dayId: d.id }}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <p className="text-base font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.focus}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
