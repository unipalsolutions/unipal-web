import { cn } from './cn';

// Same geometry as unipal-brand/scripts/logos.mjs: a U made of two halves.
// The left half (UniPal) uses the foreground color; the right half (the partner) uses the brand accent.
const LEFT = 'M17 8V33A15 15 0 0 0 32 48';
const RIGHT = 'M32 48A15 15 0 0 0 47 33V8';

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-10 shrink-0', className)} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={LEFT} fill="none" stroke="currentColor" strokeWidth="12" />
      <path d={RIGHT} fill="none" stroke="var(--up-accent)" strokeWidth="12" />
    </svg>
  );
}

/** Arabic lockup: mark, then "يونيبال" with the company name in the accent text color. */
export function Logo({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-foreground', className)}>
      <Mark className="size-10" />
      <span className="flex flex-col leading-none">
        <span className="text-[22px] font-bold">يونيبال</span>
        <span className="mt-1 text-[13px] font-medium text-accent-text">{label}</span>
      </span>
    </span>
  );
}
