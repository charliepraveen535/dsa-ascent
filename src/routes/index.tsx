import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/hooks/use-progress";
import { MOTIVATIONAL_QUOTES, ROADMAP, TOTAL_DAYS } from "@/lib/roadmap";
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Sparkles, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { state, percent, todaysPlan, toggleDay, setCurrentDay } = useProgress();
  const quote = MOTIVATIONAL_QUOTES[state.currentDay % MOTIVATIONAL_QUOTES.length];
  const isDoneToday = state.completedDays.includes(state.currentDay);

  return (
    <AppShell>
      <Hero percent={percent} completed={state.completedDays.length} />

      <section className="grid gap-4 md:grid-cols-3 mt-6">
        <StatCard label="Current day" value={`${state.currentDay} / ${TOTAL_DAYS}`} icon={<Target className="size-4" />} />
        <StatCard label="Completed" value={`${state.completedDays.length} days`} icon={<Flame className="size-4" />} />
        <StatCard label="Progress" value={`${percent}%`} icon={<Sparkles className="size-4" />} />
      </section>

      <section className="mt-6">
        <Card className="p-5 md:p-6 border border-border bg-card">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Today · Week {todaysPlan.week}</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                Day {todaysPlan.day} — <span className="text-gradient-primary">{todaysPlan.topic}</span>
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => setCurrentDay(state.currentDay - 1)} disabled={state.currentDay <= 1} aria-label="Previous day">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentDay(state.currentDay + 1)} disabled={state.currentDay >= TOTAL_DAYS} aria-label="Next day">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Tasks</h3>
              <ul className="space-y-2">
                {todaysPlan.tasks.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">›</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Target: <span className="text-foreground font-semibold">{todaysPlan.problemCount} problems</span>
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-4 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">// motivation</p>
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

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/assistant">
                Ask AI tutor <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/roadmap">View full roadmap</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/practice">Practice problems</Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Up next</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {ROADMAP.slice(state.currentDay, state.currentDay + 3).map((d) => (
            <Card key={d.day} className="p-4 border border-border bg-card hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Day {d.day}</span>
                <span className="text-[10px] text-muted-foreground">W{d.week}</span>
              </div>
              <p className="mt-1 font-semibold">{d.topic}</p>
              <p className="text-xs text-muted-foreground mt-1">{d.problemCount} problems</p>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Hero({ percent, completed }: { percent: number; completed: number }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-primary font-mono">$ ./dsa-comeback --start</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-bold leading-tight">
          Your <span className="text-gradient-primary">30-day</span> DSA comeback,
          <br className="hidden md:block" /> structured & AI-assisted.
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl">
          Follow the roadmap, generate fresh interview-style problems, and get instant doubt resolution from an AI tutor. Patterns over problems.
        </p>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 font-mono">
            <span>progress</span>
            <span>
              {completed}/{30} days · {percent}%
            </span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="p-4 border border-border bg-card">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="text-2xl font-bold mt-2 font-mono">{value}</p>
    </Card>
  );
}
