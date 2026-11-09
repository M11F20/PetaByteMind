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
  isPlayingPreview: boolean;
  setIsPlayingPreview: (playing: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('cmd');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activePillarNode, setActivePillarNode] = useState<SystemPillarId>('systems_philosophy');
  const [complexityFilter, setComplexityFilter] = useState<ComplexityLevel>('all');
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
