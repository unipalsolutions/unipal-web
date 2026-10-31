'use client';

import { useActionState, useEffect, useRef, type ReactNode } from 'react';
import type { Project } from '@unipal/api-client';
import { Button, FieldError, Input, Label } from '@unipal/ui';
import { createProject, createTask, type FormState } from '@/lib/mutations';
import { priorityLabels, statusLabels } from '@/lib/labels';

const select = 'h-11 w-full rounded-md border border-border-strong bg-background px-3 text-[15px]';

/** A small inline panel that opens from a button, closes again after a successful save. */
function Panel({ label, children, done }: { label: string; children: ReactNode; done?: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (done && ref.current) ref.current.open = false;
  }, [done]);
  return (
    <details ref={ref} className="group relative">
      <summary className="inline-flex h-9 cursor-pointer list-none items-center rounded-md border border-border-strong px-3 text-sm font-semibold hover:bg-surface">{label}</summary>
      <div className="absolute start-0 top-11 z-10 w-[min(92vw,420px)] rounded-lg border border-border bg-surface-raised p-5 shadow-lg">{children}</div>
    </details>
  );
}

export function NewTaskForm({ projects }: { projects: Project[] }) {
  const [state, action, pending] = useActionState(createTask, {} as FormState);
  return (
    <Panel label="+ مهمة جديدة" done={state.ok}>
      <form action={action} className="grid gap-3" key={state.ok ? 'reset' : 'form'}>
        <Label>
          العنوان
          <Input name="title" required />
          <FieldError>{state.errors?.title?.[0]}</FieldError>
        </Label>
        <Label>
          المشروع
          <select name="project_id" className={select} required>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Label>
            الحالة
            <select name="status" className={select} defaultValue="todo">
              {Object.entries(statusLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Label>
          <Label>
            الأولوية
            <select name="priority" className={select} defaultValue="normal">
              {Object.entries(priorityLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Label>
        </div>
        <Label>
          الموعد
          <Input name="due_on" type="date" />
        </Label>
        {state.error && <p className="text-sm text-danger">{state.error}</p>}
        <Button type="submit" disabled={pending || projects.length === 0}>
          {projects.length === 0 ? 'أنشئ مشروعاً أولاً' : 'إضافة'}
        </Button>
      </form>
    </Panel>
  );
}

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createProject, {} as FormState);
  return (
    <Panel label="+ مشروع جديد" done={state.ok}>
      <form action={action} className="grid gap-3" key={state.ok ? 'reset' : 'form'}>
        <Label>
          اسم المشروع
          <Input name="name" required />
          <FieldError>{state.errors?.name?.[0]}</FieldError>
        </Label>
        <Label>
          الموعد النهائي
          <Input name="due_on" type="date" />
        </Label>
        {state.error && <p className="text-sm text-danger">{state.error}</p>}
        <Button type="submit" disabled={pending}>
          إنشاء
        </Button>
      </form>
    </Panel>
  );
}
