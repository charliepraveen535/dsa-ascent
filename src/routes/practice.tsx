import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search, Check, Circle } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — DSA Comeback" },
      { name: "description", content: "Practice DSA problems with the NeetCode 150 list, organized by pattern." },
      { property: "og:title", content: "Practice — DSA Comeback" },
      { property: "og:description", content: "Practice DSA problems by pattern." },
    ],
  }),
  component: PracticePage,
});

type Difficulty = "Easy" | "Medium" | "Hard";
type Problem = { id: string; title: string; difficulty: Difficulty; pattern: string; url: string };

const PROBLEMS: Problem[] = [
  { id: "two-sum", title: "Two Sum", difficulty: "Easy", pattern: "Arrays & Hashing", url: "https://leetcode.com/problems/two-sum/" },
  { id: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", pattern: "Arrays & Hashing", url: "https://leetcode.com/problems/valid-anagram/" },
  { id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", pattern: "Arrays & Hashing", url: "https://leetcode.com/problems/group-anagrams/" },
  { id: "top-k-frequent", title: "Top K Frequent Elements", difficulty: "Medium", pattern: "Arrays & Hashing", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", pattern: "Two Pointers", url: "https://leetcode.com/problems/valid-palindrome/" },
  { id: "two-sum-ii", title: "Two Sum II", difficulty: "Medium", pattern: "Two Pointers", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: "3sum", title: "3Sum", difficulty: "Medium", pattern: "Two Pointers", url: "https://leetcode.com/problems/3sum/" },
  { id: "container-water", title: "Container With Most Water", difficulty: "Medium", pattern: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/" },
  { id: "best-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", pattern: "Sliding Window", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "longest-substring", title: "Longest Substring Without Repeating", difficulty: "Medium", pattern: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: "min-window", title: "Minimum Window Substring", difficulty: "Hard", pattern: "Sliding Window", url: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: "valid-paren", title: "Valid Parentheses", difficulty: "Easy", pattern: "Stack", url: "https://leetcode.com/problems/valid-parentheses/" },
  { id: "min-stack", title: "Min Stack", difficulty: "Medium", pattern: "Stack", url: "https://leetcode.com/problems/min-stack/" },
  { id: "daily-temps", title: "Daily Temperatures", difficulty: "Medium", pattern: "Stack", url: "https://leetcode.com/problems/daily-temperatures/" },
  { id: "binary-search", title: "Binary Search", difficulty: "Easy", pattern: "Binary Search", url: "https://leetcode.com/problems/binary-search/" },
  { id: "search-rotated", title: "Search in Rotated Sorted Array", difficulty: "Medium", pattern: "Binary Search", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "reverse-list", title: "Reverse Linked List", difficulty: "Easy", pattern: "Linked List", url: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: "merge-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", pattern: "Linked List", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: "lru-cache", title: "LRU Cache", difficulty: "Medium", pattern: "Linked List", url: "https://leetcode.com/problems/lru-cache/" },
  { id: "max-depth", title: "Maximum Depth of Binary Tree", difficulty: "Easy", pattern: "Trees", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: "invert-tree", title: "Invert Binary Tree", difficulty: "Easy", pattern: "Trees", url: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: "validate-bst", title: "Validate Binary Search Tree", difficulty: "Medium", pattern: "Trees", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "num-islands", title: "Number of Islands", difficulty: "Medium", pattern: "Graphs", url: "https://leetcode.com/problems/number-of-islands/" },
  { id: "clone-graph", title: "Clone Graph", difficulty: "Medium", pattern: "Graphs", url: "https://leetcode.com/problems/clone-graph/" },
  { id: "course-schedule", title: "Course Schedule", difficulty: "Medium", pattern: "Graphs", url: "https://leetcode.com/problems/course-schedule/" },
  { id: "climb-stairs", title: "Climbing Stairs", difficulty: "Easy", pattern: "DP", url: "https://leetcode.com/problems/climbing-stairs/" },
  { id: "house-robber", title: "House Robber", difficulty: "Medium", pattern: "DP", url: "https://leetcode.com/problems/house-robber/" },
  { id: "coin-change", title: "Coin Change", difficulty: "Medium", pattern: "DP", url: "https://leetcode.com/problems/coin-change/" },
  { id: "lcs", title: "Longest Common Subsequence", difficulty: "Medium", pattern: "DP", url: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: "edit-distance", title: "Edit Distance", difficulty: "Hard", pattern: "DP", url: "https://leetcode.com/problems/edit-distance/" },
];

const ALL_PATTERNS = ["All", ...Array.from(new Set(PROBLEMS.map((p) => p.pattern)))];

function PracticePage() {
  const [solved, setSolved] = useLocalStorage<Record<string, boolean>>("dsa.practice.solved", {});
  const [query, setQuery] = useState("");
  const [pattern, setPattern] = useState<string>("All");
  const [diff, setDiff] = useState<"All" | Difficulty>("All");

  const filtered = useMemo(() => {
    return PROBLEMS.filter((p) => {
      if (pattern !== "All" && p.pattern !== pattern) return false;
      if (diff !== "All" && p.difficulty !== diff) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, pattern, diff]);

  const totalSolved = Object.values(solved).filter(Boolean).length;

  const toggle = (id: string) => setSolved((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <AppShell>
      <header className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-mono">$ open practice/</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 font-display tracking-tight">Practice</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Hand-picked problems organized by pattern. Track what you've solved.
          </p>
        </div>
        <Card className="px-4 py-3 rounded-2xl border border-border">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Solved</div>
          <div className="font-mono text-2xl font-bold tabular-nums">
            {totalSolved}<span className="text-muted-foreground text-base">/{PROBLEMS.length}</span>
          </div>
        </Card>
      </header>

      <Card className="p-4 rounded-2xl border border-border bg-card">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search problems…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <FilterChips
            options={["All", "Easy", "Medium", "Hard"]}
            value={diff}
            onChange={(v) => setDiff(v as typeof diff)}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_PATTERNS.map((p) => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono border transition-colors",
                pattern === p
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => {
          const isSolved = !!solved[p.id];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3) }}
              whileHover={{ y: -2 }}
            >
              <Card className={cn(
                "p-4 rounded-2xl border bg-card transition-all h-full flex flex-col gap-3",
                isSolved ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"
              )}>
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => toggle(p.id)}
                    aria-label={isSolved ? "Mark unsolved" : "Mark solved"}
                    className={cn(
                      "shrink-0 size-7 rounded-lg grid place-items-center border transition-all",
                      isSolved
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {isSolved ? <Check className="size-4" /> : <Circle className="size-3.5" />}
                  </button>
                  <DifficultyBadge difficulty={p.difficulty} />
                </div>
                <div className="min-w-0">
                  <h3 className={cn("font-semibold leading-tight", isSolved && "line-through text-muted-foreground")}>
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{p.pattern}</p>
                </div>
                <div className="mt-auto">
                  <Button asChild size="sm" variant="outline" className="rounded-xl w-full">
                    <a href={p.url} target="_blank" rel="noreferrer">
                      Open <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="mt-6 p-8 rounded-2xl border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground">No problems match your filters.</p>
        </Card>
      )}
    </AppShell>
  );
}

function FilterChips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl border border-border bg-muted/30">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors",
            value === o ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const cls =
    difficulty === "Easy"
      ? "bg-primary/10 text-primary border-primary/30"
      : difficulty === "Medium"
        ? "bg-[oklch(0.78_0.16_75/0.12)] text-[oklch(0.78_0.16_75)] border-[oklch(0.78_0.16_75/0.3)]"
        : "bg-destructive/10 text-destructive border-destructive/30";
  return (
    <span className={cn("text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border", cls)}>
      {difficulty}
    </span>
  );
}
