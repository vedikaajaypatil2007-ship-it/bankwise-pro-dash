// Banking logic for the web frontend (TypeScript).
// The C++ OOP version of this logic lives separately in /cpp/BankManagementSystem.cpp.
import { useSyncExternalStore } from "react";

export type AccountType = "Savings" | "Current";
export type TxType = "Deposit" | "Withdrawal" | "Transfer";

export interface Account {
  number: string;
  holder: string;
  type: AccountType;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  date: string;
  account: string; // source / main account
  toAccount?: string; // for transfers
  balanceAfter: number;
}

export interface BankState {
  accounts: Account[];
  transactions: Transaction[];
}

export const MIN_BALANCE: Record<AccountType, number> = { Savings: 1000, Current: 0 };
const KEY = "nb-bank-state-v1";

const day = (d: number, h = 10) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, 15, 0, 0);
  return t.toISOString();
};

export function demoData(): BankState {
  const accounts: Account[] = [
    { number: "1001", holder: "Aarav Sharma", type: "Savings", balance: 52000, createdAt: day(30) },
    { number: "1002", holder: "Priya Patel", type: "Current", balance: 128500, createdAt: day(28) },
    { number: "1003", holder: "Rohan Mehta", type: "Savings", balance: 18750, createdAt: day(20) },
    { number: "1004", holder: "Ananya Iyer", type: "Current", balance: 76300, createdAt: day(15) },
    { number: "1005", holder: "Vikram Singh", type: "Savings", balance: 34200, createdAt: day(9) },
  ];
  const transactions: Transaction[] = [
    { id: "t1", type: "Deposit", amount: 15000, date: day(6, 9), account: "1001", balanceAfter: 55000 },
    { id: "t2", type: "Withdrawal", amount: 5000, date: day(5, 14), account: "1001", balanceAfter: 50000 },
    { id: "t3", type: "Transfer", amount: 8500, date: day(4, 11), account: "1002", toAccount: "1003", balanceAfter: 128500 },
    { id: "t4", type: "Deposit", amount: 22000, date: day(3, 16), account: "1004", balanceAfter: 81300 },
    { id: "t5", type: "Withdrawal", amount: 5000, date: day(2, 12), account: "1004", balanceAfter: 76300 },
    { id: "t6", type: "Deposit", amount: 2000, date: day(1, 10), account: "1001", balanceAfter: 52000 },
    { id: "t7", type: "Deposit", amount: 4200, date: day(0, 9), account: "1005", balanceAfter: 34200 },
  ].reverse() as Transaction[];
  return { accounts, transactions };
}

// ---------- store ----------
let state: BankState = demoData();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch {
    state = demoData();
  }
}
function commit(next: BankState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full / disabled */
  }
  listeners.forEach((l) => l());
}
const serverSnap = demoData();

export function useBank(): BankState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return state;
    },
    () => serverSnap,
  );
}

// ---------- operations (throw Error on invalid input) ----------
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

function find(num: string) {
  const a = state.accounts.find((x) => x.number === num);
  if (!a) throw new Error(`Account ${num} not found`);
  return a;
}
function checkAmount(n: number) {
  if (!Number.isFinite(n) || n <= 0) throw new Error("Amount must be greater than zero");
  if (Math.round(n * 100) !== n * 100) throw new Error("Amount can have at most 2 decimals");
}

export function createAccount(holder: string, number: string, type: AccountType, initial: number) {
  holder = holder.trim();
  number = number.trim();
  if (holder.length < 3) throw new Error("Holder name must be at least 3 characters");
  if (!/^[A-Za-z .'-]+$/.test(holder)) throw new Error("Holder name can only contain letters");
  if (!/^\d{4,12}$/.test(number)) throw new Error("Account number must be 4–12 digits");
  if (state.accounts.some((a) => a.number === number)) throw new Error("Account number already exists");
  if (!Number.isFinite(initial) || initial < 0) throw new Error("Initial deposit cannot be negative");
  if (initial < MIN_BALANCE[type])
    throw new Error(`${type} account needs a minimum initial deposit of ${inr(MIN_BALANCE[type])}`);
  const acc: Account = { number, holder, type, balance: initial, createdAt: now() };
  const txs = initial > 0
    ? [{ id: uid(), type: "Deposit" as const, amount: initial, date: now(), account: number, balanceAfter: initial }]
    : [];
  commit({ accounts: [...state.accounts, acc], transactions: [...txs, ...state.transactions] });
}

function setBalance(accounts: Account[], num: string, bal: number) {
  return accounts.map((a) => (a.number === num ? { ...a, balance: bal } : a));
}

export function deposit(num: string, amount: number) {
  checkAmount(amount);
  const a = find(num);
  const bal = a.balance + amount;
  commit({
    accounts: setBalance(state.accounts, num, bal),
    transactions: [{ id: uid(), type: "Deposit", amount, date: now(), account: num, balanceAfter: bal }, ...state.transactions],
  });
  return bal;
}

export function withdraw(num: string, amount: number) {
  checkAmount(amount);
  const a = find(num);
  const bal = a.balance - amount;
  if (bal < MIN_BALANCE[a.type])
    throw new Error(
      a.type === "Savings"
        ? `Insufficient balance. Savings accounts must keep ${inr(MIN_BALANCE.Savings)} minimum`
        : "Insufficient balance",
    );
  commit({
    accounts: setBalance(state.accounts, num, bal),
    transactions: [{ id: uid(), type: "Withdrawal", amount, date: now(), account: num, balanceAfter: bal }, ...state.transactions],
  });
  return bal;
}

export function transfer(from: string, to: string, amount: number) {
  if (from === to) throw new Error("Choose two different accounts");
  checkAmount(amount);
  const a = find(from);
  const b = find(to);
  const bal = a.balance - amount;
  if (bal < MIN_BALANCE[a.type]) throw new Error("Insufficient balance in source account");
  let accounts = setBalance(state.accounts, from, bal);
  accounts = setBalance(accounts, to, b.balance + amount);
  commit({
    accounts,
    transactions: [{ id: uid(), type: "Transfer", amount, date: now(), account: from, toAccount: to, balanceAfter: bal }, ...state.transactions],
  });
}

export function canDelete(a: Account) {
  return a.balance === 0;
}
export function deleteAccount(num: string) {
  const a = find(num);
  if (!canDelete(a)) throw new Error("Withdraw or transfer the full balance before deleting this account");
  commit({ ...state, accounts: state.accounts.filter((x) => x.number !== num) });
}

export function resetDemo() {
  commit(demoData());
}

// ---------- helpers ----------
export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
export const fmtDate = (s: string) =>
  new Date(s).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const holderOf = (s: BankState, num?: string) =>
  s.accounts.find((a) => a.number === num)?.holder ?? "Closed account";
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");
