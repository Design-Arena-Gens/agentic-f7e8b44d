'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useExpenseStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

const cadences = ['Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'Yearly'] as const;

type Cadence = (typeof cadences)[number];

interface FormState {
  title: string;
  amount: string;
  cadence: Cadence;
}

const initialForm: FormState = {
  title: '',
  amount: '',
  cadence: 'Monthly'
};

export function IncomePanel() {
  const { incomeStreams, addIncomeStream, removeIncomeStream } = useExpenseStore();
  const [formState, setFormState] = useState<FormState>(initialForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = parseFloat(formState.amount);
    if (!formState.title.trim() || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    addIncomeStream({
      title: formState.title.trim(),
      amount,
      cadence: formState.cadence
    });

    setFormState(initialForm);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Income Streams</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {incomeStreams.length} streams
        </span>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="Income source"
          value={formState.title}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, title: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={formState.amount}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFormState((prev) => ({ ...prev, amount: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={formState.cadence}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setFormState((prev) => ({
              ...prev,
              cadence: event.target.value as Cadence
            }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {cadences.map((cadence) => (
            <option key={cadence} value={cadence}>
              {cadence}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500"
        >
          Add Income
        </button>
      </form>
      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        {incomeStreams.map((income) => (
          <li
            key={income.id}
            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-slate-700">{income.title}</p>
              <p className="text-xs text-slate-500">{income.cadence}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">{formatCurrency(income.amount)}</span>
              <button
                onClick={() => removeIncomeStream(income.id)}
                className="text-xs font-semibold text-primary-600 hover:text-primary-500"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {incomeStreams.length === 0 && (
          <li className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
            Add a recurring income so agents can calibrate savings goals.
          </li>
        )}
      </ul>
    </section>
  );
}
