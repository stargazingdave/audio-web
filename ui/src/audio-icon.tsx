export type AudioIconName = 'microphone' | 'stop' | 'play' | 'check' | 'arrow' | 'settings' | 'headphones';
export interface AudioIconProps { name: AudioIconName; size?: number; className?: string; }
const paths: Record<AudioIconName, string> = {
  microphone: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8',
  stop: 'M6 6h12v12H6Z',
  play: 'M8 5v14l11-7Z',
  check: 'm5 12 4 4L19 6',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  settings: 'M4 7h16M4 17h16M8 4v6m8 4v6',
  headphones: 'M4 14v-2a8 8 0 0 1 16 0v2M4 12h3v8H4Zm13 0h3v8h-3Z',
};
export function AudioIcon({ name, size = 20, className }: AudioIconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}><path d={paths[name]} /></svg>;
}
