import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { deposit, inr } from "@/lib/bank";
import { PageHeader } from "@/components/AppShell";
import { AccountSelect, AmountInput, FormCard, useSubmit } from "@/components/MoneyForm";

export const Route = createFileRoute("/deposit")({
  validateSearch: (s: Record<string, unknown>) => ({ acc: s["acc"] != null ? String(s["acc"]) : undefined }) as { acc?: string },
  head: () => ({
    meta: [
      { title: "Deposit Money — NovaBank" },
      { name: "description", content: "Deposit money into an account." },
      { property: "og:title", content: "Deposit Money — NovaBank" },
      { property: "og:description", content: "Deposit money into an account." },
    ],
  }),
  component: DepositPage,
});

function DepositPage() {
  const { acc: initial } = Route.useSearch();
  const [acc, setAcc] = useState(initial ?? "");
  const [amount, setAmount] = useState("");
  const submit = useSubmit(() => {
    if (!acc) throw new Error("Please select an account");
    const bal = deposit(acc, Number(amount || "0"));
    setAmount("");
    return `Deposited ${inr(Number(amount))}. New balance ${inr(bal)}`;
  });
  return (
    <>
      <PageHeader title="Deposit Money" subtitle="Add funds to an existing account." />
      <FormCard icon={<ArrowDownToLine className="h-5 w-5" />} title="Deposit" onSubmit={submit} cta="Deposit">
        <AccountSelect label="Account" value={acc} onChange={setAcc} />
        <AmountInput value={amount} onChange={setAmount} />
      </FormCard>
    </>
  );
}
