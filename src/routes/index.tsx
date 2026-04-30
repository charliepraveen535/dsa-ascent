import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useProgress } from "@/hooks/use-progress";
import { MOTIVATIONAL_QUOTES, ROADMAP, TOTAL_DAYS } from "@/lib/roadmap";
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Sparkles, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { state, percent, todaysPlan, toggleDay, setCurrentDay } = useProgress();
  const quote = MOTIVATIONAL_QUOTES[state.currentDay % MOTIVATIONAL_QUOTES.length];
  const isDoneToday = state.completedDays.includes(state.currentDay);
  const streak = computeStreak(state.completedDays);

  return (
    <AppShell>
      <Hero percent={percent} completed={state.completedDays.length} />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        <StatCard
          label="Today's goal"
          value={`${todaysPlan.problemCount} problems`}
          sub={todaysPlan.topic}
          icon={<Target className="size-5" />}
          delay={0}
        />
        <StatCard
          label="Problems solved"
          value={`${state.completedDays.reduce((acc, d) => acc + (ROADMAP[d - 1]?.problemCount ?? 0), 0)}`}
          sub={`${state.completedDays.length} days completed`}
          icon={<CheckCircle2 className="size-5" />}
          delay={0.05}
        />
        <StatCard
          label="Current streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          sub={streak > 0 ? "Keep the fire going" : "Start your streak today"}
          icon={<Flame className="size-5" />}
          delay={0.1}
        />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-6"
      >
        <Card className="p-5 md:p-6 border border-border bg-card rounded-2xl glow-card overflow-hidden relative">
          <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Today · Week {todaysPlan.week}</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-1 font-display">
                Day {todaysPlan.day} — <span className="text-gradient-primary">{todaysPlan.topic}</span>
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentDay(state.currentDay - 1)} disabled={state.currentDay <= 1} aria-label="Previous day">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCurrentDay(state.currentDay + 1)} disabled={state.currentDay >= TOTAL_DAYS} aria-label="Next day">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 relative">
            <div>
              <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-widest font-mono">// tasks</h3>
              <ul className="space-y-2">
                {todaysPlan.tasks.map((t, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-primary mt-0.5 font-mono">›</span>
                    <span>{t}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">// motivation</p>
                <p className="mt-2 text-base leading-relaxed">{quote}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Checkbox
                  id="done-today"
                  checked={isDoneToday}
                  onCheckedChange={() => toggleDay(state.currentDay)}
                />
                <label htmlFor="done-today" className="text-sm cursor-pointer select-none">
                  Mark Day {state.currentDay} as complete
                </label>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 relative">
            <Button asChild className="rounded-xl">
              <Link to="/assistant">
                Ask AI tutor <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link to="/roadmap">View full roadmap</Link>
            </Button>
            <Button variant="ghost" className="rounded-xl" asChild>
              <Link to="/practice">Practice problems</Link>
            </Button>
          </div>
        </Card>
      </motion.section>

      <section className="mt-6">
        <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest font-mono">// up next</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {ROADMAP.slice(state.currentDay, state.currentDay + 3).map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <Card className="p-4 border border-border bg-card rounded-2xl hover:border-primary/40 transition-colors h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Day {d.day}</span>
                  <span className="text-[10px] text-muted-foreground">W{d.week}</span>
                </div>
                <p className="mt-1 font-semibold">{d.topic}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.problemCount} problems</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function computeStreak(days: number[]): number {
  if (days.length === 0) return 0;
  const sorted = [...days].sort((a, b) => b - a);
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] - sorted[i] === 1) streak++;
    else break;
  }
  return streak;
}

function Hero({ percent, completed }: { percent: number; completed: number }) {
  const size = 140;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-hero p-6 md:p-8"
    >
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-mono inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            $ ./dsa-comeback --start
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight font-display tracking-tight">
            Your <span className="text-gradient-primary">30-day</span> DSA comeback,
            <br className="hidden md:block" /> structured & AI-assisted.
          </h1>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
            Follow the roadmap, generate fresh interview-style problems, and get instant doubt resolution. Patterns over problems.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <TrendingUp className="size-3.5 text-primary" />
            <span>{completed}/{TOTAL_DAYS} days completed · {percent}%</span>
          </div>
        </div>

        <div className="relative shrink-0 mx-auto md:mx-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-border fill-none" />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="fill-none stroke-[url(#progGrad)]"
            />
            <defs>
              <linearGradient id="progGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.2 148)" />
                <stop offset="100%" stopColor="oklch(0.7 0.18 258)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono tabular-nums">{percent}%</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">progress</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="p-5 border border-border bg-card rounded-2xl hover:border-primary/30 transition-colors group h-full">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">{label}</p>
          <span className="size-9 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center text-primary group-hover:scale-110 transition-transform">
            {icon}
          </span>
        </div>
        <p className="text-3xl font-bold mt-3 font-mono tabular-nums">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
      </Card>
    </motion.div>
  );
}
<Sparkles className="hidden" />
