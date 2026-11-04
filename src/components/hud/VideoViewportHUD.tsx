'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Maximize2, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { ReticleCorner, CrosshairReticle } from './ReticleCorner';

export function VideoViewportHUD() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { liveFps, smpteTimecode, isPlayingPreview, setIsPlayingPreview } = useWorkspace();
  const { t, language } = useDirection();
  const [activeChapter, setActiveChapter] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progressPercent, setProgressPercent] = useState(38);

  const chapters = [
    { id: 'ch-01', index: '01', title: 'GENESIS & THE RESOLVE AESTHETIC', time: '00:00' },
    { id: 'ch-02', index: '02', title: 'ZERO-COPY BUFFER ARCHITECTURE', time: '08:42' },
    { id: 'ch-03', index: '03', title: 'MECHANICAL SYMPATHY & CACHE LINES', time: '17:15' },
    { id: 'ch-04', index: '04', title: 'THE SPECULATIVE AGENTIC LOOP', time: '26:50' },
  ];

  // Draw cyber-physical oscilloscope / vector grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tOffset = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

      // Deep void charcoal base
      ctx.fillStyle = '#0B0E11';
      ctx.fillRect(0, 0, width, height);

      // Subtle engineering grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#1F2428';
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw cybernetic waveforms (Lissajous / Oscilloscope audio telemetry)
      const centerY = height * 0.52;
      tOffset += isPlayingPreview ? 0.08 : 0.02;

      // Primary cyan waveform (restrained under 5% visual weight)
      ctx.strokeStyle = '#34D3D5';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let x = 0; x < width; x += 4) {
        const norm = (x / width) * Math.PI * 4;
        const wave1 = Math.sin(norm * 1.5 + tOffset) * 24;
        const wave2 = Math.cos(norm * 3.2 - tOffset * 1.2) * 12;
        const noise = (Math.random() - 0.5) * 3;
        const y = centerY + wave1 + wave2 + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary muted ash waveform
      ctx.strokeStyle = '#2D333B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 6) {
        const norm = (x / width) * Math.PI * 3;
        const y = centerY + Math.sin(norm * 2 + tOffset * 0.5) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Central vector reticle pulse
      const centerBoxSize = 120;
      ctx.strokeStyle = '#2D333B';
      ctx.strokeRect(width / 2 - centerBoxSize / 2, height / 2 - centerBoxSize / 2, centerBoxSize, centerBoxSize);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlayingPreview]);

  // Timeline progress simulation when playing
  useEffect(() => {
    if (!isPlayingPreview) return;
    const interval = setInterval(() => {
      setProgressPercent((prev) => (prev >= 100 ? 0 : prev + 0.2));
    }, 200);
    return () => clearInterval(interval);
  }, [isPlayingPreview]);

  return (
    <div className="relative w-full border border-slate-border bg-void overflow-hidden flex flex-col select-none group">
      {/* Reticle Corner Coordinates */}
      <ReticleCorner position="top-left" label="SYS.01 // VIEWPORT: 4K" />
      <ReticleCorner position="top-right" label="SMPTE // 24.000p" />
      <ReticleCorner position="bottom-left" label="LUT: REC709.EMU" />
      <ReticleCorner position="bottom-right" label="BUS: 0xFD4" />

      {/* Main 16:9 Screen Container */}
      <div className="relative w-full h-[320px] md:h-[420px] lg:h-[460px] bg-void">
        {/* Underlying Canvas Audio/Waveform Generator */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(11,14,17,0)_50%,rgba(0,0,0,0.45)_50%)] bg-[length:100%_4px] opacity-40" />

        {/* Broadcast Safe Area Overlay Guides */}
        <div className="absolute inset-8 border border-slate-border/40 pointer-events-none">
          <span className="absolute top-1 start-1 font-mono text-[9px] text-ash-muted/60">
            TITLE SAFE 90%
          </span>
        </div>
        <div className="absolute inset-16 border border-slate-border/25 pointer-events-none hidden sm:block">
          <span className="absolute top-1 start-1 font-mono text-[9px] text-ash-muted/40">
            ACTION SAFE 80%
          </span>
        </div>

        {/* Center Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <CrosshairReticle />
        </div>

        {/* Top HUD Telemetry Bar (SVG / Overlay) */}
        <div className="absolute top-3 inset-x-4 flex items-center justify-between text-xs font-mono pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-graphite/90 border border-slate-border text-signal-pure text-[11px]">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>{t('telemetry.rec')}</span>
              <span className="text-cyan-hyper ms-1">{smpteTimecode}</span>
            </span>
            <span className="px-2 py-0.5 bg-graphite/80 border border-slate-border text-ash-muted text-[10px] hidden sm:inline-block">
              CODEC: <span className="text-signal-pure">AV1 // 4K // 10-BIT</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-graphite/80 border border-slate-border text-ash-muted text-[10px]">
              FPS: <span className="text-cyan-hyper font-semibold">{liveFps}</span>
            </span>
            <span className="px-2 py-0.5 bg-graphite/80 border border-slate-border text-ash-muted text-[10px] hidden md:inline-block">
              COLOR: <span className="text-signal-pure">ACEScc // D65</span>
            </span>
          </div>
        </div>

        {/* Central Title & Narrative Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-graphite/95 border border-slate-border mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-hyper animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-ash-muted uppercase">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-mono font-bold tracking-tight text-signal-pure uppercase max-w-3xl drop-shadow-sm">
            {t('hero.title')}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-ash-muted max-w-xl font-sans line-clamp-2 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Interactive Trigger Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <button
              onClick={() => setIsPlayingPreview(!isPlayingPreview)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-graphite hover:bg-slate-border/50 border border-cyan-hyper text-signal-pure font-mono text-xs tracking-wider uppercase transition-all duration-150 active:scale-[0.98] shadow-cyan-subtle"
            >
              {isPlayingPreview ? (
                <>
                  <Pause className="w-4 h-4 text-cyan-hyper" />
                  <span>PAUSE MASTER TIMELINE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-cyan-hyper fill-cyan-hyper" />
                  <span>{t('hero.cta')}</span>
                  <span className="text-cyan-hyper ms-1 text-[10px]">[{t('hero.meta_time')}]</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-3 py-2.5 bg-graphite/80 hover:bg-graphite border border-slate-border text-ash-muted hover:text-signal-pure font-mono text-xs transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-hyper" />}
            </button>
          </div>
        </div>

        {/* Bottom Playhead / Scrubber Track */}
        <div className="absolute bottom-0 inset-x-0 bg-graphite/95 border-t border-slate-border p-2">
          {/* Chapter Markers */}
          <div className="flex items-center justify-between text-[10px] font-mono text-ash-muted px-1 mb-1.5 overflow-x-auto gap-2">
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapter(idx);
                  setProgressPercent((idx / chapters.length) * 100);
                }}
                className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeChapter === idx ? 'text-cyan-hyper font-semibold' : 'hover:text-signal-pure'
                }`}
              >
                <span className="text-[9px] text-ash-muted">[{ch.time}]</span>
                <span>{ch.title}</span>
              </button>
            ))}
          </div>

          {/* Interactive Scrub Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
              setProgressPercent(newPct);
            }}
            className="relative w-full h-2 bg-void border border-slate-border cursor-pointer group/scrub"
          >
            {/* Filled Progress */}
            <div
              className="h-full bg-cyan-hyper/80 transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Playhead Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-signal-pure border border-cyan-hyper transition-all duration-75 pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 3px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
