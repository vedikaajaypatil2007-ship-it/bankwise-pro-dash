import { Link } from "@tanstack/react-router";
import { fmtDate, holderOf, inr, useBank, type Transaction } from "@/lib/bank";
import { TypeBadge } from "./AppShell";

export function TxTable({ txs, empty = "No transactions yet." }: { txs: Transaction[]; empty?: string }) {
  const bank = useBank();
  if (!txs.length) return <p className="p-8 text-center text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Account</th>
            <th className="px-4 py-3 font-semibold">Details</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((t) => (
            <tr key={t.id} className="border-b last:border-0 transition-colors hover:bg-muted/60">
              <td className="px-4 py-3"><TypeBadge type={t.type} /></td>
              <td className="px-4 py-3">
                <Link to="/accounts/$number" params={{ number: t.account }} className="font-semibold text-primary hover:underline">
                  #{t.account}
                </Link>
                <div className="text-xs text-muted-foreground">{holderOf(bank, t.account)}</div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {t.type === "Transfer" ? <>To #{t.toAccount} · {holderOf(bank, t.toAccount)}</> : t.type === "Deposit" ? "Cash deposit" : "Cash withdrawal"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{fmtDate(t.date)}</td>
              <td className={`px-4 py-3 text-right font-semibold ${t.type === "Deposit" ? "text-success" : t.type === "Withdrawal" ? "text-destructive" : "text-foreground"}`}>
                {t.type === "Deposit" ? "+" : "−"}{inr(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
