import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { errMsg, inr, useBank } from "@/lib/bank";

export function AccountSelect({ value, onChange, label, exclude }: { value: string; onChange: (v: string) => void; label: string; exclude?: string }) {
  const { accounts } = useBank();
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an account</option>
        {accounts.filter((a) => a.number !== exclude).map((a) => (
          <option key={a.number} value={a.number}>#{a.number} — {a.holder} ({inr(a.balance)})</option>
        ))}
      </select>
    </label>
  );
}

export function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">Amount (₹)</span>
      <input className="field" type="number" step="0.01" min="0" inputMode="decimal" placeholder="0.00" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function useSubmit(action: () => string | void) {
  return (e: FormEvent) => {
    e.preventDefault();
    try {
      const msg = action();
      if (msg) toast.success(msg);
    } catch (err) {
      toast.error(errMsg(err));
    }
  };
}

export function FormCard({ icon, title, children, onSubmit, cta }: { icon: ReactNode; title: string; children: ReactNode; onSubmit: (e: FormEvent) => void; cta: string }) {
  return (
    <form onSubmit={onSubmit} noValidate className="card-surface mx-auto max-w-xl space-y-5 p-6 fade-up sm:p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
      <button type="submit" className="h-11 w-full rounded-lg bg-primary font-semibold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-[.99]">
        {cta}
      </button>
    </form>
  );
}

export const useField = () => useState("");
