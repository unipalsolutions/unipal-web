import type { HTMLAttributes } from 'react';
import { cn } from './cn';

export type BadgeTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

const tones: Record<BadgeTone, string> = {
  accent: 'bg-accent-subtle text-accent-text',
  neutral: 'bg-surface text-foreground-muted border border-border',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
};

export function Badge({ tone = 'accent', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)} {...props} />;
}
