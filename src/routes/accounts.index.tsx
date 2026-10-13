import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Eye } from "lucide-react";
import { inr, useBank } from "@/lib/bank";
import { PageHeader, TypeBadge } from "@/components/AppShell";

export const Route = createFileRoute("/accounts/")({
  validateSearch: (s: Record<string, unknown>) => ({ q: s["q"] != null ? String(s["q"]) : undefined }) as { q?: string },
  head: () => ({
    meta: [
      { title: "Accounts — NovaBank" },
      { name: "description", content: "Search and view all bank accounts." },
      { property: "og:title", content: "Accounts — NovaBank" },
      { property: "og:description", content: "Search and view all bank accounts." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const { accounts } = useBank();
  const q = Route.useSearch().q ?? "";
  const navigate = Route.useNavigate();
  const term = q.toLowerCase();
  const list = accounts.filter((a) => a.number.includes(term) || a.holder.toLowerCase().includes(term));

  return (
    <>
      <PageHeader title="View Accounts" subtitle={`${accounts.length} accounts in the bank`} />
      <div className="card-surface fade-up">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input className="field pl-9" placeholder="Search by number or name" value={q}
              onChange={(e) => navigate({ search: { q: e.target.value }, replace: true })} />
          </div>
          <Link to="/create" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90">+ New account</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Account No.</th><th className="px-4 py-3">Holder</th>
                <th className="px-4 py-3">Type</th><th className="px-4 py-3 text-right">Balance</th><th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.number} className="border-b last:border-0 hover:bg-muted/60">
                  <td className="px-4 py-3 font-semibold">#{a.number}</td>
                  <td className="px-4 py-3">{a.holder}</td>
                  <td className="px-4 py-3"><TypeBadge type={a.type} /></td>
                  <td className="px-4 py-3 text-right font-semibold">{inr(a.balance)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/accounts/$number" params={{ number: a.number }} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-primary hover:bg-secondary">
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <p className="p-8 text-center text-sm text-muted-foreground">No accounts match “{q}”.</p>}
        </div>
      </div>
    </>
  );
}
