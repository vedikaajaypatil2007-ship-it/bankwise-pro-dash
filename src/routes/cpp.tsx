import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import source from "../../cpp/BankManagementSystem.cpp?raw";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/cpp")({
  head: () => ({
    meta: [
      { title: "C++ OOP Implementation — NovaBank" },
      { name: "description", content: "Console C++ program demonstrating OOP concepts for the bank system." },
      { property: "og:title", content: "C++ OOP Implementation — NovaBank" },
      { property: "og:description", content: "Console C++ program demonstrating OOP concepts." },
    ],
  }),
  component: CppPage,
});

const concepts = [
  ["Classes & Objects", "Account, SavingsAccount, CurrentAccount, Bank"],
  ["Encapsulation", "Private accountNumber, holderName; public getters"],
  ["Inheritance", "Savings & Current derive from Account"],
  ["Polymorphism", "virtual withdraw(), getType(), display()"],
  ["Constructors", "Parameterised constructors + virtual destructor"],
  ["Function Overloading", "deposit(amount) / deposit(amount, remark)"],
  ["Static Members", "Account::totalAccounts counter"],
  ["Collections", "vector<Account*> inside Bank"],
  ["File Handling", "saveToFile() / loadFromFile() with fstream"],
  ["Exception Handling", "BankException, InsufficientBalanceException"],
];

function CppPage() {
  const download = () => {
    const url = URL.createObjectURL(new Blob([source], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url; a.download = "BankManagementSystem.cpp"; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageHeader title="C++ OOP Implementation" subtitle="A separate console program holding the project's C++ logic. This web app is written in TypeScript." />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {concepts.map(([t, d]) => (
          <div key={t} className="card-surface card-hover p-4">
            <div className="text-sm font-semibold text-primary">{t}</div>
            <div className="mt-1 text-xs text-muted-foreground">{d}</div>
          </div>
        ))}
      </div>
      <div className="card-surface overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
          <div className="font-mono text-sm font-semibold">BankManagementSystem.cpp</div>
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(source).then(() => toast.success("Code copied"), () => toast.error("Copy failed"))}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-accent"><Copy className="h-4 w-4" /> Copy</button>
            <button onClick={download} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90"><Download className="h-4 w-4" /> Download</button>
          </div>
        </div>
        <p className="border-b bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">g++ -std=c++17 BankManagementSystem.cpp -o bank && ./bank</p>
        <pre className="max-h-[70vh] overflow-auto bg-navy p-4 text-xs leading-relaxed text-navy-foreground"><code>{source}</code></pre>
      </div>
    </>
  );
}
