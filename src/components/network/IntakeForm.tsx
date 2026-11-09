'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDirection } from '@/context/DirectionContext';
import { TurnstileWidget } from './TurnstileWidget';
import type { CORRIDORS, DISCIPLINES, IntakeResponse } from '@/lib/contracts';

type Discipline = (typeof DISCIPLINES)[number];
type Corridor = (typeof CORRIDORS)[number];
type Phase = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; duplicate: boolean } | { kind: 'error'; message: string };

const DISCIPLINE_OPTIONS: Array<[Discipline, string]> = [
  ['distributed_systems', '01 // Distributed Systems & Consensus'],
  ['kernel_baremetal', '02 // Bare-Metal Kernel & io_uring'],
  ['agentic_workflows', '03 // Agentic Tool Synthesis & Compilers'],
  ['silicon_accelerators', '04 // Hardware SIMD / GPU Acceleration'],
  ['wireless_5g', '05 // 5G, SDR & Network Slicing'],
];

const inputCls =
  'w-full bg-graphite border border-slate-border px-3 py-2 text-signal-pure placeholder:text-ash-muted/50 focus:outline-none focus:border-cyan-hyper text-xs';

export function IntakeForm() {
  const { t, language } = useDirection();
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [discipline, setDiscipline] = useState<Discipline>('distributed_systems');
  const [corridor, setCorridor] = useState<Corridor>('MENA_TO_NA');
  const [token, setToken] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setPhase({ kind: 'error', message: 'Complete the verification challenge first.' });
      return;
    }
    setPhase({ kind: 'sending' });
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, email, discipline, corridor, turnstileToken: token, website }),
      });
      const data = (await res.json()) as IntakeResponse;
      if (data.ok) setPhase({ kind: 'done', duplicate: data.duplicate });
      else setPhase({ kind: 'error', message: data.message });
    } catch {
      setPhase({ kind: 'error', message: 'Network error. Retry shortly.' });
    } finally {
      // Turnstile tokens are single-use.
      setToken(null);
      setResetSignal((n) => n + 1);
    }
  };

  if (phase.kind === 'done') {
    return (
      <div className="p-4 bg-graphite border border-cyan-hyper text-signal-pure font-mono text-xs space-y-3" role="status" data-testid="intake-success">
        <div className="flex items-center gap-2 text-cyan-hyper">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-bold">{phase.duplicate ? 'ALREADY IN QUEUE' : 'DISPATCH QUEUED'}</span>
        </div>
        <p className="text-ash-muted text-[11px] leading-relaxed">
          {phase.duplicate ? (
            <>
              <span className="text-cyan-hyper font-semibold">@{handle.replace(/^@/, '')}</span> is already pending review.
            </>
          ) : (
            <>
              Request for <span className="text-cyan-hyper font-semibold">@{handle.replace(/^@/, '')}</span> is stored and the maintainers
              were notified. Approved members receive a Slack invite at the email provided.
            </>
          )}
        </p>
        <div className="text-[10px] text-ash-muted border-t border-slate-border pt-2">CORRIDOR: {corridor}</div>
        <button
          onClick={() => {
            setPhase({ kind: 'idle' });
            setHandle('');
            setEmail('');
          }}
          className="mt-2 w-full py-1.5 bg-void border border-slate-border text-signal-pure text-[10px] uppercase font-mono hover:border-cyan-hyper"
        >
          DISPATCH ANOTHER HANDLE
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 font-mono text-xs" data-testid="intake-form" noValidate={false}>
      <div>
        <label htmlFor="intake-handle" className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">
          01 // GITHUB HANDLE
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-cyan-hyper font-semibold">@</span>
          <input
            id="intake-handle"
            type="text"
            required
            maxLength={40}
            pattern="@?[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}"
            autoComplete="username"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="engineer_handle"
            className={`${inputCls} ps-8`}
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label htmlFor="intake-email" className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">
          02 // INVITE EMAIL
        </label>
        <input
          id="intake-email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.dev"
          className={inputCls}
          dir="ltr"
        />
      </div>

      {/* Honeypot: invisible to humans, irresistible to form-filling bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="fixed top-0 start-0 h-px w-px opacity-0 pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="intake-discipline" className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">
          03 // PRIMARY DISCIPLINE CLUSTER
        </label>
        <select id="intake-discipline" value={discipline} onChange={(e) => setDiscipline(e.target.value as Discipline)} className={inputCls}>
          {DISCIPLINE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">04 // REGIONAL GATEWAY ROUTE</legend>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {(
            [
              ['MENA_TO_NA', 'MENA → NORTH AM', 'Baghdad / Cairo / Dubai'],
              ['NA_TO_GLOBAL', 'NORTH AM RESIDENT', 'Boston / Toronto / SF'],
            ] as const
          ).map(([value, title, sub]) => (
            <button
              key={value}
              type="button"
              aria-pressed={corridor === value}
              onClick={() => setCorridor(value)}
              className={`p-2 border text-start transition-all duration-150 ${
                corridor === value
                  ? 'border-cyan-hyper bg-graphite text-signal-pure shadow-cyan-subtle'
                  : 'border-slate-border bg-void text-ash-muted hover:border-cyan-hyper/80 hover:text-signal-pure hover:bg-graphite/40'
              }`}
            >
              <div className="font-semibold text-cyan-hyper">{title}</div>
              <div className="text-[9px] text-ash-muted">{sub}</div>
            </button>
          ))}
        </div>
      </fieldset>

      <TurnstileWidget onToken={setToken} language={language} resetSignal={resetSignal} />

      {phase.kind === 'error' && (
        <div className="flex items-start gap-2 p-2 border border-amber-400/60 text-amber-300 text-[11px]" role="alert">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{phase.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={phase.kind === 'sending'}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-graphite hover:bg-slate-border/50 border border-cyan-hyper text-signal-pure font-mono text-xs uppercase tracking-wider transition-colors shadow-cyan-subtle disabled:opacity-50"
      >
        {phase.kind === 'sending' ? (
          <span className="animate-pulse">VERIFYING & DISPATCHING...</span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5 text-cyan-hyper rtl:-scale-x-100" />
            <span>{t('network.verify_handle')}</span>
          </>
        )}
      </button>
    </form>
  );
}
