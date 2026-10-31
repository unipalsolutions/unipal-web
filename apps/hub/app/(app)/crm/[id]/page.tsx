import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Card, CardTitle } from '@unipal/ui';
import { DemoNotice } from '@/components/demo-notice';
import { PageHeader } from '@/components/page-header';
import { getLead } from '@/lib/data';
import { activityLabels, formatAed, formatDate, lostReasonLabels, outcomeLabels, sourceLabels, stageLabels } from '@/lib/labels';
import { can } from '@/lib/session';
import { ActivityForm, StageForm } from './forms';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: (await getLead((await params).id))?.contact_name ?? 'عميل' };
}

export default async function LeadPage({ params }: Props) {
  const lead = await getLead((await params).id);
  if (!lead) notFound();
  const canManage = await can('crm.manage');

  const facts: [string, ReactNode][] = [
    ['الشركة', lead.organization_name ?? '—'],
    ['الهاتف', lead.phone ? <span dir="ltr">{lead.phone}</span> : '—'],
    ['البريد', lead.email ? <span dir="ltr">{lead.email}</span> : '—'],
    ['المصدر', sourceLabels[lead.source]],
    ['الخدمات', lead.services.length ? lead.services.join('، ') : '—'],
    ['قيمة العرض', <span dir="ltr">{formatAed(lead.proposal_value)}</span>],
    ['الاحتمال', `${lead.probability}%`],
    ['القيمة المرجّحة', <span dir="ltr">{formatAed(lead.weighted_value)}</span>],
    ['آخر تواصل', lead.days_since_last_contact === null ? '—' : lead.days_since_last_contact === 0 ? 'اليوم' : `قبل ${lead.days_since_last_contact} يوم`],
    ['في المرحلة منذ', lead.days_in_stage === 0 ? 'اليوم' : `${lead.days_in_stage} يوم`],
    ['المسؤول', lead.owner?.name ?? '—'],
  ];

  return (
    <>
      <Link href="/crm" className="mb-4 inline-block text-sm text-foreground-muted hover:text-foreground">
        → العملاء
      </Link>
      <PageHeader
        title={lead.contact_name}
        description={lead.reference}
        actions={<Badge tone={lead.stage === 'won' ? 'success' : lead.stage === 'lost' ? 'danger' : 'accent'}>{stageLabels[lead.stage]}</Badge>}
      />
      <DemoNotice />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="grid content-start gap-6">
          <Card>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-foreground-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              {lead.lost_reason && (
                <>
                  <dt className="text-foreground-muted">سبب الخسارة</dt>
                  <dd>{lostReasonLabels[lead.lost_reason]}</dd>
                </>
              )}
            </dl>
            {lead.message && (
              <div className="mt-5 rounded-md bg-surface p-3 text-sm">
                <p className="mb-1 text-xs font-semibold text-foreground-muted">رسالة من الموقع</p>
                {lead.message}
              </div>
            )}
            {lead.notes && <p className="mt-4 text-sm whitespace-pre-line text-foreground-muted">{lead.notes}</p>}
          </Card>
          {canManage && <StageForm lead={lead} />}
        </div>

        <Card>
          <CardTitle>سجل التواصل</CardTitle>
          {canManage && <ActivityForm leadId={lead.id} />}
          <ol className="mt-5 grid gap-4">
            {(lead.activities ?? []).length === 0 && <li className="text-sm text-foreground-muted">لا يوجد تواصل مسجّل بعد.</li>}
            {(lead.activities ?? []).map((a) => (
              <li key={a.id} className="border-s-2 border-accent ps-4">
                <p className="text-sm font-semibold">
                  {activityLabels[a.type]}
                  {a.outcome && <span className="ms-2 font-normal text-foreground-muted">· {outcomeLabels[a.outcome] ?? a.outcome}</span>}
                </p>
                <p className="text-xs text-foreground-muted">
                  {formatDate(a.occurred_at)} · {a.user?.name}
                  {a.next_follow_up_on && ` · المتابعة ${formatDate(a.next_follow_up_on)}`}
                </p>
                {a.notes && <p className="mt-1 text-sm whitespace-pre-line">{a.notes}</p>}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
