export interface SegmentOption<T extends string> { value: T; label: string; }
export interface SegmentedControlProps<T extends string> {
  label: string; value: T; options: readonly SegmentOption<T>[];
  onChange: (value: T) => void; disabled?: boolean; className?: string;
}
export function SegmentedControl<T extends string>({ label, value, options, onChange, disabled, className = '' }: SegmentedControlProps<T>) {
  return <div role="group" aria-label={label} className={`noised-segments ${className}`}>
    {options.map(option => <button type="button" key={option.value} aria-pressed={option.value === value}
      disabled={disabled} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}
