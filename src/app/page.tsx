import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseTable } from '@/components/ExpenseTable';
import { AgentPanel } from '@/components/AgentPanel';
import { BudgetPanel } from '@/components/BudgetPanel';
import { IncomePanel } from '@/components/IncomePanel';
import { SnapshotCards } from '@/components/SnapshotCards';
import { CashflowTimeline } from '@/components/CashflowTimeline';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
          Expense Automation OS
        </p>
        <h1 className="text-4xl font-bold text-slate-900">Personal Expense Agents</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Deploy autonomous finance agents that capture transactions, enforce budgets, and surface proactive moves
          to keep you cash-positive. Add spending, calibrate guardrails, and let the workflows spin.
        </p>
      </header>
      <SnapshotCards />
      <ExpenseForm />
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <ExpenseTable />
        <div className="space-y-6">
          <AgentPanel />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetPanel />
        <IncomePanel />
      </div>
      <CashflowTimeline />
      <footer className="pb-10 pt-6 text-center text-xs text-slate-400">
        Powered by agentic finance playbooks · Designed for rapid deployment on Vercel
      </footer>
    </main>
  );
}
