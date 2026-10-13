import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { canDelete, deleteAccount, errMsg, fmtDate, inr, MIN_BALANCE, useBank } from "@/lib/bank";
import { TypeBadge } from "@/components/AppShell";
import { TxTable } from "@/components/TxTable";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/accounts/$number")({
  head: ({ params }) => ({
    meta: [
      { title: `Account #${params.number} — NovaBank` },
      { name: "description", content: "Account details and transaction history." },
      { property: "og:title", content: `Account #${params.number} — NovaBank` },
      { property: "og:description", content: "Account details and transaction history." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { number } = Route.useParams();
  const bank = useBank();
  const navigate = useNavigate();
  const acc = bank.accounts.find((a) => a.number === number);

  if (!acc)
    return (
      <div className="card-surface p-10 text-center">
        <h1 className="text-xl font-bold">Account not found</h1>
        <Link to="/accounts" search={{ q: "" }} className="mt-4 inline-block text-primary hover:underline">Back to accounts</Link>
      </div>
    );

  const txs = bank.transactions.filter((t) => t.account === number || t.toAccount === number);
  const deletable = canDelete(acc);

  return (
    <div className="space-y-6">
      <Link to="/accounts" search={{ q: "" }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All accounts
      </Link>
      <section className="bg-hero rounded-2xl p-6 text-primary-foreground shadow-lg fade-up sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm opacity-80">Account #{acc.number} · {acc.type}</p>
            <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{acc.holder}</h1>
            <p className="mt-1 text-xs opacity-70">Opened {fmtDate(acc.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Available balance</p>
            <p className="font-display text-3xl font-bold">{inr(acc.balance)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-surface p-5"><p className="text-sm text-muted-foreground">Type</p><div className="mt-2"><TypeBadge type={acc.type} /></div></div>
        <div className="card-surface p-5"><p className="text-sm text-muted-foreground">Minimum balance</p><p className="mt-1 font-semibold">{inr(MIN_BALANCE[acc.type])}</p></div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted-foreground">Quick actions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to="/deposit" search={{ acc: number }} className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-accent">Deposit</Link>
            <Link to="/withdraw" search={{ acc: number }} className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-accent">Withdraw</Link>
            <Link to="/transfer" search={{ acc: number }} className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground hover:bg-accent">Transfer</Link>
            <AlertDialog>
              <AlertDialogTrigger className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{deletable ? `Delete account #${acc.number}?` : "Account can't be deleted yet"}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {deletable
                      ? "This permanently closes the account. Past transactions stay in history."
                      : `This account still holds ${inr(acc.balance)}. Withdraw or transfer the full balance first, then delete.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{deletable ? "Cancel" : "OK"}</AlertDialogCancel>
                  {deletable && (
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        try { deleteAccount(acc.number); toast.success(`Account #${acc.number} deleted`); navigate({ to: "/accounts", search: { q: "" } }); }
                        catch (e) { toast.error(errMsg(e)); }
                      }}>Delete</AlertDialogAction>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="card-surface">
        <h2 className="border-b p-5 font-semibold">Transaction history</h2>
        <TxTable txs={txs} empty="No transactions for this account yet." />
      </div>
    </div>
  );
}
