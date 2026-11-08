export interface LevelMeterProps { level: number; label?: string; className?: string; }
export function LevelMeter({ level, label = 'Input level', className = '' }: LevelMeterProps) {
  const value = Number.isFinite(level) ? Math.max(0, Math.min(1, level)) : 0;
  return <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
    className={`noised-level ${className}`}>
    {Array.from({ length: 18 }, (_, i) => <span key={i} data-lit={i < Math.ceil(value * 18) || undefined} />)}
  </div>;
}
