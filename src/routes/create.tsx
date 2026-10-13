import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { createAccount, inr, MIN_BALANCE, type AccountType } from "@/lib/bank";
import { PageHeader } from "@/components/AppShell";
import { AmountInput, FormCard, useSubmit } from "@/components/MoneyForm";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Account — NovaBank" },
      { name: "description", content: "Open a new Savings or Current bank account." },
      { property: "og:title", content: "Create Account — NovaBank" },
      { property: "og:description", content: "Open a new Savings or Current bank account." },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const navigate = useNavigate();
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [type, setType] = useState<AccountType>("Savings");
  const [initial, setInitial] = useState("");

  const submit = useSubmit(() => {
    if (initial === "") throw new Error("Enter an initial deposit");
    createAccount(holder, number, type, Number(initial));
    const n = number.trim();
    navigate({ to: "/accounts/$number", params: { number: n } });
    return `Account #${n} created for ${holder.trim()}`;
  });

  return (
    <>
      <PageHeader title="Create Account" subtitle="Open a new Savings or Current account." />
      <FormCard icon={<UserPlus className="h-5 w-5" />} title="Account details" onSubmit={submit} cta="Create account">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Account holder name</span>
          <input className="field" value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="e.g. Neha Gupta" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Account number</span>
          <input className="field" value={number} inputMode="numeric" onChange={(e) => setNumber(e.target.value)} placeholder="4–12 digits, e.g. 1006" />
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-medium">Account type</span>
          <div className="grid grid-cols-2 gap-3">
            {(["Savings", "Current"] as const).map((t) => (
              <button type="button" key={t} onClick={() => setType(t)}
                className={`rounded-lg border p-3 text-left transition ${type === t ? "border-primary bg-secondary ring-2 ring-ring/30" : "hover:bg-muted"}`}>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-muted-foreground">Min. balance {inr(MIN_BALANCE[t])}</div>
              </button>
            ))}
          </div>
        </div>
        <AmountInput value={initial} onChange={setInitial} />
      </FormCard>
    </>
  );
}
