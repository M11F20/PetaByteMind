'use client';

import React, { useState } from 'react';
import { useDirection } from '@/context/DirectionContext';
import { DOSSIER_CASE_STUDIES, RESEARCH_ROADMAP } from '@/data/content';
import { ReticleCorner } from '@/components/hud/ReticleCorner';
import {
  GraduationCap,
  FileCheck2,
  ChevronRight,
  BookOpen,
  Microscope,
} from 'lucide-react';

export function DossierWorkspace() {
  const { t, language } = useDirection();
  const [activeTab, setActiveTab] = useState<'case_studies' | 'roadmap'>('case_studies');

  return (
    <div className="w-full h-full flex flex-col space-y-4 p-3 md:p-4 overflow-y-auto">
      {/* Dossier Header & Admissions Target Notice */}
      <section className="relative w-full bg-void border border-slate-border p-4 select-none">
        <ReticleCorner position="top-left" label="BLUEPRINTS.01 // DESIGN" />
        <ReticleCorner position="top-right" label="STATUS: DESIGN PHASE" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-graphite border border-cyan-hyper/80 text-cyan-hyper text-[10px] font-mono tracking-widest uppercase mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t('dossier.target')}</span>
            </div>

            <h2 className="text-base sm:text-xl font-mono font-bold text-signal-pure uppercase tracking-wide">
              {t('dossier.title')}
            </h2>

            <p className="mt-1 text-xs font-sans text-ash-muted max-w-2xl leading-relaxed">
              {t('dossier.subtitle')}
            </p>
          </div>

          {/* Quick Institutional Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <div className="px-2.5 py-1.5 bg-graphite border border-slate-border text-signal-pure">
              <span className="text-ash-muted">FOCUS: </span>
              <span className="text-cyan-hyper">DISTRIBUTED SYSTEMS & KERNEL I/O</span>
            </div>
            <div className="px-2.5 py-1.5 bg-graphite border border-slate-border text-signal-pure">
              <span className="text-ash-muted">NEXT MILESTONE: </span>
              <span className="text-signal-pure">5G NETWORK SLICING TESTBED</span>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-border flex items-center gap-2">
          <button
            onClick={() => setActiveTab('case_studies')}
            className={`px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
              activeTab === 'case_studies'
                ? 'bg-graphite text-signal-pure border border-cyan-hyper shadow-cyan-subtle'
                : 'text-ash-muted hover:text-signal-pure border border-slate-border'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-cyan-hyper" />
              <span>{t('dossier.case_studies')}</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
              activeTab === 'roadmap'
                ? 'bg-graphite text-signal-pure border border-cyan-hyper shadow-cyan-subtle'
                : 'text-ash-muted hover:text-signal-pure border border-slate-border'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-hyper" />
              <span>{t('dossier.publications')}</span>
            </span>
          </button>
        </div>
      </section>

      {/* View 1: Case Study Blueprints */}
      {activeTab === 'case_studies' && (
        <section className="space-y-4">
          {DOSSIER_CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="relative bg-void border border-slate-border overflow-hidden select-text"
            >
              <ReticleCorner position="top-left" label={study.index} />

              {/* Case Study Header */}
              <div className="bg-graphite border-b border-slate-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 font-mono select-none">
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-ash-muted mb-1">
                    <span className="px-1.5 py-0.5 bg-void border border-cyan-hyper text-cyan-hyper font-bold">
                      {study.index}
                    </span>
                    <span>AREA: {study.targetCommittee}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-signal-pure uppercase">
                    {language === 'ar' ? study.titleAr : study.title}
                  </h3>
                </div>

                <div className="text-end font-mono text-[10px] text-ash-muted shrink-0">
                  <div className="text-cyan-hyper font-semibold">ARCHITECTURE STUDY</div>
                  <div>{study.leadResearchArea}</div>
                </div>
              </div>

              {/* Problem vs Solution Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-slate-border border-b border-slate-border">
                {/* Problem Statement */}
                <div className="p-4 bg-void hover:bg-graphite/25 transition-colors duration-150">
                  <div className="text-[10px] font-mono text-ash-muted uppercase tracking-wider mb-1 flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-1.5 bg-red-400" />
                    <span>PROBLEM STATEMENT</span>
                  </div>
                  <p className="text-xs font-sans text-signal-pure/90 leading-relaxed">
                    {language === 'ar' ? study.problemStatementAr : study.problemStatement}
                  </p>
                </div>

                {/* System Architecture Solution */}
                <div className="p-4 bg-graphite/30 hover:bg-graphite/50 transition-colors duration-150">
                  <div className="text-[10px] font-mono text-ash-muted uppercase tracking-wider mb-1 flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-1.5 bg-cyan-hyper" />
                    <span>PROPOSED ARCHITECTURE</span>
                  </div>
                  <p className="text-xs font-sans text-signal-pure/90 leading-relaxed">
                    {language === 'ar' ? study.systemSolutionAr : study.systemSolution}
                  </p>
                </div>
              </div>

              {/* Empirical Benchmark Matrix */}
              <div className="p-4 bg-void select-none">
                <div className="text-[10px] font-mono text-ash-muted uppercase tracking-wider mb-3">
                  {t('dossier.benchmarks')}{' // MODELED, NOT YET MEASURED'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {study.benchmarks.map((bm, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-3 bg-graphite/70 border border-slate-border hover:border-cyan-hyper hover:bg-graphite transition-all duration-150 cursor-pointer flex flex-col justify-between group shadow-none hover:shadow-cyan-subtle"
                    >
                      <div className="text-[10px] font-mono text-ash-muted mb-2 truncate">
                        {language === 'ar' ? bm.metricAr : bm.metric}
                      </div>

                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[10px] font-mono text-ash-muted line-through">
                          {bm.baseline}
                        </span>
                        <span className="text-sm font-mono font-bold text-signal-pure">
                          {bm.petabyteResult}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-border flex items-center justify-between text-[10px] font-mono text-cyan-hyper font-semibold">
                        <span>TARGET Δ</span>
                        <span>{bm.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* View 2: Research Roadmap — real, in-flight work only */}
      {activeTab === 'roadmap' && (
        <section className="bg-void border border-slate-border p-4 select-text" data-testid="research-roadmap">
          <div className="text-xs font-mono text-ash-muted mb-4 flex items-center justify-between border-b border-slate-border pb-2 select-none">
            <span className="font-bold text-signal-pure uppercase">{t('dossier.publications')}</span>
            <span>MEASURED RESULTS REPLACE DESIGN STUDIES ON COMPLETION</span>
          </div>

          <div className="space-y-4">
            {RESEARCH_ROADMAP.map((item) => (
              <div key={item.id} className="p-4 bg-graphite/60 border border-slate-border hover:border-cyan-hyper transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-ash-muted mb-1 select-none">
                  <span className="text-signal-pure font-semibold">{item.kind}</span>
                  <span className="px-2 py-0.5 bg-void border border-cyan-hyper text-cyan-hyper font-semibold">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-mono font-bold text-signal-pure mb-1.5 leading-snug">
                  {language === 'ar' ? item.titleAr : item.title}
                </h4>
                <p className="text-xs font-sans text-ash-muted mb-3 leading-relaxed">
                  {language === 'ar' ? item.summaryAr : item.summary}
                </p>

                <ul className="space-y-1 text-[11px] font-sans text-signal-pure/90 mb-3">
                  {(language === 'ar' ? item.deliverablesAr : item.deliverables).map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 mt-0.5 text-cyan-hyper shrink-0 rtl:rotate-180" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between gap-2 text-[10px] font-mono pt-2 border-t border-slate-border select-none">
                  <span className="text-ash-muted">
                    RESULTS: <span className="text-signal-pure">{item.resultsStatus}</span>
                  </span>
                  <span className="flex items-center gap-1 text-ash-muted">
                    <FileCheck2 className="w-3 h-3 text-cyan-hyper" />
                    <span>BENCHMARKS PUBLISH HERE WHEN MEASURED</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
