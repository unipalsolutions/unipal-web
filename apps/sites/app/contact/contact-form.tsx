'use client';

import { useActionState } from 'react';
import { Button, FieldError, Input, Label, Textarea } from '@unipal/ui';
import { submitContact, type ContactState } from './actions';

const initial: ContactState = { status: 'idle' };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === 'sent') {
    return (
      <div role="status" className="rounded-lg border border-border bg-accent-subtle p-8">
        <p className="text-lg font-semibold text-accent-text">وصلتنا رسالتك</p>
        <p className="mt-2 text-foreground-muted">سيتواصل معك أحد أعضاء الفريق خلال يوم عمل.</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Label>
          الاسم
          <Input name="name" autoComplete="name" defaultValue={v.name} aria-invalid={!!e.name} required />
          <FieldError>{e.name}</FieldError>
        </Label>
        <Label>
          البريد الإلكتروني
          <Input name="email" type="email" dir="ltr" autoComplete="email" defaultValue={v.email} aria-invalid={!!e.email} required />
          <FieldError>{e.email}</FieldError>
        </Label>
      </div>
      <Label>
        الهاتف (اختياري)
        <Input name="phone" type="tel" dir="ltr" autoComplete="tel" defaultValue={v.phone} aria-invalid={!!e.phone} />
        <FieldError>{e.phone}</FieldError>
      </Label>
      <Label>
        كيف نساعدك؟
        <Textarea name="message" defaultValue={v.message} aria-invalid={!!e.message} required />
        <FieldError>{e.message}</FieldError>
      </Label>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.message && (
        <p role="alert" className="text-sm font-medium text-danger">
          {state.message}
        </p>
      )}
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'جارٍ الإرسال…' : 'إرسال'}
        </Button>
      </div>
    </form>
  );
}
