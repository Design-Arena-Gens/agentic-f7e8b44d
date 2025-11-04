'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useExpenseStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import type { ExpenseCategory } from '@/lib/types';

interface BudgetFormState {
  category: ExpenseCategory | 'Total';
  limit: string;
}

const categories: (ExpenseCategory | 'Total')[] = [
  'Total',
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Personal',
  'Education',
  'Savings',
  'Other'
];

const initialForm: BudgetFormState = {
  category: 'Total',
  limit: ''
};

export function BudgetPanel() {
  const { expenses, budgetTargets, upsertBudget, removeBudget } = useExpenseStore();
  const [formState, setFormState] = useState(initialForm);

  const totals = useMemo(() => {
    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});

    return { totalSpend, byCategory };
  }, [expenses]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const limit = parseFloat(formState.limit);
    if (Number.isNaN(limit) || limit <= 0) {
      return;
    }

    upsertBudget({
      category: formState.category,
      limit
    });
    setFormState(initialForm);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Agent Budget Guardrails</h2>
          <p className="text-sm text-slate-500">Budgets feed the optimizer agents to keep spending aligned.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {budgetTargets.length} targets
        </span>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 md:flex-row">
        <select
          value={formState.category}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setFormState((prev) => ({
              ...prev,
              category: event.target.value as BudgetFormState['category']
            }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Limit"
          value={formState.limit}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, limit: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          Save Budget
        </button>
      </form>
      <div className="mt-6 space-y-4">
        {budgetTargets.map((budget) => {
          const spend = budget.category === 'Total' ? totals.totalSpend : totals.byCategory[budget.category] ?? 0;
          const utilization = budget.limit > 0 ? Math.min(100, (spend / budget.limit) * 100) : 0;
          const statusColor =
            utilization >= 95 ? 'bg-rose-100 text-rose-700' : utilization >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700';

          return (
            <div key={budget.id} className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{budget.category} Budget</p>
                  <p className="text-xs text-slate-500">
                    {formatCurrency(spend)} of {formatCurrency(budget.limit)} used
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
                    {utilization.toFixed(0)}% utilized
                  </span>
                  <button
                    onClick={() => removeBudget(budget.id)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-primary-500 transition-all duration-300`}
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>
          );
        })}
        {budgetTargets.length === 0 && (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            No guardrails set. Agents will create provisional budgets after the next insights run.
          </p>
        )}
      </div>
    </section>
  );
}
