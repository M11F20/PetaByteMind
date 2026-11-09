'use client';

import React from 'react';
import { VideoViewportHUD } from '@/components/hud/VideoViewportHUD';
import { SystemNodeGraph } from '@/components/hud/SystemNodeGraph';
import { TelemetryInspector } from '@/components/hud/TelemetryInspector';
import { useDirection } from '@/context/DirectionContext';
import { Shield, Zap } from 'lucide-react';

export function CommandCenterWorkspace() {
  const { language } = useDirection();

  return (
    <div className="w-full h-full flex flex-col space-y-4 p-3 md:p-4 overflow-y-auto">
      {/* Compartment 1: Hero Viewport (Top Cinematic 16:9 Panel) */}
      <section className="w-full">
        <VideoViewportHUD />
      </section>

      {/* Compartment 2: Interactive System Map & Telemetry Inspector */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left/Main Column: Topological Node Graph (8 cols) */}
        <div className="lg:col-span-8 h-full min-h-[460px]">
          <SystemNodeGraph />
        </div>

        {/* Right Column: Telemetry Inspector (4 cols) */}
        <div className="lg:col-span-4 h-full min-h-[460px]">
          <TelemetryInspector />
        </div>
      </section>

      {/* Compartment 3: Real-Time Diagnostic Telemetry Rail */}
      <section className="w-full bg-graphite border border-slate-border hover:border-cyan-hyper/70 transition-colors duration-150 p-3 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-signal-pure">
              <Zap className="w-3.5 h-3.5 text-cyan-hyper" />
              <span className="font-semibold">ENGINEERING PARADIGM:</span>
            </span>
            <span className="text-ash-muted text-[11px]">
              {language === 'ar'
                ? 'النظم الموزعة والميكانيكا منخفضة المستوى المقترنة بالوكلاء الأذكياء'
                : 'Bare-Metal Sympathy × Agentic Synthesis × Timeline Discipline'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-ash-muted">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-cyan-hyper" />
              <span>ISOLATION: SECCOMP-BPF</span>
            </span>
            <span className="text-slate-border">|</span>
            <span className="text-cyan-hyper font-semibold">
              PIPELINE 01 READY
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
