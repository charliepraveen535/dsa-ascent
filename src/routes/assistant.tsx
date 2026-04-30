import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Sparkles, User, Bot } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useServerFn } from "@tanstack/react-start";
import { askDoubt, generateQuestion } from "@/server/ai.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — DSA Comeback" },
      { name: "description", content: "Generate DSA practice questions and ask doubts to an AI tutor." },
      { property: "og:title", content: "AI Assistant — DSA Comeback" },
      { property: "og:description", content: "Generate DSA practice questions and ask doubts to an AI tutor." },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-primary font-mono">$ ai --help</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">AI Assistant</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Generate fresh interview-style problems on any topic, or chat with an AI tutor to clear your doubts.
        </p>
      </header>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generate">Question Generator</TabsTrigger>
          <TabsTrigger value="doubt">Doubt Solver</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="mt-4">
          <QuestionGenerator />
        </TabsContent>
        <TabsContent value="doubt" className="mt-4">
          <DoubtSolver />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function QuestionGenerator() {
  const fn = useServerFn(generateQuestion);
  const [topic, setTopic] = useState("Two Pointers");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");

  const onGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Pick a topic first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fn({ data: { topic: topic.trim(), difficulty } });
      if (res.ok) {
        setContent(res.content);
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error("Something went wrong.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 border border-border bg-card">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Topic</label>
          <Input
            placeholder="e.g. Sliding Window, Trees, DP..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Difficulty</label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={onGenerate} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate
          </Button>
        </div>
      </div>

      <div className="mt-5 min-w-0">
        {content ? (
          <article className="prose prose-sm dark:prose-invert max-w-none w-full min-w-0 rounded-md border border-border bg-muted/30 p-4 sm:p-5 break-words [overflow-wrap:anywhere] [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre [&_code]:break-words [&_code]:whitespace-pre-wrap [&_pre_code]:whitespace-pre [&_table]:block [&_table]:overflow-x-auto">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        ) : (
          <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            <Sparkles className="size-5 mx-auto text-primary mb-2" />
            Pick a topic and difficulty, then hit Generate to get a fresh interview-style problem.
          </div>
        )}
      </div>
    </Card>
  );
}

type ChatMsg = { role: "user" | "assistant"; content: string };

function DoubtSolver() {
  const fn = useServerFn(askDoubt);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fn({ data: { messages: next } });
      if (res.ok) {
        setMessages([...next, { role: "assistant", content: res.content }]);
      } else {
        toast.error(res.error);
        setMessages(next);
      }
    } catch (e) {
      toast.error("Something went wrong.");
      console.error(e);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const prompts = [
    "Explain sliding window with an example",
    "What's the difference between BFS and DFS?",
    "When should I use a heap vs a sorted array?",
    "Walk me through DP on subsequences",
  ];

  return (
    <Card className="border border-border bg-card flex flex-col h-[68vh] min-h-[480px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot className="size-8 text-primary mb-3" />
            <h3 className="font-bold">Ask anything DSA-related</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Concepts, complexity, debugging your approach, pattern hints — your tutor is ready.
            </p>
            <div className="mt-4 grid gap-2 w-full max-w-md">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="text-left text-sm rounded-md border border-border bg-muted/30 hover:bg-muted px-3 py-2 transition-colors"
                >
                  <span className="text-primary mr-2">›</span>
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <ChatBubble key={i} msg={m} />)
        )}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Thinking…
          </div>
        )}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a DSA doubt… (Enter to send, Shift+Enter for newline)"
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon" aria-label="Send">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ChatBubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "size-8 shrink-0 rounded-md grid place-items-center border",
          isUser ? "bg-primary/15 border-primary/30 text-primary" : "bg-muted border-border",
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div
        className={cn(
          "rounded-md px-4 py-3 max-w-[85%] border",
          isUser ? "bg-primary/10 border-primary/30" : "bg-muted/40 border-border",
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <article className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </article>
        )}
      </div>
    </div>
  );
}
