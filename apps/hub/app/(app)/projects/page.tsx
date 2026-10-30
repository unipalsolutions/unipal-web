import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { statuses, tasks } from '@/lib/demo';
import { Board } from './board';

export const metadata: Metadata = { title: 'المشاريع' };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="المشاريع" description="اسحب المهمة بين الأعمدة لتغيير حالتها. بيانات تجريبية حتى يُربط الخادم." />
      <Board statuses={statuses} initialTasks={tasks} />
    </>
  );
}
