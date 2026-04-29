import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Map, MessageSquareCode, NotebookPen, ListChecks, Moon, Sun, Terminal } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/practice", label: "Practice", icon: ListChecks },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquareCode },
  { to: "/notes", label: "Notes", icon: NotebookPen },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border bg-sidebar">
        <SidebarInner pathname={pathname} theme={theme} toggle={toggle} />
      </aside>

      {/* Top bar (mobile) */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-sidebar">
        <Brand />
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
            <Terminal className="size-4" />
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-b border-border bg-sidebar">
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
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
                      active
                        ? "bg-sidebar-accent text-sidebar-primary"
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
        </nav>
      )}

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="size-8 rounded-md bg-primary/15 border border-primary/30 grid place-items-center font-bold text-primary">
        {"</>"}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight">DSA Comeback</div>
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
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary border border-sidebar-border"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                  {active && <span className="ml-auto text-[10px] text-sidebar-primary">●</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button variant="ghost" size="sm" onClick={toggle} className="w-full justify-start gap-2">
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
        <p className="text-[10px] text-muted-foreground px-2">
          $ keep_grinding --days 30
        </p>
      </div>
    </div>
  );
}
