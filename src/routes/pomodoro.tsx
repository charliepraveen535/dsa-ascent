import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipForward, Timer, Coffee, Brain } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/pomodoro")({
  head: () => ({
    meta: [
      { title: "Pomodoro — DSA Comeback" },
      { name: "description", content: "Focus timer for deep DSA practice sessions with built-in short and long breaks." },
      { property: "og:title", content: "Pomodoro — DSA Comeback" },
      { property: "og:description", content: "Focus timer for deep DSA practice sessions with built-in short and long breaks." },
    ],
  }),
  component: PomodoroPage,
});

type Mode = "focus" | "short" | "long";

type Settings = {
  focus: number; // minutes
  short: number;
  long: number;
  longEvery: number; // after N focus sessions
};

const DEFAULT_SETTINGS: Settings = { focus: 25, short: 5, long: 15, longEvery: 4 };

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    o.start();
    o.stop(ctx.currentTime + 0.65);
  } catch {
    // ignore
  }
}

function PomodoroPage() {
  const [settings, setSettings] = useLocalStorage<Settings>("dsa.pomodoro.settings", DEFAULT_SETTINGS);
  const [completed, setCompleted] = useLocalStorage<number>("dsa.pomodoro.completed", 0);
  const [mode, setMode] = useState<Mode>("focus");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(settings.focus * 60);
  const tickRef = useRef<number | null>(null);

  const totalSeconds = useMemo(() => {
    if (mode === "focus") return settings.focus * 60;
    if (mode === "short") return settings.short * 60;
    return settings.long * 60;
  }, [mode, settings]);

  // Reset timer when mode changes or settings change while not running
  useEffect(() => {
    if (!running) setSecondsLeft(totalSeconds);
  }, [totalSeconds, running]);

  useEffect(() => {
    if (!running) {
      if (tickRef.current) {
        window.clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(tickRef.current!);
          tickRef.current = null;
          handleComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Keep tab title in sync
  useEffect(() => {
    const label = mode === "focus" ? "Focus" : mode === "short" ? "Short break" : "Long break";
    document.title = `${formatTime(secondsLeft)} · ${label} — DSA Comeback`;
    return () => {
      document.title = "DSA Comeback";
    };
  }, [secondsLeft, mode]);

  function handleComplete() {
    beep();
    setRunning(false);
    if (mode === "focus") {
      const next = completed + 1;
      setCompleted(next);
      const nextMode: Mode = next % settings.longEvery === 0 ? "long" : "short";
      toast.success(`Focus done! Time for a ${nextMode === "long" ? "long" : "short"} break.`);
      setMode(nextMode);
    } else {
      toast.success("Break over. Back to the grind.");
      setMode("focus");
    }
  }

  function skip() {
    setRunning(false);
    if (mode === "focus") {
      const next = completed + 1;
      setCompleted(next);
      setMode(next % settings.longEvery === 0 ? "long" : "short");
    } else {
      setMode("focus");
    }
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  }

  const progress = 1 - secondsLeft / totalSeconds;
  const accent =
    mode === "focus"
      ? "text-primary"
      : mode === "short"
        ? "text-[oklch(0.78_0.15_180)]"
        : "text-[oklch(0.78_0.15_60)]";

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono">$ pomodoro --focus</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 font-display tracking-tight">Pomodoro Timer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Deep work in focused intervals. Solve, breathe, repeat.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 md:p-10 border border-border bg-card rounded-2xl relative overflow-hidden">
          <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="relative">
            <ModeTabs mode={mode} setMode={(m) => { setRunning(false); setMode(m); }} />

            <div className="mt-10 flex flex-col items-center">
              <Ring progress={progress} accentClass={accent} running={running}>
                <div className="text-center">
                  <div className={cn("font-mono font-bold tabular-nums text-6xl md:text-7xl", accent)}>
                    {formatTime(secondsLeft)}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground font-mono">
                    {mode === "focus" ? "focus session" : mode === "short" ? "short break" : "long break"}
                  </div>
                </div>
              </Ring>

              <div className="mt-10 flex items-center gap-2">
                <Button size="lg" onClick={() => setRunning((r) => !r)} className="min-w-32 rounded-xl">
                  {running ? <Pause className="size-4" /> : <Play className="size-4" />}
                  {running ? "Pause" : "Start"}
                </Button>
                <Button size="lg" variant="outline" onClick={reset} aria-label="Reset" className="rounded-xl">
                  <RotateCcw className="size-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={skip} aria-label="Skip" className="rounded-xl">
                  <SkipForward className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5 border border-border bg-card rounded-2xl">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Stats</h3>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-4xl font-bold tabular-nums font-mono">{completed}</div>
                <div className="text-xs text-muted-foreground mt-1">Focus sessions completed</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setCompleted(0)} className="rounded-xl">
                Reset
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold font-mono">{Math.round(completed * settings.focus / 60 * 10) / 10}h</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">total focus</div>
              </div>
              <div>
                <div className="text-lg font-bold font-mono">{Math.floor(completed / settings.longEvery)}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">long breaks</div>
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border bg-card rounded-2xl">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Settings (minutes)</h3>
            <div className="mt-3 grid gap-3">
              <SettingRow label="Focus" value={settings.focus} onChange={(v) => setSettings((s) => ({ ...s, focus: v }))} />
              <SettingRow label="Short break" value={settings.short} onChange={(v) => setSettings((s) => ({ ...s, short: v }))} />
              <SettingRow label="Long break" value={settings.long} onChange={(v) => setSettings((s) => ({ ...s, long: v }))} />
              <SettingRow label="Long break every" value={settings.longEvery} onChange={(v) => setSettings((s) => ({ ...s, longEvery: Math.max(1, v) }))} suffix="sessions" />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function SettingRow({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={180}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 text-right font-mono"
        />
        {suffix && <span className="text-xs text-muted-foreground w-16">{suffix}</span>}
      </div>
    </label>
  );
}

function ModeTabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const tabs: { id: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "focus", label: "Focus", icon: Brain },
    { id: "short", label: "Short break", icon: Coffee },
    { id: "long", label: "Long break", icon: Timer },
  ];
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors font-mono",
              active
                ? "bg-primary/10 border-primary/40 text-primary"
                : "border-border bg-muted/30 text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function Ring({
  progress,
  accentClass,
  running,
  children,
}: {
  progress: number;
  accentClass: string;
  running: boolean;
  children: React.ReactNode;
}) {
  const size = 300;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(1, Math.max(0, progress)));
  return (
    <div className={cn("relative rounded-full", running && "animate-pulse-ring")} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.2 148)" />
            <stop offset="100%" stopColor="oklch(0.7 0.18 258)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-border fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn("fill-none transition-[stroke-dashoffset] duration-1000 ease-linear", accentClass)}
          stroke="url(#ringGrad)"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
