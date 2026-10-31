import type { Metadata } from 'next';
import { DemoNotice } from '@/components/demo-notice';
import { PageHeader } from '@/components/page-header';
import { getProjects, getTasks } from '@/lib/data';
import { can } from '@/lib/session';
import { Board } from './board';
import { NewProjectForm, NewTaskForm } from './forms';

export const metadata: Metadata = { title: 'المشاريع' };

export default async function ProjectsPage() {
  const [projects, tasks, canManage] = await Promise.all([getProjects(), getTasks(), can('projects.manage')]);
  return (
    <>
      <PageHeader title="المشاريع" description="اسحب المهمة بين الأعمدة لتغيير حالتها." />
      <DemoNotice />
      {canManage && (
        <div className="mb-6 flex flex-wrap gap-3">
          <NewTaskForm projects={projects} />
          <NewProjectForm />
        </div>
      )}
      <Board initialTasks={tasks} canManage={canManage} />
    </>
  );
}
