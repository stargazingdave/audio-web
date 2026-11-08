import { useId, type SelectHTMLAttributes, type ReactNode } from 'react';

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> { label: string; hint?: ReactNode; }
export function SelectField({ label, hint, id, className = '', ...props }: SelectFieldProps) {
  const generated = useId();
  const controlId = id || generated;
  return <div className={`noised-field ${className}`}>
    <label htmlFor={controlId}>{label}</label>
    <select {...props} id={controlId} aria-describedby={hint ? controlId + '-hint' : undefined} />
    {hint ? <span id={controlId + '-hint'}>{hint}</span> : null}
  </div>;
}
