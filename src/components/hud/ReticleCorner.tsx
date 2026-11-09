import React from 'react';

interface ReticleCornerProps {
  label?: string;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function ReticleCorner({
  label,
  className = '',
  position = 'top-left',
}: ReticleCornerProps) {
  const isEnd = position.endsWith('right');
  const positionClasses = {
    'top-left': 'top-0 start-0 border-t border-s',
    'top-right': 'top-0 end-0 border-t border-e',
    'bottom-left': 'bottom-0 start-0 border-b border-s',
    'bottom-right': 'bottom-0 end-0 border-b border-e',
  }[position];

  return (
    <div
      className={`absolute pointer-events-none w-3 h-3 border-cyan-hyper/60 z-20 ${positionClasses} ${className}`}
    >
      {label && (
        // Positioned by a non-mono wrapper: the global `.font-mono { direction: ltr }` rule would otherwise
        // resolve `start`/`end` against LTR and push RTL labels outside their compartment.
        <span className={`absolute -top-3.5 ${isEnd ? 'end-0' : 'start-0'} whitespace-nowrap select-none`}>
          <span className="text-[9px] font-mono tracking-widest text-ash-muted uppercase">{label}</span>
        </span>
      )}
    </div>
  );
}

export function CrosshairReticle({ className = '' }: { className?: string }) {
  return (
    <div className={`relative pointer-events-none flex items-center justify-center ${className}`}>
      <div className="w-4 h-[1px] bg-cyan-hyper/50 absolute" />
      <div className="h-4 w-[1px] bg-cyan-hyper/50 absolute" />
      <div className="w-1.5 h-1.5 border border-cyan-hyper/80 absolute" />
    </div>
  );
}
