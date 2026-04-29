import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { ROADMAP } from "@/lib/roadmap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "30-Day Roadmap — DSA Comeback" },
      { name: "description", content: "Week-wise DSA roadmap from basics to advanced topics. Track your progress day by day." },
      { property: "og:title", content: "30-Day Roadmap — DSA Comeback" },
      { property: "og:description", content: "Week-wise DSA roadmap from basics to advanced topics." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { state, toggleDay, setCurrentDay } = useProgress();
  const weeks = [1, 2, 3, 4] as const;
  const weekTitles: Record<number, string> = {
    1: "Foundations",
    2: "Linear Structures",
    3: "Trees & Graphs",
    4: "Advanced Patterns",
  };

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono">$ cat roadmap.md</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">30-Day Roadmap</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          A structured weekly progression from the absolute basics to interview-grade patterns. Tick a day off when you finish its tasks.
        </p>
      </header>

      <div className="space-y-8">
        {weeks.map((w) => {
          const days = ROADMAP.filter((d) => d.week === w);
          const completed = days.filter((d) => state.completedDays.includes(d.day)).length;
          return (
            <section key={w}>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-xl font-bold">
                  Week {w}{" "}
                  <span className="text-muted-foreground font-normal text-base">— {weekTitles[w]}</span>
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  {completed}/{days.length} done
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {days.map((d) => {
                  const done = state.completedDays.includes(d.day);
                  const isCurrent = state.currentDay === d.day;
                  return (
                    <Card
                      key={d.day}
                      className={cn(
                        "p-4 border bg-card transition-all",
                        done ? "border-primary/40 bg-primary/5" : "border-border",
                        isCurrent && !done && "border-primary glow-primary",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={done}
                          onCheckedChange={() => toggleDay(d.day)}
                          className="mt-1"
                          aria-label={`Mark day ${d.day} complete`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                              Day {d.day}
                              {isCurrent && <span className="ml-2 text-primary">● current</span>}
                            </p>
                            <span className="text-[10px] text-muted-foreground">{d.problemCount} problems</span>
                          </div>
                          <h3 className={cn("font-semibold mt-1", done && "line-through text-muted-foreground")}>
                            {d.topic}
                          </h3>
                          <ul className="mt-2 space-y-1">
                            {d.tasks.map((t, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                                <span className="text-primary">›</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => setCurrentDay(d.day)}
                          >
                            Set as today
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
