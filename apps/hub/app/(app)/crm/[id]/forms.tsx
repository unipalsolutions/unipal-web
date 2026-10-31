'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import type { Lead } from '@unipal/api-client';
import { Button, Card, CardTitle, Input, Label, Textarea } from '@unipal/ui';
import { addActivity, updateLead, type FormState } from '@/lib/mutations';
import { activityLabels, lostReasonLabels, outcomeLabels, stageLabels } from '@/lib/labels';

const select = 'h-11 w-full rounded-md border border-border-strong bg-background px-3 text-[15px]';

const Status = ({ state }: { state: FormState }) =>
  state.error ? <p className="text-sm text-danger">{state.error}</p> : state.ok ? <p className="text-sm text-success">تم الحفظ.</p> : null;

export function StageForm({ lead }: { lead: Lead }) {
  const [state, action, pending] = useActionState(updateLead.bind(null, lead.id), {} as FormState);
  const [stage, setStage] = useState(lead.stage);
  return (
    <Card>
      <CardTitle>تحديث الصفقة</CardTitle>
      <form action={action} className="mt-4 grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Label>
            المرحلة
            <select name="stage" className={select} value={stage} onChange={(e) => setStage(e.target.value as Lead['stage'])}>
              {Object.entries(stageLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Label>
          {(stage === 'lost' || stage === 'paused') && (
            <Label>
              السبب
              <select name="lost_reason" className={select} defaultValue={lead.lost_reason ?? ''} required>
                <option value="" disabled>
                  اختر
                </option>
                {Object.entries(lostReasonLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Label>
          )}
          <Label>
            قيمة العرض (AED)
            <Input name="proposal_value" type="number" min="0" dir="ltr" defaultValue={lead.proposal_value ?? ''} />
          </Label>
          <Label>
            المتابعة القادمة
            <Input name="next_follow_up_on" type="date" defaultValue={lead.next_follow_up_on ?? ''} />
          </Label>
        </div>
        <Label>
          الخطوة التالية
          <Input name="next_action" defaultValue={lead.next_action ?? ''} />
        </Label>
        <Status state={state} />
        <Button type="submit" variant="primary" disabled={pending}>
          حفظ
        </Button>
      </form>
    </Card>
  );
}

export function ActivityForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addActivity.bind(null, leadId), {} as FormState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="mt-4 grid gap-3 rounded-md bg-surface p-4">
      <div className="grid grid-cols-3 gap-3">
        <Label>
          النوع
          <select name="type" className={select} defaultValue="call">
            {Object.entries(activityLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Label>
        <Label>
          النتيجة
          <select name="outcome" className={select} defaultValue="">
            <option value="">—</option>
            {Object.entries(outcomeLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Label>
        <Label>
          المتابعة
          <Input name="next_follow_up_on" type="date" />
        </Label>
      </div>
      <Label>
        ملاحظات
        <Textarea name="notes" className="min-h-20" />
      </Label>
      <Status state={state} />
      <Button type="submit" disabled={pending}>
        تسجيل
      </Button>
    </form>
  );
}
