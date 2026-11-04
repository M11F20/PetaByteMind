'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useDirection } from '@/context/DirectionContext';
import { WorkspaceId, ComplexityLevel } from '@/types';
import {
  Search,
  Terminal,
  Database,
  FileText,
  Globe,
  Languages,
  Sliders,
  Cpu,
  CornerDownLeft,
  X,
} from 'lucide-react';

export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveWorkspace,
    setComplexityFilter,
  } = useWorkspace();

  const { language, setLanguage, t } = useDirection();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  interface CommandItem {
    id: string;
    category: 'WORKSPACE' | 'COMPLEXITY' | 'SYSTEM';
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    action: () => void;
  }

  const items: CommandItem[] = [
    // Workspaces
    {
      id: 'ws-cmd',
      category: 'WORKSPACE',
      label: 'Switch to 01. The Command Center',
      sublabel: 'Hero 16:9 Viewport & Interactive System Topology',
      icon: <Terminal className="w-4 h-4 text-cyan-hyper" />,
      action: () => {
        setActiveWorkspace('cmd');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'ws-vault',
      category: 'WORKSPACE',
      label: 'Switch to 02. The Knowledge Vault',
      sublabel: 'Companion essays, kernel snapshots & architecture schematics',
      icon: <Database className="w-4 h-4 text-cyan-hyper" />,
      action: () => {
        setActiveWorkspace('vault');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'ws-dossier',
      category: 'WORKSPACE',
      label: 'Switch to 03. The Engineering Dossier',
      sublabel: 'Research portfolio, empirical benchmarks & IEEE/ACM publications',
      icon: <FileText className="w-4 h-4 text-cyan-hyper" />,
      action: () => {
        setActiveWorkspace('dossier');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'ws-network',
      category: 'WORKSPACE',
      label: 'Switch to 04. The Global Network',
      sublabel: 'Slack intake pipeline & MENA <-> North America bridge nodes',
      icon: <Globe className="w-4 h-4 text-cyan-hyper" />,
      action: () => {
        setActiveWorkspace('network');
        setCommandPaletteOpen(false);
      },
    },

    // Complexity Jumps
    {
      id: 'cx-vibe',
      category: 'COMPLEXITY',
      label: 'Complexity: 01 // Vibe-Coding Primer',
      sublabel: 'Speculative multi-turn AST synthesis with Tree-sitter',
      icon: <Sliders className="w-4 h-4 text-ash-muted" />,
      action: () => {
        setActiveWorkspace('vault');
        setComplexityFilter('vibe_primer');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cx-fullstack',
      category: 'COMPLEXITY',
      label: 'Complexity: 02 // Full-Stack Architecture',
      sublabel: 'QUIC multiplexing & flow-controlled telemetry streams',
      icon: <Sliders className="w-4 h-4 text-ash-muted" />,
      action: () => {
        setActiveWorkspace('vault');
        setComplexityFilter('fullstack_arch');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cx-systems',
      category: 'COMPLEXITY',
      label: 'Complexity: 03 // Systems Design',
      sublabel: 'Lock-free raft ring buffers and memory-mapped logs',
      icon: <Cpu className="w-4 h-4 text-ash-muted" />,
      action: () => {
        setActiveWorkspace('vault');
        setComplexityFilter('systems_design');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'cx-silicon',
      category: 'COMPLEXITY',
      label: 'Complexity: 04 // Silicon Limits',
      sublabel: 'io_uring fixed buffers and direct bare-metal hardware hooks',
      icon: <Cpu className="w-4 h-4 text-ash-muted" />,
      action: () => {
        setActiveWorkspace('vault');
        setComplexityFilter('silicon_limits');
        setCommandPaletteOpen(false);
      },
    },

    // System Language switches
    {
      id: 'sys-lang-en',
      category: 'SYSTEM',
      label: 'Set Direction: English (LTR // Left-to-Right)',
      sublabel: 'Mirror layout to standard Western IDE orientation',
      icon: <Languages className="w-4 h-4 text-signal-pure" />,
      action: () => {
        setLanguage('en');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'sys-lang-ar',
      category: 'SYSTEM',
      label: 'Set Direction: Arabic (RTL // اليمين إلى اليسار)',
      sublabel: 'عكس تخطيط الواجهة مع الإبقاء على المصطلحات الهندسية',
      icon: <Languages className="w-4 h-4 text-cyan-hyper" />,
      action: () => {
        setLanguage('ar');
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.sublabel.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-void/85 backdrop-blur-[2px]">
      <div
        className="w-full max-w-xl bg-graphite border border-slate-border shadow-2xl overflow-hidden font-mono text-xs select-none animate-in fade-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Top Input Header */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-border bg-void">
          <Search className="w-4 h-4 text-cyan-hyper shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or filter (e.g. 'vault', 'systems', 'arabic')..."
            className="w-full bg-transparent border-none text-signal-pure placeholder:text-ash-muted focus:outline-none text-xs"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-ash-muted hover:text-signal-pure p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-border/50">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-ash-muted text-[11px]">
              NO MATCHING COMMANDS IN DISPATCH BUS
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-void text-signal-pure border-inline-start-2 border-cyan-hyper' : 'text-ash-muted hover:text-signal-pure'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-signal-pure truncate">
                          {item.label}
                        </span>
                        <span className="text-[9px] px-1 bg-void border border-slate-border text-ash-muted shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-ash-muted truncate">
                        {item.sublabel}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <CornerDownLeft className="w-3.5 h-3.5 text-cyan-hyper shrink-0 ms-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Status Help */}
        <div className="px-3 py-2 bg-void border-t border-slate-border flex items-center justify-between text-[10px] text-ash-muted">
          <div className="flex items-center gap-3">
            <span>↑↓ NAVIGATE</span>
            <span>ENTER SELECT</span>
            <span>ESC CLOSE</span>
          </div>
          <span className="text-cyan-hyper">PETABYTE COMMAND DISPATCH</span>
        </div>
      </div>
    </div>
  );
}
