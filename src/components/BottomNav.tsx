import { Link } from "@tanstack/react-router";
import { Home, Dumbbell, History as HistoryIcon } from "lucide-react";

const items = [
  { to: "/", label: "Today", icon: Home },
  { to: "/plan", label: "Plan", icon: Dumbbell },
  { to: "/history", label: "History", icon: HistoryIcon },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors data-[status=active]:text-primary"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
