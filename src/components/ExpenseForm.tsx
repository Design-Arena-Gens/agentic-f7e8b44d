'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { addMonths, formatISO } from 'date-fns';
import { categories, paymentChannels, useExpenseStore } from '@/lib/store';
import type { ExpenseCategory, PaymentChannel } from '@/lib/types';

const defaultTagsByCategory: Record<ExpenseCategory, string[]> = {
  Housing: ['Fixed', 'Rent'],
  Transportation: ['Commute', 'Fuel'],
  Food: ['Groceries'],
  Utilities: ['Fixed'],
  Insurance: ['Fixed'],
  Healthcare: ['Medical'],
  Entertainment: ['Subscription'],
  Personal: ['Lifestyle'],
  Education: ['Learning'],
  Savings: ['Transfer'],
  Other: ['General']
};

const emptyForm = {
  title: '',
  amount: '',
  category: categories[0] as ExpenseCategory,
  paymentChannel: paymentChannels[0] as PaymentChannel,
  date: formatISO(new Date()).slice(0, 10),
  tags: ''
};

export function ExpenseForm() {
  const addExpense = useExpenseStore((state) => state.addExpense);
  const [formState, setFormState] = useState(emptyForm);
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = parseFloat(formState.amount);
    if (!formState.title.trim() || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    addExpense({
      title: formState.title.trim(),
      amount,
      category: formState.category,
      paymentChannel: formState.paymentChannel,
      date: formatISO(new Date(formState.date)),
      notes: recurring ? 'Auto-scheduled by recurring agent' : undefined,
      recurring,
      tags:
        formState.tags.trim().length > 0
          ? formState.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : defaultTagsByCategory[formState.category]
    });

    setFormState({
      ...emptyForm,
      category: formState.category,
      paymentChannel: formState.paymentChannel
    });
    setRecurring(false);
  };

  const handleCategoryChange = (category: ExpenseCategory) => {
    setFormState((prev) => ({
      ...prev,
      category,
      tags: defaultTagsByCategory[category].join(', ')
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-5"
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-600">Expense Title</label>
        <input
          type="text"
          value={formState.title}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, title: event.target.value }))
          }
          placeholder="e.g. Grocery run"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Amount</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formState.amount}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, amount: event.target.value }))
          }
          placeholder="0.00"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Category</label>
        <select
          value={formState.category}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            handleCategoryChange(event.target.value as ExpenseCategory)
          }
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Payment Channel</label>
        <select
          value={formState.paymentChannel}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setFormState((prev) => ({ ...prev, paymentChannel: event.target.value as PaymentChannel }))
          }
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        >
          {paymentChannels.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600">Date</label>
        <input
          type="date"
          value={formState.date}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, date: event.target.value }))
          }
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-600">Tags</label>
        <input
          type="text"
          value={formState.tags}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, tags: event.target.value }))
          }
          placeholder="comma separated, e.g. family, weekend"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="recurring"
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          checked={recurring}
          onChange={(event) => setRecurring(event.target.checked)}
        />
        <label htmlFor="recurring" className="text-sm text-slate-600">
          Mark as recurring
        </label>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-600">Smart Suggestions</label>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-primary-50 px-3 py-1">
            Next sweep: {formatISO(addMonths(new Date(formState.date), 1)).slice(0, 10)}
          </span>
          <span className="rounded-full bg-primary-50 px-3 py-1">
            Tags: {defaultTagsByCategory[formState.category].join(', ')}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-end md:col-span-1">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-500"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
