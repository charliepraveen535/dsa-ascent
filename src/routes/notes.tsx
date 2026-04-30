import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Plus, Trash2, NotebookPen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Note = {
  id: string;
  topic: string;
  body: string;
  updatedAt: number;
};

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — DSA Comeback" },
      { name: "description", content: "Save topic-wise DSA notes locally on your device." },
      { property: "og:title", content: "Notes — DSA Comeback" },
      { property: "og:description", content: "Save topic-wise DSA notes locally on your device." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>("dsa.notes", []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const active = notes.find((n) => n.id === activeId) ?? null;

  const filtered = useMemo(() => {
    if (!query) return notes;
    const q = query.toLowerCase();
    return notes.filter((n) => n.topic.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
  }, [notes, query]);

  const create = () => {
    const id = crypto.randomUUID();
    const note: Note = { id, topic: "New note", body: "", updatedAt: Date.now() };
    setNotes((prev) => [note, ...prev]);
    setActiveId(id);
  };

  const update = (patch: Partial<Note>) => {
    if (!active) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
    );
  };

  const remove = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return (
    <AppShell>
      <header className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-mono">$ vim notes/</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 font-display tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Topic-wise notes saved locally on this device.
          </p>
        </div>
        <Button onClick={create} className="rounded-xl">
          <Plus className="size-4" /> New note
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          <Card className="p-2 border border-border bg-card rounded-2xl">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <NotebookPen className="size-5 mx-auto mb-2 text-primary" />
                {notes.length === 0 ? "No notes yet. Create your first one." : "No matches."}
              </div>
            ) : (
              <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {filtered.map((n) => (
                    <motion.li
                      key={n.id}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button
                        onClick={() => setActiveId(n.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-all",
                          activeId === n.id
                            ? "bg-primary/10 border-primary/40 text-foreground"
                            : "border-transparent hover:bg-muted hover:border-border",
                        )}
                      >
                        <div className="font-medium truncate">{n.topic || "Untitled"}</div>
                        <div className="text-xs text-muted-foreground truncate mt-0.5">
                          {n.body.slice(0, 60) || "No content"}
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </Card>
        </div>

        <Card className="p-4 md:p-5 border border-border bg-card rounded-2xl min-h-[60vh]">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full gap-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={active.topic}
                    onChange={(e) => update({ topic: e.target.value })}
                    placeholder="Topic / title"
                    className="font-bold text-lg border-0 bg-transparent px-0 focus-visible:ring-0 shadow-none"
                    maxLength={120}
                  />
                  <Button variant="ghost" size="icon" onClick={() => remove(active.id)} aria-label="Delete" className="rounded-xl">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="h-px bg-border" />
                <Textarea
                  value={active.body}
                  onChange={(e) => update({ body: e.target.value })}
                  placeholder="Write notes in markdown… code samples, complexity, pattern reminders."
                  className="flex-1 min-h-[50vh] font-mono text-sm border-0 bg-transparent px-0 resize-none focus-visible:ring-0 shadow-none"
                />
                <p className="text-[10px] text-muted-foreground font-mono">
                  last edited {new Date(active.updatedAt).toLocaleString()}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full grid place-items-center text-sm text-muted-foreground text-center min-h-[55vh]"
              >
                <div>
                  <NotebookPen className="size-8 mx-auto text-primary mb-3" />
                  <p className="font-semibold text-foreground">No note selected</p>
                  <p className="mt-1">Pick a note from the list or create a new one.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </AppShell>
  );
}
