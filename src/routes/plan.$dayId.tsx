import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Play } from "lucide-react";
import { dayById } from "@/data/workouts";

export const Route = createFileRoute("/plan/$dayId")({
  loader: ({ params }) => {
    const day = dayById(params.dayId);
    if (!day) throw notFound();
    return { day };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.day.name ?? "Day"} — Gym Tracker` },
      { name: "description", content: loaderData?.day.focus ?? "Workout day" },
    ],
  }),
  component: DayDetail,
  notFoundComponent: () => <p className="text-muted-foreground">Day not found.</p>,
  errorComponent: ({ error }) => <p className="text-destructive">{error.message}</p>,
});

function DayDetail() {
  const { day } = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <Link to="/plan" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Plan
      </Link>
      <header>
        <p className="text-sm uppercase tracking-widest text-muted-foreground">{day.focus}</p>
        <h1 className="text-4xl font-bold tracking-tight">{day.name} Day</h1>
      </header>
      <ul className="space-y-2">
        {day.exercises.map((e, i: number) => (
          <li
            key={e.name}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{e.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {e.sets} × {e.reps}
            </span>
          </li>
        ))}
      </ul>
      <Link
        to="/session/$dayId"
        params={{ dayId: day.id }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.99]"
      >
        <Play className="h-4 w-4 fill-current" /> Start session
      </Link>
    </div>
  );
}
