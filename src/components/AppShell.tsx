import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, UserPlus, Users, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight,
  History, Code2, Landmark, Menu, X, Search, RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { resetDemo } from "@/lib/bank";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create", label: "Create Account", icon: UserPlus },
  { to: "/accounts", label: "View Accounts", icon: Users },
  { to: "/deposit", label: "Deposit", icon: ArrowDownToLine },
  { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
  { to: "/transfer", label: "Transfer", icon: ArrowLeftRight },
  { to: "/transactions", label: "Transactions", icon: History },
  { to: "/cpp", label: "C++ OOP Code", icon: Code2 },
] as const;

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hero text-primary-foreground shadow-lg">
        <Landmark className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold text-navy-foreground">NovaBank</div>
        <div className="text-xs text-navy-foreground/60">Management System</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 bg-navy p-4">
      <div className="mb-6 flex items-center justify-between px-2 pt-2">
        <Logo />
        <button className="text-navy-foreground lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-foreground/70 transition-colors hover:bg-navy-muted hover:text-navy-foreground data-[status=active]:bg-navy-muted data-[status=active]:text-navy-foreground"
        >
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
      <div className="mt-auto rounded-xl bg-navy-muted p-4 text-xs text-navy-foreground/70">
        Frontend: React + TypeScript. Core OOP logic: separate C++ program.
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 animate-in slide-in-from-left">{sidebar}</aside>
        </div>
      )}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <form
          className="relative min-w-0 flex-1 max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/accounts", search: { q: q.trim() } });
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className="field pl-9" placeholder="Search account no. or name…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <AlertDialog>
          <AlertDialogTrigger className="ml-auto inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent">
            <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Reset demo</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restore sample data?</AlertDialogTitle>
              <AlertDialogDescription>All current accounts and transactions will be replaced with demo data.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { resetDemo(); toast.success("Demo data restored"); }}>Restore</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 fade-up">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const cls =
    type === "Deposit" ? "bg-success/12 text-success"
    : type === "Withdrawal" ? "bg-destructive/10 text-destructive"
    : type === "Transfer" ? "bg-chart-3/12 text-chart-3"
    : type === "Savings" ? "bg-secondary text-secondary-foreground"
    : "bg-warning/15 text-warning";
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{type}</span>;
}
