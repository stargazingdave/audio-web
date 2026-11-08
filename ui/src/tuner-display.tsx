import { PitchMeter } from './pitch-meter';

export interface TunerDisplayProps {
  note: { name: string; octave: number } | null;
  frequency: number | null;
  cents: number | null;
  active?: boolean;
  listening?: boolean;
  tolerance?: number;
  className?: string;
}
/** Instrument readout. Display smoothing and target selection remain the caller's responsibility. */
export function TunerDisplay({ note, frequency, cents, active = false, listening = false,
  tolerance = 3, className = '' }: TunerDisplayProps) {
  const measured = frequency !== null && Number.isFinite(frequency) && frequency > 0;
  const validCents = cents !== null && Number.isFinite(cents);
  const inTune = active && measured && validCents && Math.abs(cents) <= tolerance;
  const status = !listening ? 'Ready' : !measured || !active || !validCents ? 'Listening' :
    inTune ? 'In tune' : cents !== null && cents < 0 ? 'Tune up' : 'Tune down';
  return <div className={`noised-tuner-display ${className}`} data-in-tune={inTune || undefined}
    data-held={measured && !active || undefined}>
    <div className="noised-tuner-display__dial">
      <PitchMeter cents={validCents && measured ? cents : null} active={active} tolerance={tolerance} />
      <div className="noised-tuner-display__readout">
        <div className="noised-tuner-display__note" aria-label={note && measured ? `Detected note ${note.name}${note.octave}` : 'No note detected'}>
          {note && measured ? <>{note.name}<sub>{note.octave}</sub></> : <span className="noised-tuner-display__empty">—</span>}
        </div>
        <div className="noised-tuner-display__frequency" aria-label="Measured frequency">
          <span>{measured ? frequency.toFixed(2) : '—'}</span><span>Hz</span>
        </div>
      </div>
    </div>
    <div className="noised-tuner-display__deviation">
      <span aria-hidden="true" data-lit={active && validCents && cents < -tolerance || undefined}>◀</span>
      <output aria-label="Tuning deviation in cents" aria-live="off">
        {measured && validCents ? <>{cents > 0 ? '+' : ''}{cents.toFixed(1)}</> : '—'}<small>cents</small>
      </output>
      <span aria-hidden="true" data-lit={active && validCents && cents > tolerance || undefined}>▶</span>
    </div>
    <div className="noised-tuner-display__status" role="status" aria-live="polite">{status}</div>
  </div>;
}
