'use client';

import { useMemo, useState, type DragEvent } from 'react';
import { brands, type BrandId } from '@unipal/brand';
import { Badge, cn } from '@unipal/ui';
import type { Task, TaskStatus } from '@/lib/demo';

const priorityLabel = { high: 'عاجل', normal: 'عادي', low: 'منخفض' } as const;

export function Board({ statuses, initialTasks }: { statuses: { id: TaskStatus; title: string }[]; initialTasks: Task[] }) {
  const [items, setItems] = useState(initialTasks);
  const [company, setCompany] = useState<BrandId | 'all'>('all');
  const [over, setOver] = useState<TaskStatus | null>(null);

  const visible = useMemo(() => items.filter((t) => company === 'all' || t.company === company), [items, company]);

  const move = (id: string, status: TaskStatus) => setItems((all) => all.map((t) => (t.id === id ? { ...t, status } : t)));

  const onDrop = (status: TaskStatus) => (e: DragEvent) => {
    e.preventDefault();
    setOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) move(id, status);
  };

  return (
    <>
      <div role="group" aria-label="تصفية حسب الشركة" className="mb-5 flex flex-wrap gap-2">
        {(['all', ...Object.keys(brands)] as const).map((id) => (
          <button
            key={id}
            type="button"
            data-brand={id === 'all' ? undefined : id}
            aria-pressed={company === id}
            onClick={() => setCompany(id as BrandId | 'all')}
            className={cn(
              'flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-surface',
              company === id && 'border-foreground bg-surface font-semibold',
            )}
          >
            {id !== 'all' && <span className="size-2 rounded-full bg-accent" />}
            {id === 'all' ? 'كل الشركات' : brands[id as BrandId].nameAr}
          </button>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((col) => {
          const cards = visible.filter((t) => t.status === col.id);
          return (
            <section
              key={col.id}
              aria-label={col.title}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.id);
              }}
              onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
              onDrop={onDrop(col.id)}
              className={cn('flex w-72 shrink-0 flex-col rounded-lg bg-surface p-3', over === col.id && 'outline-2 outline-dashed outline-accent')}
            >
              <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold">
                {col.title}
                <span className="text-foreground-muted">{cards.length}</span>
              </h2>
              <div className="grid gap-2">
                {cards.map((t) => (
                  <article
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                    data-brand={t.company}
                    className="relative cursor-grab rounded-md border border-border border-s-4 border-s-accent bg-surface-raised p-3 shadow-sm active:cursor-grabbing"
                  >
                    <p className="text-sm font-medium leading-snug">{t.title}</p>
                    <p className="mt-1 text-xs text-foreground-muted">{t.project}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Badge tone={t.priority === 'high' ? 'danger' : t.priority === 'low' ? 'neutral' : 'accent'}>{priorityLabel[t.priority]}</Badge>
                      <span className="text-xs text-foreground-muted">{t.assignee}</span>
                    </div>
                    {/* Keyboard and touch users move cards with this menu instead of dragging. */}
                    <label className="sr-only" htmlFor={`status-${t.id}`}>
                      نقل إلى
                    </label>
                    <select
                      id={`status-${t.id}`}
                      value={t.status}
                      onChange={(e) => move(t.id, e.target.value as TaskStatus)}
                      className="mt-3 h-8 w-full rounded border border-border bg-background px-2 text-xs md:sr-only md:focus:not-sr-only"
                    >
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
