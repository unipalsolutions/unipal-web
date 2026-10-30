'use client';

import { useActionState } from 'react';
import { Button, Input, Label } from '@unipal/ui';
import { login, type LoginState } from '@/lib/actions';

export function LoginForm({ demo }: { demo: boolean }) {
  const [state, action, pending] = useActionState(login, {} as LoginState);
  return (
    <form action={action} className="mt-8 grid gap-4">
      <Label>
        البريد الإلكتروني
        <Input name="email" type="email" dir="ltr" autoComplete="username" defaultValue={state.email} required />
      </Label>
      <Label>
        كلمة المرور
        <Input name="password" type="password" dir="ltr" autoComplete="current-password" required />
      </Label>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? 'جارٍ الدخول…' : 'دخول'}
      </Button>
      {demo && <p className="text-xs text-foreground-muted">وضع التطوير: أي بريد وكلمة مرور يعملان حتى يُربط الخادم.</p>}
    </form>
  );
}
