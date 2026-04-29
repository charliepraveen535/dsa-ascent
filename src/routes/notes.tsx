import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Plus, Trash2, NotebookPen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

  const active = notes.find((n) => n.id === activeId) ?? null;

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
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Notes</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Topic-wise notes saved locally on this device.
          </p>
        </div>
        <Button onClick={create}>
          <Plus className="size-4" /> New note
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <Card className="p-2 border border-border bg-card h-fit">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <NotebookPen className="size-5 mx-auto mb-2 text-primary" />
              No notes yet. Create your first one.
            </div>
          ) : (
            <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
              {notes.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setActiveId(n.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm border transition-colors",
                      activeId === n.id
                        ? "bg-primary/10 border-primary/40 text-foreground"
                        : "border-transparent hover:bg-muted",
                    )}
                  >
                    <div className="font-medium truncate">{n.topic || "Untitled"}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {n.body.slice(0, 60) || "No content"}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4 border border-border bg-card min-h-[60vh]">
          {active ? (
            <div className="flex flex-col h-full gap-3">
              <div className="flex items-center gap-2">
                <Input
                  value={active.topic}
                  onChange={(e) => update({ topic: e.target.value })}
                  placeholder="Topic / title"
                  className="font-bold"
                  maxLength={120}
                />
                <Button variant="ghost" size="icon" onClick={() => remove(active.id)} aria-label="Delete">
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <Textarea
                value={active.body}
                onChange={(e) => update({ body: e.target.value })}
                placeholder="Write notes in markdown… code samples, complexity, pattern reminders."
                className="flex-1 min-h-[50vh] font-mono text-sm"
              />
              <p className="text-[10px] text-muted-foreground font-mono">
                last edited {new Date(active.updatedAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="h-full grid place-items-center text-sm text-muted-foreground text-center">
              <div>
                <NotebookPen className="size-6 mx-auto text-primary mb-2" />
                Select a note or create a new one.
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
