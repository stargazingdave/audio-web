export interface PitchMeterProps {
  cents: number | null; tolerance?: number; range?: number; active?: boolean;
  label?: string; className?: string;
}
const polar = (degrees: number, radius: number) => {
  const radians = degrees * Math.PI / 180;
  return [260 + Math.sin(radians) * radius, 254 - Math.cos(radians) * radius];
};
const arc = (from: number, to: number, radius: number) => {
  const a = polar(from, radius), b = polar(to, radius);
  return `M ${a[0]} ${a[1]} A ${radius} ${radius} 0 0 1 ${b[0]} ${b[1]}`;
};
/** A display-only cents meter. Never quantizes or alters the supplied measurement. */
export function PitchMeter({ cents, tolerance = 3, range = 50, active = true, label = 'Tuning deviation', className = '' }: PitchMeterProps) {
  const limit = Number.isFinite(range) && range > 0 ? range : 50;
  const valid = cents !== null && Number.isFinite(cents);
  const clamped = valid ? Math.max(-limit, Math.min(limit, cents)) : 0;
  const angle = clamped / limit * 65;
  const inTune = valid && Math.abs(cents) <= tolerance;
  const point = polar(angle, 198);
  const band = Math.max(0, Math.min(limit, tolerance)) / limit * 65;
  return <div className={`noised-pitch-meter ${className}`} data-active={active && valid || undefined} data-in-tune={inTune || undefined}>
    <svg viewBox="0 0 520 275" role="img" aria-label={valid ? `${label}: ${cents.toFixed(1)} cents` : `${label}: no reading`}>
      <path d={arc(-65, 65, 209)} className="noised-pitch-meter__track" />
      <path d={arc(-band, band, 209)} className="noised-pitch-meter__zone" />
      {Array.from({ length: 21 }, (_, i) => {
        const degree = -65 + i * 6.5, major = i % 5 === 0;
        const a = polar(degree, 190), b = polar(degree, major ? 173 : 181);
        const text = polar(degree, 151);
        return <g key={i}><line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="noised-pitch-meter__tick" />
          {major ? <text x={text[0]} y={text[1]} textAnchor="middle" dominantBaseline="middle">{Math.round(-limit + i * limit / 10)}</text> : null}</g>;
      })}
      <path d="M 260 11 L 255 21 L 265 21 Z" className="noised-pitch-meter__center" />
      <g className="noised-pitch-meter__needle" style={{ opacity: active && valid ? 1 : 0.18 }}>
        <line x1="260" y1="254" x2={point[0]} y2={point[1]} /><circle cx="260" cy="254" r="6" />
      </g>
      <text x="55" y="251" className="noised-pitch-meter__direction">FLAT</text>
      <text x="465" y="251" textAnchor="end" className="noised-pitch-meter__direction">SHARP</text>
    </svg>
  </div>;
}
