import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Map, MessageSquareCode, NotebookPen, ListChecks, Moon, Sun, Menu, Timer, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/practice", label: "Practice", icon: ListChecks },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquareCode },
  { to: "/notes", label: "Notes", icon: NotebookPen },
  { to: "/pomodoro", label: "Pomodoro", icon: Timer },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-sidebar">
        <SidebarInner pathname={pathname} theme={theme} toggle={toggle} />
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-sidebar/80 backdrop-blur sticky top-0 z-30">
        <Brand />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border bg-sidebar overflow-hidden"
          >
            <ul className="p-2 grid grid-cols-2 gap-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-sidebar-foreground hover:bg-sidebar-accent",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="size-9 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 grid place-items-center font-bold text-primary group-hover:scale-105 transition-transform">
        {"</>"}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight font-display">DSA Comeback</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">30-day plan</div>
      </div>
    </Link>
  );
}

function SidebarInner({
  pathname,
  theme,
  toggle,
}: {
  pathname: string;
  theme: string;
  toggle: () => void;
}) {
  return (
    <div className="flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-sidebar-border">
        <Brand />
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
                    active
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_20px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)]"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground border border-transparent",
                  )}
                >
                  <Icon className={cn("size-4 transition-transform group-hover:scale-110", active && "text-primary")} />
                  {item.label}
                  {active && <span className="ml-auto size-1.5 rounded-full bg-primary animate-pulse" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button variant="ghost" size="sm" onClick={toggle} className="w-full justify-start gap-2 rounded-xl">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
        <p className="text-[10px] text-muted-foreground px-2 font-mono">
          $ keep_grinding --days 30
        </p>
      </div>
    </div>
  );
}
