'use client';

import { useMemo } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useExpenseStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export function SnapshotCards() {
  const { expenses, incomeStreams } = useExpenseStore();

  const { totalSpend, avgExpense, monthlyIncome } = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avg = expenses.length > 0 ? total / expenses.length : 0;
    const income = incomeStreams.reduce((sum, income) => {
      switch (income.cadence) {
        case 'Weekly':
          return sum + income.amount * 4;
        case 'Biweekly':
          return sum + income.amount * 2;
        case 'Monthly':
          return sum + income.amount;
        case 'Quarterly':
          return sum + income.amount / 3;
        case 'Yearly':
          return sum + income.amount / 12;
        default:
          return sum;
      }
    }, 0);

    return {
      totalSpend: total,
      avgExpense: avg,
      monthlyIncome: income
    };
  }, [expenses, incomeStreams]);

  const burnRate = monthlyIncome > 0 ? (totalSpend / monthlyIncome) * 100 : 0;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Cash Out</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCurrency(totalSpend)}</p>
          </div>
          <Wallet className="text-primary-500" size={32} />
        </div>
        <p className="mt-3 text-sm text-slate-500">Total tracked spend across agents this month.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avg Ticket</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{formatCurrency(avgExpense)}</p>
          </div>
          <TrendingDown className="text-primary-500" size={32} />
        </div>
        <p className="mt-3 text-sm text-slate-500">Average transaction size flowing through the system.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Burn Rate</p>
            <p className="mt-1 text-2xl font-semibold text-slate-800">{burnRate.toFixed(0)}%</p>
          </div>
          <TrendingUp className="text-primary-500" size={32} />
        </div>
        <p className="mt-3 text-sm text-slate-500">Percentage of monthly income currently being deployed.</p>
      </div>
    </section>
  );
}
