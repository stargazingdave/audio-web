import type { ReactNode } from 'react';
export interface StatusIndicatorProps { children: ReactNode; tone?: 'neutral' | 'active' | 'warning'; className?: string; }
export function StatusIndicator({ children, tone = 'neutral', className = '' }: StatusIndicatorProps) {
  return <span className={`audio-status ${className}`} data-tone={tone}>
    <span className="audio-status__dot" aria-hidden="true" />{children}
  </span>;
}
