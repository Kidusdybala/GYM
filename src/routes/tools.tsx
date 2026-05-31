import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useRef, useEffect } from "react";
import { Dumbbell, Timer, Calculator, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Tools — Gym Tracker" },
      { name: "description", content: "Rest timer and plate calculator for your workouts." },
    ],
  }),
  component: Tools,
});

function Tools() {
  const [activeTool, setActiveTool] = useState<"timer" | "plates" | null>(null);
  const [seconds, setSeconds] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [remaining, setRemaining] = useState(90);
  const [targetWeight, setTargetWeight] = useState("");
  const [barWeight, setBarWeight] = useState("20");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setIsRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const startTimer = () => {
    setRemaining(seconds);
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(seconds);
  };

  const adjustTimer = (delta: number) => {
    const newSeconds = Math.max(0, seconds + delta);
    setSeconds(newSeconds);
    if (!isRunning) setRemaining(newSeconds);
  };

  const adjustRunning = (delta: number) => {
    setRemaining((r) => Math.max(0, r + delta));
    setSeconds((s) => Math.max(0, s + delta));
  };

  const plateResult = useMemo(() => {
    const target = parseFloat(targetWeight);
    const bar = parseFloat(barWeight);
    if (!target || !bar || target <= bar) return null;

    const remaining = target - bar;
    if (remaining < 0) return null;

    const standardPlates = [20, 15, 10, 5, 2.5, 1.25];
    const plates: { weight: number; count: number }[] = [];
    let left = remaining;

    for (const plate of standardPlates) {
      if (left >= plate * 2) {
        const count = Math.floor(left / (plate * 2));
        plates.push({ weight: plate, count });
        left -= plate * 2 * count;
      }
    }

    return {
      perSide: remaining / 2,
      plates,
      total: target,
      bar,
      remaining,
    };
  }, [targetWeight, barWeight]);

  const presets = [30, 60, 90, 120, 180];

  return (
    <div className="space-y-6">
      {!activeTool ? (
        <>
          <section className="relative overflow-hidden rounded-3xl hero-section">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-3">
                <Dumbbell className="h-8 w-8 text-primary" />
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  Gym Essentials
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Tools</h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Rest timer and plate calculator to optimize your training
              </p>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
          </section>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTool("timer")}
              className="rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">Rest Timer</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Smart rest timer with customizable duration
              </p>
              <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                Open tool
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>

            <button
              onClick={() => setActiveTool("plates")}
              className="rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">Plate Calculator</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Calculate plates needed for target weight
              </p>
              <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                Open tool
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          </div>
        </>
      ) : activeTool === "timer" ? (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Rest Timer</h3>
            <button
              onClick={() => {
                setActiveTool(null);
                pauseTimer();
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          {!isRunning ? (
            <>
              <div className="flex justify-center">
                <div className="text-6xl font-bold font-mono text-primary">
                  {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Quick Presets</p>
                <div className="flex gap-2 flex-wrap">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSeconds(preset);
                        setRemaining(preset);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        seconds === preset
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent/50 hover:bg-accent border border-border"
                      }`}
                    >
                      {Math.floor(preset / 60)}:{((preset % 60).toString().padStart(2, "0"))}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Custom Duration</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustTimer(-15)}
                    className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold hover:bg-accent/80"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => adjustTimer(-5)}
                    className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold hover:bg-accent/80"
                  >
                    -5s
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold font-mono">
                      {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                  <button
                    onClick={() => adjustTimer(5)}
                    className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold hover:bg-accent/80"
                  >
                    +5s
                  </button>
                  <button
                    onClick={() => adjustTimer(15)}
                    className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold hover:bg-accent/80"
                  >
                    +15s
                  </button>
                </div>
              </div>

              <button
                onClick={startTimer}
                className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground text-lg shadow-xl"
              >
                Start Rest Timer
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="text-7xl font-bold font-mono text-primary">
                  {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")}
                </div>
              </div>

              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{
                    width: `${seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 100}%`,
                  }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={pauseTimer}
                  className="flex-1 rounded-full bg-accent py-3 font-bold"
                >
                  Pause
                </button>
                <button
                  onClick={resetTimer}
                  className="flex-1 rounded-full bg-primary py-3 font-bold text-primary-foreground"
                >
                  Reset
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => adjustRunning(-15)}
                  className="flex-1 h-12 rounded-xl bg-accent/50 font-bold hover:bg-accent"
                >
                  -15s
                </button>
                <button
                  onClick={() => adjustRunning(15)}
                  className="flex-1 h-12 rounded-xl bg-accent/50 font-bold hover:bg-accent"
                >
                  +15s
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Plate Calculator</h3>
            <button
              onClick={() => setActiveTool(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Target Weight (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="e.g. 100"
                className="w-full rounded-xl bg-card border border-border px-4 py-3 text-lg font-mono text-center"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                Barbell Weight (kg)
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={barWeight}
                onChange={(e) => setBarWeight(e.target.value)}
                placeholder="20"
                className="w-full rounded-xl bg-card border border-border px-4 py-3 text-lg font-mono text-center"
              />
            </div>
          </div>

          {plateResult && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Per Side</p>
                  <p className="text-2xl font-bold text-primary">{plateResult.perSide.toFixed(1)} kg</p>
                </div>
                <div className="rounded-xl bg-accent/50 p-3 text-center border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold">{plateResult.total} kg</p>
                </div>
              </div>

              {plateResult.plates.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Load Each Side</p>
                  <div className="flex flex-wrap gap-2">
                    {plateResult.plates.map(({ weight, count }) => (
                      <div
                        key={weight}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50 border border-border"
                      >
                        <span className="text-lg font-bold">{weight}</span>
                        <span className="text-xs text-muted-foreground">×{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-accent/30 p-4 text-center border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    No additional plates needed for this weight
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
