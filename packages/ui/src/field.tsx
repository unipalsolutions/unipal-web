import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

const control =
  'w-full rounded-md border border-border-strong bg-background px-3 py-2.5 text-[15px] text-foreground placeholder:text-foreground-muted/70 focus:outline-2 focus:outline-offset-1 focus:outline-focus-ring aria-invalid:border-danger';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('grid gap-1.5 text-sm font-medium', className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, 'h-11', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, 'min-h-32', className)} {...props} />;
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <span className="text-xs font-medium text-danger">{children}</span>;
}
