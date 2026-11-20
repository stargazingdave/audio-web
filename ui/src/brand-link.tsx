export interface BrandLinkProps {
  href: string;
  label: string;
  logoSrc: string;
  logoWidth?: number;
  className?: string;
}
export function BrandLink({ href, label, logoSrc, logoWidth = 28, className = '' }: BrandLinkProps) {
  return <a className={`audio-brand-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">
    <img src={logoSrc} alt="" width={logoWidth} /><span>{label}</span>
  </a>;
}
