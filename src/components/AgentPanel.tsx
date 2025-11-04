'use client';

import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { buildAgentInsights, useExpenseStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export function AgentPanel() {
  const state = useExpenseStore((store) => store);
  const insights = useMemo(() => buildAgentInsights(state), [state]);
  const completeWorkflow = useExpenseStore((store) => store.completeWorkflow);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Autonomous Agents</h2>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
          {insights.length} active
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <article key={insight.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  {insight.priority} Priority Agent
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-800">{insight.title}</h3>
              </div>
              <button className="text-primary-500 transition hover:text-primary-400" title="Open agent console">
                <ExternalLink size={18} />
              </button>
            </div>
            <p className="text-sm text-slate-600">{insight.description}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
              {insight.recommendedActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 text-xs">
              {insight.metrics.map((metric) => (
                <span key={metric.label} className="rounded-lg bg-slate-100 px-3 py-1 text-slate-600">
                  <span className="font-semibold text-slate-700">{metric.value}</span> {metric.label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <header className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-800">Agent Workflows</h3>
          <span className="text-xs uppercase tracking-wide text-slate-400">Automation queue</span>
        </header>
        <ul className="mt-4 space-y-4">
          {state.workflows.map((workflow) => (
            <li key={workflow.id} className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">{workflow.name}</p>
                <p className="text-xs text-slate-500">Next run: {formatDate(workflow.nextRun)}</p>
                <p className="mt-2 text-sm text-slate-600">{workflow.description}</p>
                <span className="mt-2 inline-flex rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold text-primary-700">
                  Trigger: {workflow.trigger}
                </span>
              </div>
              <div className="flex flex-col items-end gap-3 text-xs">
                <span
                  className={`rounded-full px-3 py-1 font-semibold ${
                    workflow.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : workflow.status === 'Scheduled'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {workflow.status}
                </span>
                {workflow.status !== 'Completed' && (
                  <button
                    onClick={() => completeWorkflow(workflow.id)}
                    className="rounded-lg border border-primary-200 px-3 py-1 font-semibold text-primary-600 hover:bg-primary-50"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
