import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";
import { inr, withdraw } from "@/lib/bank";
import { PageHeader } from "@/components/AppShell";
import { AccountSelect, AmountInput, FormCard, useSubmit } from "@/components/MoneyForm";

export const Route = createFileRoute("/withdraw")({
  validateSearch: (s: Record<string, unknown>) => ({ acc: s["acc"] != null ? String(s["acc"]) : undefined }) as { acc?: string },
  head: () => ({
    meta: [
      { title: "Withdraw Money — NovaBank" },
      { name: "description", content: "Withdraw money from an account." },
      { property: "og:title", content: "Withdraw Money — NovaBank" },
      { property: "og:description", content: "Withdraw money from an account." },
    ],
  }),
  component: WithdrawPage,
});

function WithdrawPage() {
  const { acc: initial } = Route.useSearch();
  const [acc, setAcc] = useState(initial ?? "");
  const [amount, setAmount] = useState("");
  const submit = useSubmit(() => {
    if (!acc) throw new Error("Please select an account");
    const bal = withdraw(acc, Number(amount || "0"));
    setAmount("");
    return `Withdrew ${inr(Number(amount))}. New balance ${inr(bal)}`;
  });
  return (
    <>
      <PageHeader title="Withdraw Money" subtitle="Savings accounts must keep a ₹1,000 minimum balance." />
      <FormCard icon={<ArrowUpFromLine className="h-5 w-5" />} title="Withdraw" onSubmit={submit} cta="Withdraw">
        <AccountSelect label="Account" value={acc} onChange={setAcc} />
        <AmountInput value={amount} onChange={setAmount} />
      </FormCard>
    </>
  );
}
