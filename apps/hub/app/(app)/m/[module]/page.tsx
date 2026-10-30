import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge, Card } from '@unipal/ui';
import { PageHeader } from '@/components/page-header';
import { findModule, modules } from '@/lib/modules';

type Props = { params: Promise<{ module: string }> };

export function generateStaticParams() {
  return modules.filter((m) => !m.ready).map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: findModule((await params).module)?.title };
}

export default async function ModulePage({ params }: Props) {
  const mod = findModule((await params).module);
  if (!mod || mod.ready) notFound();
  return (
    <>
      <PageHeader title={mod.title} description={mod.description} actions={<Badge tone="neutral">قيد البناء</Badge>} />
      <Card className="max-w-2xl">
        <p className="font-semibold">ما سيأتي في هذا القسم</p>
        <ul className="mt-3 grid gap-2">
          {mod.plan?.map((item) => (
            <li key={item} className="flex items-start gap-3 text-foreground-muted">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
