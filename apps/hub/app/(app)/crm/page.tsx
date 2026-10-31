import type { Metadata } from 'next';
import Link from 'next/link';
import type { LeadStage } from '@unipal/api-client';
import { Badge, Card, Input, buttonClasses } from '@unipal/ui';
import { DemoNotice } from '@/components/demo-notice';
import { PageHeader } from '@/components/page-header';
import { getLeads, getPipeline } from '@/lib/data';
import { formatAed, formatDate, sourceLabels, stageLabels } from '@/lib/labels';
import { can } from '@/lib/session';
import { NewLeadForm } from './new-lead-form';

export const metadata: Metadata = { title: 'العملاء' };

type Props = { searchParams: Promise<{ stage?: string; search?: string; follow_up_due?: string }> };

const today = () => new Date().toISOString().slice(0, 10);

export default async function CrmPage({ searchParams }: Props) {
  const params = await searchParams;
  const stage = params.stage && params.stage in stageLabels ? (params.stage as LeadStage) : undefined;
  const [pipeline, leads, canManage] = await Promise.all([getPipeline(), getLeads({ stage, search: params.search, follow_up_due: params.follow_up_due === '1' ? '1' : undefined }), can('crm.manage')]);

  return (
    <>
      <PageHeader title="العملاء" description="العملاء المحتملون ومراحل الصفقة، كما في ورقة المتابعة." actions={canManage ? <NewLeadForm /> : undefined} />
      <DemoNotice />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-foreground-muted">مفتوحة</p>
          <p className="mt-1 text-2xl font-bold">{pipeline.open_leads}</p>
        </Card>
        <Card>
          <p className="text-sm text-foreground-muted">التوقع المرجّح</p>
          <p className="mt-1 text-2xl font-bold" dir="ltr">
            {formatAed(pipeline.weighted_forecast)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-foreground-muted">متابعات مستحقة اليوم</p>
          <p className="mt-1 text-2xl font-bold">{pipeline.follow_ups_due}</p>
        </Card>
      </div>

      <nav aria-label="المراحل" className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <Link href="/crm" className={buttonClasses({ variant: stage ? 'ghost' : 'outline', size: 'sm' })}>
          الكل
        </Link>
        {pipeline.stages.map((s) => (
          <Link key={s.stage} href={`/crm?stage=${s.stage}`} className={buttonClasses({ variant: stage === s.stage ? 'outline' : 'ghost', size: 'sm' })}>
            {stageLabels[s.stage]}
            <span className="text-foreground-muted">{s.leads}</span>
          </Link>
        ))}
      </nav>

      <form className="mb-4 max-w-sm">
        {stage && <input type="hidden" name="stage" value={stage} />}
        <label className="sr-only" htmlFor="search">
          بحث
        </label>
        <Input id="search" name="search" type="search" placeholder="بحث بالاسم أو الشركة أو الهاتف" defaultValue={params.search} />
      </form>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border text-start text-foreground-muted">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-start [&>th]:font-medium">
              <th>المرجع</th>
              <th>العميل</th>
              <th>المرحلة</th>
              <th>المصدر</th>
              <th>القيمة</th>
              <th>المتابعة القادمة</th>
              <th>المسؤول</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-foreground-muted">
                  لا يوجد عملاء محتملون هنا بعد.
                </td>
              </tr>
            )}
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-surface [&>td]:px-4 [&>td]:py-3">
                <td dir="ltr" className="text-end font-mono text-xs">
                  <Link href={`/crm/${l.id}`} className="text-accent-text hover:underline">
                    {l.reference}
                  </Link>
                </td>
                <td>
                  <Link href={`/crm/${l.id}`} className="font-medium hover:underline">
                    {l.contact_name}
                  </Link>
                  {l.organization_name && <p className="text-xs text-foreground-muted">{l.organization_name}</p>}
                </td>
                <td>
                  <Badge tone={l.stage === 'won' ? 'success' : l.stage === 'lost' ? 'danger' : 'accent'}>{stageLabels[l.stage]}</Badge>
                </td>
                <td className="text-foreground-muted">{sourceLabels[l.source]}</td>
                <td dir="ltr" className="text-end">
                  {formatAed(l.proposal_value)}
                </td>
                <td className={l.next_follow_up_on && l.next_follow_up_on <= today() ? 'font-semibold text-danger' : ''}>{formatDate(l.next_follow_up_on)}</td>
                <td className="text-foreground-muted">{l.owner?.name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
