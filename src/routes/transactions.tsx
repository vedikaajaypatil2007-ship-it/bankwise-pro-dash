import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useBank, type TxType } from "@/lib/bank";
import { PageHeader } from "@/components/AppShell";
import { TxTable } from "@/components/TxTable";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transaction History — NovaBank" },
      { name: "description", content: "All deposits, withdrawals and transfers." },
      { property: "og:title", content: "Transaction History — NovaBank" },
      { property: "og:description", content: "All deposits, withdrawals and transfers." },
    ],
  }),
  component: TxPage,
});

function TxPage() {
  const { transactions } = useBank();
  const [filter, setFilter] = useState<TxType | "All">("All");
  const [q, setQ] = useState("");
  const list = transactions.filter(
    (t) => (filter === "All" || t.type === filter) && (!q || t.account.includes(q) || t.toAccount?.includes(q)),
  );
  return (
    <>
      <PageHeader title="Transaction History" subtitle={`${transactions.length} transactions recorded`} />
      <div className="card-surface fade-up">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["All", "Deposit", "Withdrawal", "Transfer"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                {f}
              </button>
            ))}
          </div>
          <input className="field sm:max-w-[200px]" placeholder="Filter by account no." value={q} onChange={(e) => setQ(e.target.value.trim())} />
        </div>
        <TxTable txs={list} empty="No matching transactions." />
      </div>
    </>
  );
}
