'use client';

import { useMemo } from 'react';
import { addDays, format } from 'date-fns';
import { useExpenseStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'Expense' | 'Income' | 'Workflow';
  label: string;
  amount?: number;
  meta?: string;
}

export function CashflowTimeline() {
  const { expenses, incomeStreams, workflows } = useExpenseStore();

  const events = useMemo<TimelineEvent[]>(() => {
    const upcomingExpenses = expenses
      .filter((expense) => expense.recurring)
      .map((expense) => ({
        id: `${expense.id}-recur`,
        date: addDays(new Date(expense.date), 30),
        type: 'Expense' as const,
        label: `${expense.title} renewal`,
        amount: expense.amount,
        meta: expense.category
      }));

    const incomeEvents = incomeStreams.map((income) => {
      const nextDate = addDays(new Date(), income.cadence === 'Weekly' ? 7 : income.cadence === 'Biweekly' ? 14 : income.cadence === 'Monthly' ? 30 : income.cadence === 'Quarterly' ? 90 : 365);
      return {
        id: `${income.id}-income`,
        date: nextDate,
        type: 'Income' as const,
        label: income.title,
        amount: income.amount,
        meta: income.cadence
      };
    });

    const workflowEvents = workflows.map((workflow) => ({
      id: `${workflow.id}-workflow`,
      date: new Date(workflow.nextRun),
      type: 'Workflow' as const,
      label: workflow.name,
      meta: workflow.trigger
    }));

    return [...upcomingExpenses, ...incomeEvents, ...workflowEvents]
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [expenses, incomeStreams, workflows]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">Next 30 Days Timeline</h2>
      <p className="mt-1 text-sm text-slate-500">Agents flag upcoming cash events so you can keep buffers ready.</p>
      <ol className="mt-5 space-y-4">
        {events.map((event) => (
          <li key={event.id} className="flex items-center gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                event.type === 'Income'
                  ? 'bg-emerald-100 text-emerald-700'
                  : event.type === 'Expense'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-primary-100 text-primary-700'
              }`}
            >
              {event.type[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">{event.label}</p>
              <p className="text-xs text-slate-500">{format(event.date, 'MMM d, yyyy')} · {event.meta}</p>
            </div>
            {typeof event.amount === 'number' && (
              <span className="text-sm font-semibold text-slate-700">{formatCurrency(event.amount)}</span>
            )}
          </li>
        ))}
        {events.length === 0 && (
          <li className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            Add recurring expenses or workflows to activate the cashflow timeline.
          </li>
        )}
      </ol>
    </section>
  );
}
