import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { inr, transfer } from "@/lib/bank";
import { PageHeader } from "@/components/AppShell";
import { AccountSelect, AmountInput, FormCard, useSubmit } from "@/components/MoneyForm";

export const Route = createFileRoute("/transfer")({
  validateSearch: (s: Record<string, unknown>) => ({ acc: s["acc"] != null ? String(s["acc"]) : undefined }) as { acc?: string },
  head: () => ({
    meta: [
      { title: "Transfer Money — NovaBank" },
      { name: "description", content: "Transfer funds between two accounts." },
      { property: "og:title", content: "Transfer Money — NovaBank" },
      { property: "og:description", content: "Transfer funds between two accounts." },
    ],
  }),
  component: TransferPage,
});

function TransferPage() {
  const { acc } = Route.useSearch();
  const [from, setFrom] = useState(acc ?? "");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const submit = useSubmit(() => {
    if (!from || !to) throw new Error("Select both source and destination accounts");
    transfer(from, to, Number(amount || "0"));
    setAmount("");
    return `Transferred ${inr(Number(amount))} from #${from} to #${to}`;
  });
  return (
    <>
      <PageHeader title="Transfer Money" subtitle="Move funds between two existing accounts." />
      <FormCard icon={<ArrowLeftRight className="h-5 w-5" />} title="Transfer" onSubmit={submit} cta="Transfer">
        <AccountSelect label="From account" value={from} onChange={(v) => { setFrom(v); if (v === to) setTo(""); }} />
        <AccountSelect label="To account" value={to} onChange={setTo} exclude={from} />
        <AmountInput value={amount} onChange={setAmount} />
      </FormCard>
    </>
  );
}
