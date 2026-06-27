import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Dumbbell, Info, ChevronRight, Flame, X, MessageSquare } from "lucide-react";
import { WORKOUTS, ALL_VIDEOS, type MuscleGroup } from "@/data/workouts";
import { ExerciseMedia } from "@/components/ExerciseMedia";

export const Route = createFileRoute("/exercises")({
  head: () => ({
    meta: [
      { title: "Exercise Library — Gym Tracker" },
      { name: "description", content: "Browse all exercises with step-by-step instructions." },
    ],
  }),
  component: ExerciseLibrary,
});

function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ path: string; name: string; muscleGroup: MuscleGroup } | null>(null);

  const muscleGroups: MuscleGroup[] = ["chest", "tryceps", "back", "byceps", "sholder", "for arm", "abs"];

  const getMuscleGroupName = (mg: MuscleGroup): string => {
    const names: Record<MuscleGroup, string> = {
      chest: 'Chest',
      tryceps: 'Triceps',
      back: 'Back',
      byceps: 'Biceps',
      sholder: 'Shoulders',
      'for arm': 'Forearms',
      abs: 'Abs',
    };
    return names[mg];
  };

  const allVideos = useMemo(() => {
    return Object.entries(ALL_VIDEOS).flatMap(([mg, videos]) => 
      videos.map(video => ({ ...video, muscleGroup: mg as MuscleGroup }))
    );
  }, []);

  const filteredVideos = useMemo(() => {
    let result = allVideos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          getMuscleGroupName(v.muscleGroup).toLowerCase().includes(q)
      );
    }
    if (selectedMuscles.length > 0) {
      result = result.filter((v) => selectedMuscles.includes(v.muscleGroup));
    }
    return result;
  }, [allVideos, searchQuery, selectedMuscles]);

  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const selectedDay = selectedDayId ? WORKOUTS.find((d) => d.id === selectedDayId) : null;

  const videosForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return selectedDay.muscleGroups.flatMap(mg => 
      ALL_VIDEOS[mg].map(video => ({ ...video, muscleGroup: mg }))
    );
  }, [selectedDay]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background/90 to-background" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {allVideos.length} Videos
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Video Library</h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            All workout videos organized by muscle group
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
      </section>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search videos or muscles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl bg-card border border-border pl-11 pr-4 py-3.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedMuscles([])}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedMuscles.length === 0
                ? "bg-primary text-primary-foreground"
                : "bg-accent/50 text-muted-foreground border border-border"
            }`}
          >
            All
          </button>
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              onClick={() => toggleMuscle(muscle)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedMuscles.includes(muscle)
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/50 text-muted-foreground border border-border hover:bg-accent"
              }`}
            >
              {getMuscleGroupName(muscle)}
            </button>
          ))}
        </div>
      </div>

      {selectedDay && !selectedVideo ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedDayId(null);
                setSelectedVideo(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/50 text-xs font-semibold hover:bg-accent transition-colors"
            >
              ← All videos
            </button>
          </div>

          <div className="space-y-3">
            {videosForSelectedDay.map((video, idx: number) => (
              <div
                key={video.path}
                onClick={() => setSelectedVideo(video)}
                className="rounded-2xl border border-border bg-card overflow-hidden cursor-pointer card-hover transition-all duration-300"
              >
                <ExerciseMedia src={video.path} alt={video.name} className="h-36" />
                <div className="p-4">
                  <h3 className="font-bold text-base">{video.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{getMuscleGroupName(video.muscleGroup)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedVideo ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedVideo(null);
                if (selectedDayId) setSelectedDayId(selectedDayId);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/50 text-xs font-semibold hover:bg-accent transition-colors"
            >
              ← Back to videos
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <ExerciseMedia src={selectedVideo.path} alt={selectedVideo.name} className="h-48 sm:h-56" />
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-2xl font-bold">{selectedVideo.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{getMuscleGroupName(selectedVideo.muscleGroup)}</p>
              </div>

              <Link
                to="/plan"
                className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground text-lg shadow-xl flex items-center justify-center gap-2"
              >
                View in Plan <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold px-1">
              {searchQuery ? `Results (${filteredVideos.length})` : "All Videos"}
            </h2>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Dumbbell className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No videos found. Try a different search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVideos.map((video) => (
                <div
                  key={video.path}
                  className="rounded-2xl border border-border bg-card p-4 cursor-pointer card-hover transition-all duration-300"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border border-border overflow-hidden hidden sm:block shrink-0">
                      <ExerciseMedia src={video.path} alt={video.name} className="h-full w-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{video.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{getMuscleGroupName(video.muscleGroup)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!searchQuery && selectedMuscles.length === 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">By Workout Day</h3>
              {WORKOUTS.map((day) => {
                const numVideos = day.muscleGroups.reduce((sum, mg) => sum + ALL_VIDEOS[mg].length, 0);
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDayId(day.id)}
                    className="w-full rounded-2xl border border-border bg-card p-4 flex items-center justify-between card-hover transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-accent/50 flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{day.name}</p>
                        <p className="text-[10px] text-muted-foreground">{day.focus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{numVideos} videos</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
