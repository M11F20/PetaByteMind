'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { VAULT_SNIPPETS } from '@/data/mockData';
import { ComplexityLevel } from '@/types';
import { ReticleCorner } from '@/components/hud/ReticleCorner';
import {
  Sliders,
  Copy,
  Check,
  Code2,
  FileCode,
  Layers,
  Terminal,
  ArrowRight,
} from 'lucide-react';

export function VaultWorkspace() {
  const { complexityFilter, setComplexityFilter } = useWorkspace();
  const { t, language } = useDirection();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSchematicStage, setActiveSchematicStage] = useState<number>(1);

  const filterButtons: Array<{ id: ComplexityLevel; labelKey: string }> = [
    { id: 'all', labelKey: 'vault.filter_all' },
    { id: 'vibe_primer', labelKey: 'vault.filter_vibe' },
    { id: 'fullstack_arch', labelKey: 'vault.filter_fullstack' },
    { id: 'systems_design', labelKey: 'vault.filter_systems' },
    { id: 'silicon_limits', labelKey: 'vault.filter_silicon' },
  ];

  const filteredSnippets = VAULT_SNIPPETS.filter((s) => {
    if (complexityFilter === 'all') return true;
    return s.complexity === complexityFilter;
  });

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const schematicStages = [
    {
      id: 0,
      name: 'KERNEL BUS',
      nameAr: 'ناقل النواة',
      tag: 'io_uring // DPDK',
      desc: 'Zero-copy ring buffers bypass kernel context switching to feed frames directly into L3 cache lines.',
      descAr: 'حلقات الذاكرة بدون نسخ تتجاوز تبديل السياق وتمرر الحزم مباشرة لكاش المعالج.',
    },
    {
      id: 1,
      name: 'SIMD DEDUP',
      nameAr: 'إزالة التكرار بالمتجهات',
      tag: 'AVX-512 FINGERPRINT',
      desc: 'Parallel 512-bit register comparisons identify redundant payload spikes in under 840ns.',
      descAr: 'مقارنات متوازية بسجلات 512-بت تكشف حزم البيانات المتكررة في زمن يقل عن 840 نانوثانية.',
    },
    {
      id: 2,
      name: 'CONSENSUS LOG',
      nameAr: 'سجل الإجماع الموزع',
      tag: 'RAFT RING ATOMIC',
      desc: 'Sequential atomic memory commits with memory-barrier fences guarantee crash-fault tolerance.',
      descAr: 'تثبيت متسلسل ذري على الذاكرة مع حواجز عتادية لضمان الصمود أمام انهيار العقد.',
    },
    {
      id: 3,
      name: 'AGENT DISPATCH',
      nameAr: 'توجيه الوكلاء الأذكياء',
      tag: 'TREE-SITTER AST',
      desc: 'Speculative AST synthesizers analyze grammar invariants and stream verified mutations to browser viewports.',
      descAr: 'محللات شجرية تكهنية تفحص القواعد اللغوية وتدفق التعديلات المتحقق منها لمتصفح المستخدم.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-4 p-3 md:p-4 overflow-y-auto">
      {/* Header Banner */}
      <section className="relative w-full bg-void border border-slate-border p-4 select-none">
        <ReticleCorner position="top-left" label="VAULT.01 // SPECS" />
        <ReticleCorner position="top-right" label="SECURITY: LEVEL 4" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-cyan-hyper" />
              <h2 className="text-base sm:text-lg font-mono font-bold text-signal-pure uppercase tracking-wider">
                {t('vault.title')}
              </h2>
            </div>
            <p className="text-xs font-sans text-ash-muted max-w-2xl leading-relaxed">
              {t('vault.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-ash-muted">
            <span className="px-2 py-1 bg-graphite border border-slate-border">
              SNIPPETS: <span className="text-cyan-hyper font-semibold">{filteredSnippets.length}</span>
            </span>
          </div>
        </div>

        {/* Complexity Filter Navigation Bar */}
        <div className="mt-4 pt-3 border-t border-slate-border flex items-center gap-1.5 overflow-x-auto pb-1">
          <Sliders className="w-3.5 h-3.5 text-cyan-hyper shrink-0 me-1" />
          {filterButtons.map((btn) => {
            const isActive = complexityFilter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setComplexityFilter(btn.id)}
                className={`px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap transition-colors duration-100 ${
                  isActive
                    ? 'bg-graphite text-signal-pure border border-cyan-hyper shadow-cyan-subtle'
                    : 'text-ash-muted hover:text-signal-pure hover:bg-graphite/50 border border-slate-border'
                }`}
              >
                {t(btn.labelKey)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Compartment 1: Interactive Architecture Schematic */}
      <section className="relative w-full bg-void border border-slate-border p-4 select-none">
        <ReticleCorner position="top-left" label="SCHEMATIC // BUS-04" />
        <ReticleCorner position="top-right" label="BUS: ZERO-COPY" />

        <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-hyper" />
            <span className="font-mono text-xs font-bold text-signal-pure uppercase tracking-wider">
              {t('vault.architecture_schematic')}
            </span>
          </div>
          <span className="font-mono text-[10px] text-ash-muted">
            CLICK STAGE TO INSPECT DATA PATH
          </span>
        </div>

        {/* Multi-stage pipeline block graph */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {schematicStages.map((stage) => {
            const isSelected = activeSchematicStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveSchematicStage(stage.id)}
                className={`p-3 bg-graphite/70 border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'border-cyan-hyper bg-graphite text-signal-pure shadow-cyan-subtle'
                    : 'border-slate-border hover:border-cyan-hyper/80 hover:bg-graphite text-ash-muted hover:text-signal-pure shadow-none hover:shadow-cyan-subtle'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="text-cyan-hyper font-semibold">STAGE 0{stage.id + 1}</span>
                  <span className="px-1.5 py-0.5 bg-void border border-slate-border text-[9px]">
                    {stage.tag}
                  </span>
                </div>
                <h4 className="font-mono text-xs font-bold text-signal-pure mb-1">
                  {language === 'ar' ? stage.nameAr : stage.name}
                </h4>
                <p className="text-[11px] font-sans leading-relaxed text-ash-muted">
                  {language === 'ar' ? stage.descAr : stage.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Compartment 2: Timestamped Code Snapshot Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-ash-muted px-1">
          <span className="flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-cyan-hyper" />
            <span className="font-bold text-signal-pure uppercase">
              {t('vault.code_snapshot')}
            </span>
          </span>
          <span>DISPATCH LOG: {filteredSnippets.length} ARTIFACTS</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="relative bg-void border border-slate-border hover:border-cyan-hyper/80 transition-all duration-150 overflow-hidden group select-text shadow-none hover:shadow-cyan-subtle"
            >
              <ReticleCorner position="top-left" label={snippet.timestamp} />

              {/* Code Snapshot Header */}
              <div className="bg-graphite border-b border-slate-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs select-none">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-void border border-cyan-hyper text-cyan-hyper font-bold text-[10px]">
                    {snippet.timestamp}
                  </span>
                  <span className="text-signal-pure font-semibold text-xs">
                    {snippet.file}
                  </span>
                  <span className="text-[10px] text-ash-muted hidden sm:inline">
                    [{snippet.language.toUpperCase()}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(snippet.id, snippet.code)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-void hover:bg-slate-border/50 border border-slate-border text-signal-pure text-[10px] font-mono transition-colors"
                  >
                    {copiedId === snippet.id ? (
                      <>
                        <Check className="w-3 h-3 text-cyan-hyper" />
                        <span className="text-cyan-hyper">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-ash-muted" />
                        <span>COPY SOURCE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Snippet Title */}
              <div className="px-4 pt-3 pb-1 select-none">
                <h3 className="text-xs sm:text-sm font-mono font-bold text-signal-pure">
                  {language === 'ar' ? snippet.titleAr : snippet.title}
                </h3>
              </div>

              {/* Syntax Highlighted Code Viewer */}
              <div className="p-4 overflow-x-auto bg-[#07090C] border-y border-slate-border/60">
                <pre className="font-mono text-xs text-signal-pure/90 leading-relaxed">
                  <code>{snippet.code}</code>
                </pre>
              </div>

              {/* Technical Takeaway */}
              <div className="p-3 bg-graphite/40 flex items-start gap-2.5 text-xs font-sans text-ash-muted select-none">
                <Terminal className="w-4 h-4 text-cyan-hyper shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-mono font-semibold text-signal-pure me-1">
                    ENGINEERING VERIFICATION:
                  </span>
                  {language === 'ar' ? snippet.takeawayAr : snippet.takeaway}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
