'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkspaceId, SystemPillarId, ComplexityLevel } from '@/types';

interface WorkspaceContextValue {
  activeWorkspace: WorkspaceId;
  setActiveWorkspace: (id: WorkspaceId) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  activePillarNode: SystemPillarId;
  setActivePillarNode: (node: SystemPillarId) => void;
  complexityFilter: ComplexityLevel;
  setComplexityFilter: (filter: ComplexityLevel) => void;
  liveFps: string;
  smpteTimecode: string;
  isPlayingPreview: boolean;
  setIsPlayingPreview: (playing: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('cmd');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activePillarNode, setActivePillarNode] = useState<SystemPillarId>('systems_philosophy');
  const [complexityFilter, setComplexityFilter] = useState<ComplexityLevel>('all');
  const [liveFps, setLiveFps] = useState('60.0');
  const [smpteTimecode, setSmpteTimecode] = useState('01:14:28:18');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const toggleCommandPalette = () => {
    setCommandPaletteOpen((prev) => !prev);
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Frame rate and SMPTE timecode simulation
  useEffect(() => {
    let frame = 18;
    let seconds = 28;
    let minutes = 14;
    let hours = 1;

    const timer = setInterval(() => {
      // Jitter FPS slightly between 59.8 and 60.1
      const jitter = (59.8 + Math.random() * 0.3).toFixed(1);
      setLiveFps(jitter);

      frame += 1;
      if (frame >= 60) {
        frame = 0;
        seconds += 1;
        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
          if (minutes >= 60) {
            minutes = 0;
            hours = (hours + 1) % 24;
          }
        }
      }

      const fStr = frame.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const hStr = hours.toString().padStart(2, '0');
      setSmpteTimecode(`${hStr}:${mStr}:${sStr}:${fStr}`);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        setActiveWorkspace,
        commandPaletteOpen,
        setCommandPaletteOpen,
        toggleCommandPalette,
        activePillarNode,
        setActivePillarNode,
        complexityFilter,
        setComplexityFilter,
        liveFps,
        smpteTimecode,
        isPlayingPreview,
        setIsPlayingPreview,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
