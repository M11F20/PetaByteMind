'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { SYSTEM_PILLARS } from '@/data/mockData';
import { SystemPillarId } from '@/types';
import { ReticleCorner } from './ReticleCorner';
import { Cpu, Network, Layers, Sparkles } from 'lucide-react';

export function SystemNodeGraph() {
  const { activePillarNode, setActivePillarNode } = useWorkspace();
  const { language } = useDirection();
  const [hoveredNode, setHoveredNode] = useState<SystemPillarId | null>(null);

  const activeOrHovered = hoveredNode || activePillarNode;
  const currentPillar = SYSTEM_PILLARS.find((p) => p.id === activeOrHovered) || SYSTEM_PILLARS[0];

  const nodeIcons: Record<SystemPillarId, React.ReactNode> = {
    systems_philosophy: <Layers className="w-3.5 h-3.5" />,
    fullstack_architecture: <Network className="w-3.5 h-3.5" />,
    vibe_coding: <Sparkles className="w-3.5 h-3.5" />,
    hardware_mechanics: <Cpu className="w-3.5 h-3.5" />,
  };

  // Pre-calculated node coordinates for SVG viewBox 0 0 1000 600
  const nodeCoords: Record<SystemPillarId, { x: number; y: number }> = {
    systems_philosophy: { x: 260, y: 160 },
    fullstack_architecture: { x: 740, y: 160 },
    vibe_coding: { x: 740, y: 440 },
    hardware_mechanics: { x: 260, y: 440 },
  };

  // Define edge links between nodes
  const edges: Array<[SystemPillarId, SystemPillarId]> = [
    ['systems_philosophy', 'fullstack_architecture'],
    ['fullstack_architecture', 'vibe_coding'],
    ['vibe_coding', 'hardware_mechanics'],
    ['hardware_mechanics', 'systems_philosophy'],
    ['systems_philosophy', 'hardware_mechanics'],
    ['fullstack_architecture', 'hardware_mechanics'],
  ];

  const isEdgeActive = (source: SystemPillarId, target: SystemPillarId) => {
    return (
      (activeOrHovered === source && currentPillar.connectedTo.includes(target)) ||
      (activeOrHovered === target && currentPillar.connectedTo.includes(source))
    );
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-void border border-slate-border p-4 flex flex-col justify-between overflow-hidden select-none">
      <ReticleCorner position="top-left" label="TOPOLOGY // GRAPH-01" />
      <ReticleCorner position="top-right" label="CLK: 4.80GHz" />
      <ReticleCorner position="bottom-left" label="NODES: 04 ACTIVE" />
      <ReticleCorner position="bottom-right" label="BUS: RING-SYNC" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-border pb-2.5 mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-hyper" />
          <span className="font-mono text-xs font-semibold text-signal-pure tracking-wider uppercase">
            {language === 'ar' ? 'طبولوجيا النظم التفاعلية' : 'INTERACTIVE SYSTEM TOPOLOGY'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-ash-muted">
          SELECT NODE TO INSPECT BUS
        </span>
      </div>

      {/* SVG Canvas for Topological Graph */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full max-h-[380px]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Background Grid Mesh */}
          <defs>
            <pattern id="node-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1F2428" strokeWidth="0.75" />
            </pattern>
            <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D3D5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1F2428" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="1000" height="600" fill="url(#node-grid)" />

          {/* Central Bus Circle */}
          <circle
            cx="500"
            cy="300"
            r="120"
            fill="none"
            stroke="#2D333B"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle
            cx="500"
            cy="300"
            r="8"
            fill="#1F2428"
            stroke="#34D3D5"
            strokeWidth="1"
          />
          <text
            x="500"
            y="325"
            textAnchor="middle"
            fill="#8B949E"
            className="font-mono text-[11px] tracking-widest"
          >
            SYS.CENTRAL.BUS
          </text>

          {/* Edges / Connections */}
          {edges.map(([src, tgt], idx) => {
            const p1 = nodeCoords[src];
            const p2 = nodeCoords[tgt];
            const active = isEdgeActive(src, tgt);

            return (
              <g key={`edge-${idx}`}>
                {/* Base Edge */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={active ? '#34D3D5' : '#2D333B'}
                  strokeWidth={active ? 1.75 : 1}
                  className="transition-colors duration-150"
                />
                {/* Pulse along active edge */}
                {active && (
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#F0F6FC"
                    strokeWidth={2}
                    strokeDasharray="12 48"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Interactive Pillar Nodes */}
          {SYSTEM_PILLARS.map((node) => {
            const pos = nodeCoords[node.id];
            const isSelected = activePillarNode === node.id;
            const isHovered = hoveredNode === node.id;
            const isActive = isSelected || isHovered;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setActivePillarNode(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer group"
              >
                {/* Outer Ring */}
                <circle
                  r={isActive ? 38 : 32}
                  fill="#0B0E11"
                  stroke={isActive ? '#34D3D5' : '#2D333B'}
                  strokeWidth={isActive ? 2 : 1}
                  className="transition-all duration-150"
                />

                {/* Inner Compartment Fill */}
                <circle
                  r={isActive ? 28 : 24}
                  fill={isActive ? '#1F2428' : '#14181D'}
                  stroke={isActive ? '#34D3D5' : '#2D333B'}
                  strokeWidth="1"
                />

                {/* Index Monogram Text */}
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill={isActive ? '#34D3D5' : '#8B949E'}
                  className="font-mono text-[12px] font-bold"
                >
                  {node.index}
                </text>
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  fill={isActive ? '#F0F6FC' : '#8B949E'}
                  className="font-mono text-[8px] uppercase tracking-wider"
                >
                  PILLAR
                </text>

                {/* Node Title Label Box */}
                <g transform="translate(0, 52)">
                  <rect
                    x="-100"
                    y="-12"
                    width="200"
                    height="24"
                    fill="#1F2428"
                    stroke={isActive ? '#34D3D5' : '#2D333B'}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill={isActive ? '#F0F6FC' : '#8B949E'}
                    className="font-mono text-[10px] font-semibold tracking-wider uppercase"
                  >
                    {language === 'ar' ? node.labelAr : node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-border pt-2 text-[10px] font-mono text-ash-muted z-10">
        <div className="flex items-center gap-3">
          <span>ACTIVE: <span className="text-cyan-hyper">{currentPillar.index} // {currentPillar.label}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-cyan-hyper inline-block" />
          <span>CONNECTED BUS: {currentPillar.connectedTo.length} NODES</span>
        </div>
      </div>
    </div>
  );
}
