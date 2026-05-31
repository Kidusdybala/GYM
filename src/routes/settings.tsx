import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User, Target, Dumbbell, Calendar, Save, RotateCcw, ChevronRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Gym Tracker" },
      { name: "description", content: "Manage your profile and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Profile</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground max-w-lg">Customize your training experience</p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
      </section>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 border border-border">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Name</h3>
              <p className="text-xs text-muted-foreground">Your display name</p>
            </div>
          </div>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="Enter your name"
            className="w-full rounded-xl bg-background border border-border px-4 py-3 text-sm"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 border border-border">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Fitness Goal</h3>
              <p className="text-xs text-muted-foreground">What do you want to achieve?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "muscle" as const, label: "Build Muscle" },
              { value: "strength" as const, label: "Build Strength" },
              { value: "fat_loss" as const, label: "Lose Fat" },
              { value: "endurance" as const, label: "Build Endurance" },
              { value: "general" as const, label: "General Fitness" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => update({ goal: option.value })}
                className={`p-3 rounded-xl text-sm font-semibold transition-all ${
                  settings.goal === option.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-accent/50 border border-border hover:bg-accent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 border border-border">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Experience Level</h3>
              <p className="text-xs text-muted-foreground">How long have you been training?</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "beginner" as const, label: "Beginner", desc: "0-1 years" },
              { value: "intermediate" as const, label: "Intermediate", desc: "1-3 years" },
              { value: "advanced" as const, label: "Advanced", desc: "3+ years" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => update({ experience: option.value })}
                className={`p-3 rounded-xl text-left transition-all ${
                  settings.experience === option.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-accent/50 border border-border hover:bg-accent"
                }`}
              >
                <p className="text-sm font-bold">{option.label}</p>
                <p className="text-[10px] opacity-80 mt-0.5">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 border border-border">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Available Equipment</h3>
              <p className="text-xs text-muted-foreground">What equipment do you have access to?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "full_gym" as const, label: "Full Gym", desc: "All equipment" },
              { value: "barbell" as const, label: "Barbell", desc: "Barbell + plates" },
              { value: "dumbbells" as const, label: "Dumbbells", desc: "DBs only" },
              { value: "bodyweight" as const, label: "Bodyweight", desc: "No equipment" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => update({ equipment: option.value })}
                className={`p-3 rounded-xl text-left transition-all ${
                  settings.equipment === option.value
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-accent/50 border border-border hover:bg-accent"
                }`}
              >
                <p className="text-sm font-bold">{option.label}</p>
                <p className="text-[10px] opacity-80 mt-0.5">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/50 border border-border">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Training Days</h3>
              <p className="text-xs text-muted-foreground">How many days per week?</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((days) => (
              <button
                key={days}
                onClick={() => update({ daysPerWeek: days })}
                className={`p-3 rounded-xl text-center transition-all ${
                  settings.daysPerWeek === days
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-accent/50 border border-border hover:bg-accent"
                }`}
              >
                <p className="text-lg font-bold">{days}</p>
                <p className="text-[10px] opacity-80">days</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-primary-foreground shadow-xl active:scale-[0.99]"
          >
            <Save className="h-5 w-5" />
            {saved ? "Saved!" : "Save Settings"}
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-bold active:scale-[0.99]"
          >
            <RotateCcw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
