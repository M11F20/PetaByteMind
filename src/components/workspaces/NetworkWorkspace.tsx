'use client';

import React, { useState } from 'react';
import { useDirection } from '@/context/DirectionContext';
import { NETWORK_MEMBERS } from '@/data/mockData';
import { ReticleCorner } from '@/components/hud/ReticleCorner';
import {
  Globe,
  Radio,
  Send,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Server,
  UserCheck,
  Zap,
} from 'lucide-react';

export function NetworkWorkspace() {
  const { t, language } = useDirection();
  const [handle, setHandle] = useState('');
  const [specialty, setSpecialty] = useState('distributed_systems');
  const [corridor, setCorridor] = useState('MENA_TO_NA');
  const [submitted, setSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 p-3 md:p-4 overflow-y-auto">
      {/* Network Header */}
      <section className="relative w-full bg-void border border-slate-border p-4 select-none">
        <ReticleCorner position="top-left" label="NET.01 // CORRIDOR" />
        <ReticleCorner position="top-right" label="STATUS: 1420 ONLINE" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-graphite border border-cyan-hyper text-cyan-hyper text-[10px] font-mono tracking-widest uppercase mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>TRANS-REGIONAL ENGINEERING BACKPLANE</span>
            </div>

            <h2 className="text-base sm:text-xl font-mono font-bold text-signal-pure uppercase tracking-wide">
              {t('network.title')}
            </h2>

            <p className="mt-1 text-xs font-sans text-ash-muted max-w-2xl leading-relaxed">
              {t('network.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-ash-muted">
            <div className="px-3 py-1.5 bg-graphite border border-slate-border flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-hyper rounded-full animate-ping" />
              <span>NODES: <span className="text-signal-pure font-bold">1,420 ACTIVE</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Slack Intake Pipeline vs Community Build Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Slack Intake Terminal Pipeline (5 cols) */}
        <section className="lg:col-span-5 bg-void border border-slate-border p-4 flex flex-col justify-between">
          <ReticleCorner position="top-left" label="INTAKE // PROTOCOL" />

          <div>
            <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-hyper" />
                <span className="font-mono text-xs font-bold text-signal-pure uppercase tracking-wider">
                  {t('network.intake_title')}
                </span>
              </div>
              <span className="font-mono text-[9px] text-ash-muted">SLACK v4.38 API</span>
            </div>

            {submitted ? (
              <div className="p-4 bg-graphite border border-cyan-hyper text-signal-pure font-mono text-xs space-y-3">
                <div className="flex items-center gap-2 text-cyan-hyper">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-bold">DISPATCH SUCCESSFUL</span>
                </div>
                <p className="text-ash-muted text-[11px] leading-relaxed">
                  Verification packet routed for <span className="text-cyan-hyper font-semibold">@{handle}</span>. Your intake token has been queued on the Slack dispatch bus. Check your email or Slack workspace invitation for immediate corridor clearance.
                </p>
                <div className="text-[10px] text-ash-muted border-t border-slate-border pt-2">
                  CORRIDOR: {corridor} // CHANNEL: #systems-research
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setHandle('');
                  }}
                  className="mt-2 w-full py-1.5 bg-void border border-slate-border text-signal-pure text-[10px] uppercase font-mono hover:border-cyan-hyper"
                >
                  DISPATCH ANOTHER HANDLE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                {/* Step 1: GitHub / Slack Handle */}
                <div>
                  <label className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">
                    01 // GITHUB OR SLACK HANDLE
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-cyan-hyper font-semibold">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="engineer_handle"
                      className="w-full bg-graphite border border-slate-border ps-8 pe-3 py-2 text-signal-pure placeholder:text-ash-muted/50 focus:outline-none focus:border-cyan-hyper text-xs"
                    />
                  </div>
                </div>

                {/* Step 2: Engineering Discipline */}
                <div>
                  <label className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">
                    02 // PRIMARY DISCIPLINE CLUSTER
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-graphite border border-slate-border px-3 py-2 text-signal-pure focus:outline-none focus:border-cyan-hyper text-xs"
                  >
                    <option value="distributed_systems">01 // Distributed Systems & Consensus</option>
                    <option value="kernel_baremetal">02 // Bare-Metal Kernel & io_uring</option>
                    <option value="agentic_workflows">03 // Agentic Tool Synthesis & Compilers</option>
                    <option value="silicon_accelerators">04 // Hardware SIMD / GPU Acceleration</option>
                  </select>
                </div>

                {/* Step 3: Regional Gateway Corridor */}
                <div>
                  <label className="block text-[10px] text-ash-muted uppercase tracking-wider mb-1.5">
                    03 // REGIONAL GATEWAY ROUTE
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCorridor('MENA_TO_NA')}
                      className={`p-2 border text-start transition-all duration-150 ${
                        corridor === 'MENA_TO_NA'
                          ? 'border-cyan-hyper bg-graphite text-signal-pure shadow-cyan-subtle'
                          : 'border-slate-border bg-void text-ash-muted hover:border-cyan-hyper/80 hover:text-signal-pure hover:bg-graphite/40'
                      }`}
                    >
                      <div className="font-semibold text-cyan-hyper">MENA → NORTH AM</div>
                      <div className="text-[9px] text-ash-muted">Baghdad / Cairo / Dubai</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCorridor('NA_TO_GLOBAL')}
                      className={`p-2 border text-start transition-all duration-150 ${
                        corridor === 'NA_TO_GLOBAL'
                          ? 'border-cyan-hyper bg-graphite text-signal-pure shadow-cyan-subtle'
                          : 'border-slate-border bg-void text-ash-muted hover:border-cyan-hyper/80 hover:text-signal-pure hover:bg-graphite/40'
                      }`}
                    >
                      <div className="font-semibold text-signal-pure">NORTH AM RESIDENT</div>
                      <div className="text-[9px] text-ash-muted">Boston / Toronto / SF</div>
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-graphite hover:bg-slate-border/50 border border-cyan-hyper text-signal-pure font-mono text-xs uppercase tracking-wider transition-colors shadow-cyan-subtle disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span className="animate-pulse">VERIFYING PTP BUS...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-cyan-hyper" />
                      <span>{t('network.verify_handle')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between text-[10px] font-mono text-ash-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-hyper" />
              <span>INVITE INTAKE: GATED & RATE-LIMITED</span>
            </span>
          </div>
        </section>

        {/* Right: Active Corridor Build Spotlights (7 cols) */}
        <section className="lg:col-span-7 bg-void border border-slate-border p-4 flex flex-col justify-between">
          <ReticleCorner position="top-left" label="SPOTLIGHTS // ACTIVE" />

          <div>
            <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-cyan-hyper animate-pulse" />
                <span className="font-mono text-xs font-bold text-signal-pure uppercase tracking-wider">
                  {t('network.spotlights')}
                </span>
              </div>
              <span className="font-mono text-[10px] text-ash-muted">
                LIVE CORRIDOR TELEMETRY
              </span>
            </div>

            <div className="space-y-3">
              {NETWORK_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-graphite/60 border border-slate-border hover:border-cyan-hyper transition-all duration-150 select-none font-mono shadow-none hover:shadow-cyan-subtle cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-hyper font-bold">
                        {member.callsign}
                      </span>
                      <span className="text-slate-border">|</span>
                      <span className="text-signal-pure font-semibold">
                        {member.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-void border border-slate-border text-[9px] text-ash-muted">
                        {member.location}
                      </span>
                      <span className="text-cyan-hyper text-[9px] font-semibold">
                        [{member.status}]
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-signal-pure/90 font-sans mb-1 font-medium">
                    {member.specialty}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-ash-muted pt-2 border-t border-slate-border/50">
                    <span className="truncate">
                      ACTIVE REPO: <span className="text-signal-pure">{member.activeProject}</span>
                    </span>
                    <span className="text-cyan-hyper font-semibold tabular-nums shrink-0 ms-2">
                      RTT: {member.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between text-[10px] font-mono text-ash-muted">
            <span className="flex items-center gap-1.5">
              <Server className="w-3 h-3 text-cyan-hyper" />
              <span>REGIONAL BRIDGE: TORONTO ↔ BAGHDAD ↔ BOSTON</span>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
