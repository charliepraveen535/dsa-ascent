import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { ROADMAP } from "@/lib/roadmap";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Zap } from "lucide-react";

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

const weekTitles: Record<number, string> = {
  1: "Foundations",
  2: "Linear Structures",
  3: "Trees & Graphs",
  4: "Advanced Patterns",
};

function RoadmapPage() {
  const { state, toggleDay, setCurrentDay } = useProgress();
  const weeks = [1, 2, 3, 4] as const;

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-primary font-mono">$ cat roadmap.md</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 font-display tracking-tight">30-Day Roadmap</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          A structured weekly progression from the absolute basics to interview-grade patterns.
        </p>
      </header>

      <div className="space-y-10">
        {weeks.map((w) => {
          const days = ROADMAP.filter((d) => d.week === w);
          const completed = days.filter((d) => state.completedDays.includes(d.day)).length;
          return (
            <section key={w}>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold font-display">
                  Week {w}{" "}
                  <span className="text-muted-foreground font-normal text-base">— {weekTitles[w]}</span>
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  {completed}/{days.length} done
                </span>
              </div>

              {/* Vertical timeline */}
              <div className="relative">
                <div className="absolute left-4 md:left-5 top-0 bottom-0 w-px bg-border" />
                <ul className="space-y-3">
                  {days.map((d, idx) => {
                    const done = state.completedDays.includes(d.day);
                    const isCurrent = state.currentDay === d.day;
                    return (
                      <motion.li
                        key={d.day}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                        className="relative pl-12 md:pl-14"
                      >
                        {/* Node */}
                        <div className={cn(
                          "absolute left-0 top-3 size-9 md:size-10 rounded-xl grid place-items-center border-2 transition-all",
                          done
                            ? "bg-primary text-primary-foreground border-primary"
                            : isCurrent
                              ? "bg-primary/10 border-primary text-primary animate-pulse-ring"
                              : "bg-card border-border text-muted-foreground"
                        )}>
                          {done ? <CheckCircle2 className="size-4" /> : isCurrent ? <Zap className="size-4" /> : <Circle className="size-4" />}
                        </div>

                        <motion.div whileHover={{ scale: 1.01 }}>
                          <Card
                            className={cn(
                              "p-4 md:p-5 rounded-2xl border transition-all",
                              done && "border-primary/40 bg-primary/5",
                              isCurrent && !done && "border-primary glow-primary",
                              !done && !isCurrent && "border-border bg-card hover:border-primary/30"
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
                                  <span className="text-[10px] text-muted-foreground font-mono">{d.problemCount} problems</span>
                                </div>
                                <h3 className={cn("font-semibold mt-1 text-base md:text-lg font-display", done && "line-through text-muted-foreground")}>
                                  {d.topic}
                                </h3>
                                <ul className="mt-2 space-y-1">
                                  {d.tasks.map((t, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                                      <span className="text-primary font-mono">›</span>
                                      <span>{t}</span>
                                    </li>
                                  ))}
                                </ul>
                                {!isCurrent && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 h-7 text-xs rounded-lg"
                                    onClick={() => setCurrentDay(d.day)}
                                  >
                                    Set as today
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
