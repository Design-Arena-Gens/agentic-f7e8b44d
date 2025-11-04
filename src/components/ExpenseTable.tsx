'use client';

import { useMemo, useState } from 'react';
import { useExpenseStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { ExpenseCategory } from '@/lib/types';

interface FilterState {
  category: 'All' | ExpenseCategory;
  channel: 'All' | string;
  recurringOnly: boolean;
}

const initialFilter: FilterState = {
  category: 'All',
  channel: 'All',
  recurringOnly: false
};

export function ExpenseTable() {
  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const [filters, setFilters] = useState(initialFilter);

  const filtered = useMemo(() => {
    return expenses
      .filter((expense) => (filters.category === 'All' ? true : expense.category === filters.category))
      .filter((expense) => (filters.channel === 'All' ? true : expense.paymentChannel === filters.channel))
      .filter((expense) => (filters.recurringOnly ? Boolean(expense.recurring) : true))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filters]);

  const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={filters.category}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              category: event.target.value as FilterState['category']
            }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="All">All Categories</option>
          {[
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
          ].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={filters.channel}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              channel: event.target.value as FilterState['channel']
            }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="All">All Channels</option>
          {['Cash', 'Debit Card', 'Credit Card', 'Transfer', 'Digital Wallet'].map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filters.recurringOnly}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                recurringOnly: event.target.checked
              }))
            }
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Recurring Only
        </label>
        <div className="ml-auto text-sm font-semibold text-slate-600">
          {formatCurrency(total)} total
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Tags</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Channel</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((expense) => (
              <tr key={expense.id} className="hover:bg-primary-50/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{expense.title}</p>
                  {expense.notes && <p className="text-xs text-slate-400">{expense.notes}</p>}
                </td>
                <td className="px-4 py-3 text-slate-600">{expense.category}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {expense.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{expense.paymentChannel}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(expense.date)}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-700">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-500"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                  No expenses tracked yet for this view. Try adjusting filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
