'use client';

import { useActionState } from 'react';
import { Button, FieldError, Input, Label, Textarea } from '@unipal/ui';
import { createLead, type FormState } from '@/lib/mutations';
import { sourceLabels } from '@/lib/labels';

const select = 'h-11 w-full rounded-md border border-border-strong bg-background px-3 text-[15px]';

export function NewLeadForm() {
  const [state, action, pending] = useActionState(createLead, {} as FormState);
  const e = state.errors ?? {};
  return (
    <details className="relative">
      <summary className="inline-flex h-11 cursor-pointer list-none items-center rounded-md bg-accent px-5 text-[15px] font-semibold text-accent-foreground hover:bg-accent-strong">
        + عميل محتمل
      </summary>
      <div className="absolute end-0 top-13 z-10 w-[min(92vw,460px)] rounded-lg border border-border bg-surface-raised p-5 shadow-lg">
        <form action={action} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Label>
              اسم جهة الاتصال
              <Input name="contact_name" required />
              <FieldError>{e.contact_name?.[0]}</FieldError>
            </Label>
            <Label>
              الشركة
              <Input name="organization_name" />
            </Label>
            <Label>
              الهاتف
              <Input name="phone" type="tel" dir="ltr" />
            </Label>
            <Label>
              البريد
              <Input name="email" type="email" dir="ltr" />
              <FieldError>{e.email?.[0]}</FieldError>
            </Label>
            <Label>
              المصدر
              <select name="source" className={select} defaultValue="referral">
                {Object.entries(sourceLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Label>
            <Label>
              قيمة العرض (AED)
              <Input name="proposal_value" type="number" min="0" dir="ltr" />
            </Label>
          </div>
          <Label>
            المتابعة القادمة
            <Input name="next_follow_up_on" type="date" />
          </Label>
          <Label>
            ملاحظات
            <Textarea name="notes" className="min-h-20" />
          </Label>
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          <Button type="submit" disabled={pending}>
            حفظ
          </Button>
        </form>
      </div>
    </details>
  );
}
