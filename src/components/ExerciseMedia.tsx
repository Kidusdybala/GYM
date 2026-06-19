import { useState, useRef, useEffect } from "react";
import { ZoomIn, Move, Play, X, Dumbbell } from "lucide-react";

export function ExerciseMedia({
  src,
  alt,
  steps,
  className = "",
}: {
  src?: string;
  alt: string;
  steps?: string[];
  className?: string;
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };
  }, []);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  const showImage = src && !imageError;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setTransform({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
      scale: transform.scale,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    if (!isZoomed) {
      setIsZoomed(true);
      setTransform({ x: 0, y: 0, scale: 2 });
    } else {
      setTransform((prev) => ({ ...prev, scale: Math.min(prev.scale + 0.5, 4) }));
    }
  };

  const handleZoomOut = () => {
    if (transform.scale > 1) {
      setTransform((prev) => ({ ...prev, scale: Math.max(prev.scale - 0.5, 1) }));
      if (transform.scale <= 1.5) {
        setIsZoomed(false);
        setTransform({ x: 0, y: 0, scale: 1 });
      }
    }
  };

  const handleReset = () => {
    setIsZoomed(false);
    setImageError(false);
    setTransform({ x: 0, y: 0, scale: 1 });
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = undefined;
  };

  const playSteps = () => {
    if (!steps || steps.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(true);
    setCurrentStep(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step >= steps.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
        setIsPlaying(false);
        setCurrentStep(0);
      } else {
        setCurrentStep(step);
      }
    }, 2000);
  };

  const stopPlayback = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-black/20 ${className}`}>
      <div
        className={`relative w-full ${isZoomed ? "cursor-move" : "cursor-pointer"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (src?.endsWith('.mp4')) {
            handleFullscreen();
          } else if (!isZoomed) {
            handleZoomIn();
          }
        }}
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "center center",
          }}
        >
          {showImage ? (
            src?.endsWith('.mp4') ? (
              <video
                ref={videoRef}
                src={src}
                className={`w-full object-cover ${isZoomed ? "h-auto max-h-[60vh]" : "h-48 sm:h-56"}`}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setImageError(true)}
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className={`w-full object-cover ${isZoomed ? "h-auto max-h-[60vh]" : "h-48 sm:h-56"}`}
                draggable={false}
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <div className="w-full h-48 sm:h-56 bg-accent/30 flex items-center justify-center gap-2 text-muted-foreground">
              <Dumbbell className="h-6 w-6" />
              <span className="text-sm font-medium">{alt}</span>
            </div>
          )}
        </div>

        {isZoomed && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />}
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        {!isZoomed ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (src?.endsWith('.mp4')) {
                handleFullscreen();
              } else {
                handleZoomIn();
              }
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            {src?.endsWith('.mp4') ? <Move className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleZoomOut();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <span className="text-sm font-bold">−</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleReset();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {isZoomed && isDragging && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 text-white text-[10px] px-2.5 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
          <Move className="h-3 w-3" />
          Dragging
        </div>
      )}

      {steps && steps.length > 0 && showImage && (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-xl p-2.5">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex gap-1">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx <= currentStep ? "bg-primary w-4" : "bg-white/30 w-1.5"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white text-[10px] font-semibold ml-1">
                {currentStep + 1}/{steps.length}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (isPlaying) {
                  stopPlayback();
                } else {
                  playSteps();
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors ml-2"
            >
              {isPlaying ? <X className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
