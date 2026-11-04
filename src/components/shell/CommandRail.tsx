'use client';

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { WorkspaceId } from '@/types';
import { Terminal, Database, FileText, Globe, Languages, Activity } from 'lucide-react';

export function CommandRail() {
  const { activeWorkspace, setActiveWorkspace } = useWorkspace();
  const { language, toggleLanguage, t } = useDirection();

  const navItems: Array<{
    id: WorkspaceId;
    index: string;
    labelKey: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'cmd',
      index: '01',
      labelKey: 'nav.cmd',
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: 'vault',
      index: '02',
      labelKey: 'nav.vault',
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'dossier',
      index: '03',
      labelKey: 'nav.dossier',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'network',
      index: '04',
      labelKey: 'nav.network',
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className="w-16 md:w-56 h-full bg-graphite border-inline-end border-slate-border flex flex-col justify-between select-none z-20 shrink-0"
    >
      {/* Top Brand Monogram */}
      <div>
        <div className="h-10 border-b border-slate-border flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-void border border-cyan-hyper flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-hyper" />
            </div>
            <span className="font-mono text-xs font-bold tracking-widest text-signal-pure hidden md:inline">
              PETABYTE<span className="text-cyan-hyper">MIND</span>
            </span>
          </div>
          <span className="font-mono text-[9px] text-ash-muted hidden md:inline">
            v1.0.4
          </span>
        </div>

        {/* Workspace Navigation Item List */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeWorkspace === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveWorkspace(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 text-xs font-mono transition-all duration-100 relative ${
                  isActive
                    ? 'bg-void text-signal-pure border border-cyan-hyper shadow-cyan-subtle'
                    : 'text-ash-muted hover:text-signal-pure hover:bg-void/40 border border-transparent'
                }`}
                title={t(item.labelKey)}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute inset-y-0 start-0 w-[2px] bg-cyan-hyper" />
                )}

                <span className={isActive ? 'text-cyan-hyper' : 'text-ash-muted'}>
                  {item.icon}
                </span>

                <div className="hidden md:flex flex-col items-start leading-none text-start">
                  <span className="text-[9px] text-ash-muted uppercase tracking-wider mb-0.5">
                    SYS.{item.index}
                  </span>
                  <span className="font-semibold tracking-wider">
                    {t(item.labelKey)}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls: Language Toggle & Telemetry */}
      <div className="p-2 border-t border-slate-border space-y-2">
        {/* Language Switch Button */}
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-2.5 py-2 bg-void hover:bg-slate-border/50 border border-slate-border text-signal-pure font-mono text-xs transition-colors"
          title="Toggle LTR / RTL Language (English / Arabic)"
        >
          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-cyan-hyper" />
            <span className="hidden md:inline text-[11px]">
              {language === 'en' ? 'EN // عربي' : 'عربي // EN'}
            </span>
          </div>
          <span className="text-[10px] text-cyan-hyper font-semibold">
            {language.toUpperCase()}
          </span>
        </button>

        {/* Ping / RTT indicator */}
        <div className="hidden md:flex items-center justify-between px-2 text-[10px] font-mono text-ash-muted">
          <span className="flex items-center gap-1.5">
            <Activity className="w-2.5 h-2.5 text-cyan-hyper animate-pulse" />
            <span>RTT</span>
          </span>
          <span className="text-signal-pure">14ms (LOCKED)</span>
        </div>
      </div>
    </aside>
  );
}
