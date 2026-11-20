export interface NoteOption { id: string; name: string; octave: number; detail?: string; }
export interface NoteSelectorProps {
  label?: string; notes: readonly NoteOption[]; value: string | null; detected?: string | null;
  onChange: (id: string | null) => void; className?: string;
}
export function NoteSelector({ label = 'Target note', notes, value, detected, onChange, className = '' }: NoteSelectorProps) {
  return <div className={`audio-notes ${className}`} role="group" aria-label={label}>
    {notes.map(note => <button type="button" key={note.id} aria-label={`${note.detail ? note.detail + ', ' : ''}${note.name}${note.octave}`}
      aria-pressed={note.id === value} data-detected={note.id === detected || undefined}
      onClick={() => onChange(value === note.id ? null : note.id)}>
      {note.detail ? <span className="audio-notes__detail">{note.detail}</span> : null}
      <span className="audio-notes__name">{note.name}<sub>{note.octave}</sub></span>
      <span className="audio-notes__mark" aria-hidden="true" />
    </button>)}
  </div>;
}
