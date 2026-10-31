'use client';

import { useEffect, useState, useTransition, type DragEvent } from 'react';
import type { Task, TaskStatus } from '@unipal/api-client';
import { Badge, cn } from '@unipal/ui';
import { moveTask } from '@/lib/mutations';
import { priorityLabels, statusLabels } from '@/lib/labels';

const columns = Object.keys(statusLabels) as TaskStatus[];

export function Board({ initialTasks, canManage }: { initialTasks: Task[]; canManage: boolean }) {
  const [items, setItems] = useState(initialTasks);
  const [over, setOver] = useState<TaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // A save elsewhere on the page (new task, another tab's move) re-renders with fresh server data.
  useEffect(() => setItems(initialTasks), [initialTasks]);

  // Optimistic: the card moves at once and goes back if the API refuses.
  const move = (id: string, status: TaskStatus) => {
    const before = items;
    const position = items.filter((t) => t.status === status).length;
    setItems((all) => all.map((t) => (t.id === id ? { ...t, status, position } : t)));
    startTransition(async () => {
      const result = await moveTask(id, status, position);
      if (result.error && !result.error.startsWith('وضع التجربة')) {
        setItems(before);
        setError(result.error);
      }
    });
  };

  const onDrop = (status: TaskStatus) => (e: DragEvent) => {
    e.preventDefault();
    setOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) move(id, status);
  };

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 text-sm font-medium text-danger">
          {error}
        </p>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const cards = items.filter((t) => t.status === col);
          return (
            <section
              key={col}
              aria-label={statusLabels[col]}
              onDragOver={(e) => {
                if (!canManage) return;
                e.preventDefault();
                setOver(col);
              }}
              onDragLeave={() => setOver((o) => (o === col ? null : o))}
              onDrop={onDrop(col)}
              className={cn('flex w-72 shrink-0 flex-col rounded-lg bg-surface p-3', over === col && 'outline-2 outline-dashed outline-accent')}
            >
              <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold">
                {statusLabels[col]}
                <span className="text-foreground-muted">{cards.length}</span>
              </h2>
              <div className="grid gap-2">
                {cards.map((t) => (
                  <article
                    key={t.id}
                    draggable={canManage}
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                    className={cn('relative rounded-md border border-border border-s-4 border-s-accent bg-surface-raised p-3 shadow-sm', canManage && 'cursor-grab active:cursor-grabbing')}
                  >
                    <p className="text-sm font-medium leading-snug">{t.title}</p>
                    <p className="mt-1 text-xs text-foreground-muted">{t.project?.name}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Badge tone={t.priority === 'high' ? 'danger' : t.priority === 'low' ? 'neutral' : 'accent'}>{priorityLabels[t.priority]}</Badge>
                      <span className="text-xs text-foreground-muted">{t.assignee?.name}</span>
                    </div>
                    {canManage && (
                      <>
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
                          {columns.map((s) => (
                            <option key={s} value={s}>
                              {statusLabels[s]}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
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
