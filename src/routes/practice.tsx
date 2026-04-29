import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — DSA Comeback" },
      { name: "description", content: "Practice DSA problems with NeetCode 150." },
      { property: "og:title", content: "Practice — DSA Comeback" },
      { property: "og:description", content: "Practice DSA problems with NeetCode 150." },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono">$ open practice/</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">Practice</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          The NeetCode 150 is the gold standard. Open it below and grind through the patterns. (Detailed per-problem tracking ships in the next iteration.)
        </p>
      </header>

      <Card className="p-6 border border-border bg-card">
        <h2 className="text-xl font-bold">NeetCode 150</h2>
        <p className="text-sm text-muted-foreground mt-1">
          150 hand-picked problems covering every essential pattern.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <a href="https://neetcode.io/practice/practice/neetcode150" target="_blank" rel="noreferrer">
              Open NeetCode 150 <ExternalLink className="size-4" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://neetcode.io/roadmap" target="_blank" rel="noreferrer">
              NeetCode Roadmap <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </Card>

      <Card className="mt-4 p-6 border border-dashed border-border bg-card/60">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">// coming soon</p>
        <h3 className="font-bold mt-1">Per-problem status tracker</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Mark each problem as Not Started / Solved, with revision flags. Coming in the next update.
        </p>
      </Card>
    </AppShell>
  );
}
