import Link from 'next/link';
import { brands } from '@unipal/brand';
import { Badge, Card, CardTitle } from '@unipal/ui';
import { PageHeader } from '@/components/page-header';
import { stats, statuses, tasks } from '@/lib/demo';
import { modules } from '@/lib/modules';
import { requireUser } from '@/lib/session';

const formatDate = (iso: string) => new Intl.DateTimeFormat('ar-AE', { day: 'numeric', month: 'long' }).format(new Date(iso));

export default async function DashboardPage() {
  const user = await requireUser();
  const upcoming = tasks.filter((t) => t.due && t.status !== 'done').sort((a, b) => a.due!.localeCompare(b.due!)).slice(0, 5);
  const statusTitle = Object.fromEntries(statuses.map((s) => [s.id, s.title]));

  return (
    <>
      <PageHeader title={`أهلاً ${user.name}`} description="ملخص أعمال المجموعة اليوم." />
      <p className="-mt-5 mb-6 text-xs text-foreground-muted">بيانات تجريبية حتى يُربط الخادم.</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-foreground-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-foreground-muted">{s.note}</p>
          </Card>
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
          <ul className="divide-y divide-border">
            {upcoming.map((t) => (
              <li key={t.id} className="flex items-center gap-4 px-5 py-3">
                <span data-brand={t.company} className="size-2.5 shrink-0 rounded-full bg-accent" title={brands[t.company].nameAr} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.title}</p>
                  <p className="text-xs text-foreground-muted">
                    {t.project} · {t.assignee}
                  </p>
                </div>
                <Badge tone={t.priority === 'high' ? 'danger' : 'neutral'}>{statusTitle[t.status]}</Badge>
                <span className="w-20 shrink-0 text-end text-sm text-foreground-muted">{formatDate(t.due!)}</span>
              </li>
            ))}
          </ul>
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
