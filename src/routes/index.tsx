import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Wallet, ArrowDownToLine, ArrowUpFromLine, ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { inr, useBank } from "@/lib/bank";
import { TxTable } from "@/components/TxTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NovaBank" },
      { name: "description", content: "Overview of accounts, deposits, withdrawals and recent transactions." },
      { property: "og:title", content: "Dashboard — NovaBank" },
      { property: "og:description", content: "Bank Management System dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const bank = useBank();
  const deposits = bank.transactions.filter((t) => t.type === "Deposit").reduce((s, t) => s + t.amount, 0);
  const withdrawals = bank.transactions.filter((t) => t.type === "Withdrawal").reduce((s, t) => s + t.amount, 0);
  const transfers = bank.transactions.filter((t) => t.type === "Transfer").reduce((s, t) => s + t.amount, 0);
  const totalBal = bank.accounts.reduce((s, a) => s + a.balance, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    const row = { day: d.toLocaleDateString("en-IN", { weekday: "short" }), Deposits: 0, Withdrawals: 0, Transfers: 0 };
    bank.transactions.forEach((t) => {
      if (new Date(t.date).toDateString() !== key) return;
      if (t.type === "Deposit") row.Deposits += t.amount;
      else if (t.type === "Withdrawal") row.Withdrawals += t.amount;
      else row.Transfers += t.amount;
    });
    return row;
  });

  const stats = [
    { label: "Total Accounts", value: String(bank.accounts.length), icon: Users },
    { label: "Total Bank Balance", value: inr(totalBal), icon: Wallet },
    { label: "Total Deposits", value: inr(deposits), icon: ArrowDownToLine },
    { label: "Total Withdrawals", value: inr(withdrawals), icon: ArrowUpFromLine },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-hero relative overflow-hidden rounded-2xl p-6 text-primary-foreground shadow-lg fade-up sm:p-8">
        <p className="text-sm opacity-80">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Bank overview</h1>
        <p className="mt-2 max-w-lg text-sm opacity-80">
          {bank.accounts.length} active accounts · {bank.transactions.length} transactions · {inr(transfers)} transferred
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/create" className="rounded-lg bg-card px-4 py-2 text-sm font-semibold text-primary transition hover:opacity-90">New account</Link>
          <Link to="/transfer" className="rounded-lg border border-primary-foreground/40 px-4 py-2 text-sm font-semibold transition hover:bg-primary-foreground/10">Transfer money</Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }, i) => (
          <div key={label} className="card-surface card-hover p-5 fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary"><Icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-3 truncate font-display text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="card-surface p-5">
        <h2 className="mb-4 font-semibold">Last 7 days</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={60} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => inr(v)} cursor={{ fill: "var(--muted)" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Deposits" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Withdrawals" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Transfers" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-semibold">Recent transactions</h2>
          <Link to="/transactions" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <TxTable txs={bank.transactions.slice(0, 6)} />
      </div>
    </div>
  );
}
