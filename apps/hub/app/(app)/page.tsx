import Link from 'next/link';
import { Badge, Card, CardTitle } from '@unipal/ui';
import { DemoNotice } from '@/components/demo-notice';
import { PageHeader } from '@/components/page-header';
import { getPipeline, getTasks } from '@/lib/data';
import { formatAed, formatDate, statusLabels } from '@/lib/labels';
import { modules } from '@/lib/modules';
import { currentCompany, requireUser } from '@/lib/session';

export default async function DashboardPage() {
  const user = await requireUser();
  const company = await currentCompany();
  const [pipeline, tasks] = await Promise.all([getPipeline(), getTasks()]);
  const open = tasks.filter((t) => t.status !== 'done');
  const upcoming = open.filter((t) => t.due_on).sort((a, b) => a.due_on!.localeCompare(b.due_on!)).slice(0, 6);
  const won = pipeline.stages.find((s) => s.stage === 'won');

  const stats = [
    { label: 'عملاء محتملون مفتوحون', value: pipeline.open_leads.toLocaleString('en-US'), href: '/crm' },
    { label: 'التوقع المرجّح', value: formatAed(pipeline.weighted_forecast), href: '/crm' },
    { label: 'متابعات مستحقة', value: pipeline.follow_ups_due.toLocaleString('en-US'), href: '/crm?follow_up_due=1' },
    { label: 'مهام مفتوحة', value: open.length.toLocaleString('en-US'), note: `${won?.leads ?? 0} صفقات مكسوبة`, href: '/projects' },
  ];

  return (
    <>
      <PageHeader title={`أهلاً ${user.name}`} description={`ملخص ${company?.name_ar ?? 'المجموعة'} اليوم.`} />
      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-lg border border-border bg-surface-raised p-5 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-sm text-foreground-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-bold" dir="ltr">
              {s.value}
            </p>
            {s.note && <p className="mt-1 text-xs text-foreground-muted">{s.note}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between p-5 pb-3">
            <CardTitle>المواعيد القادمة</CardTitle>
            <Link href="/projects" className="text-sm font-semibold text-accent-text hover:underline">
              كل المهام
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="px-5 pb-6 text-sm text-foreground-muted">لا مهام بمواعيد قادمة.</p>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t.title}</p>
                    <p className="text-xs text-foreground-muted">
                      {t.project?.name} · {t.assignee?.name ?? 'بلا مسؤول'}
                    </p>
                  </div>
                  <Badge tone={t.priority === 'high' ? 'danger' : 'neutral'}>{statusLabels[t.status]}</Badge>
                  <span className="w-20 shrink-0 text-end text-sm text-foreground-muted">{formatDate(t.due_on)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>أقسام النظام</CardTitle>
          <p className="mt-1 text-sm text-foreground-muted">تُفعَّل الأقسام تباعاً مع وحدات الخادم.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {modules.map((m) => (
              <li key={m.slug}>
                <Link href={m.ready ? `/${m.slug}` : `/m/${m.slug}`} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-surface">
                  {m.title}
                  {m.ready ? <Badge tone="success">جاهز</Badge> : <span className="text-[11px] text-foreground-muted">قريباً</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
