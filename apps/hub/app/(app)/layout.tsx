import type { ReactNode } from 'react';
import Link from 'next/link';
import { brands } from '@unipal/brand';
import { Logo } from '@unipal/ui';
import { CompanySwitcher } from '@/components/company-switcher';
import { SidebarNav, type NavSection } from '@/components/sidebar-nav';
import { logout } from '@/lib/actions';
import { moduleGroups, modules } from '@/lib/modules';
import { currentCompany, requireUser } from '@/lib/session';

const moduleHref = (slug: string, ready?: boolean) => (ready ? `/${slug}` : `/m/${slug}`);

const sections: NavSection[] = [
  { items: [{ href: '/', label: 'الرئيسية' }] },
  ...(Object.keys(moduleGroups) as (keyof typeof moduleGroups)[]).map((group) => ({
    title: moduleGroups[group],
    items: modules.filter((m) => m.group === group).map((m) => ({ href: moduleHref(m.slug, m.ready), label: m.title, soon: !m.ready })),
  })),
  { items: [{ href: '/apps', label: 'تطبيقات الجوال وسطح المكتب' }] },
];

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const company = await currentCompany();
  return (
    <div className="grid min-h-dvh md:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="border-border bg-surface-raised max-md:border-b md:sticky md:top-0 md:h-dvh md:overflow-y-auto md:border-e">
        <div className="flex h-16 items-center px-5">
          <Link href="/" aria-label="الرئيسية">
            <Logo label={brands[company].labelAr} />
          </Link>
        </div>
        <div className="px-3 pb-6 max-md:hidden">
          <SidebarNav sections={sections} />
        </div>
        <details className="px-3 pb-3 md:hidden">
          <summary className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold hover:bg-surface">القائمة</summary>
          <div className="pt-2">
            <SidebarNav sections={sections} />
          </div>
        </details>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-5 backdrop-blur md:px-8">
          <CompanySwitcher value={company} />
          <div className="flex items-center gap-3 text-sm">
            <span className="grid size-8 place-items-center rounded-full bg-accent text-accent-foreground font-semibold" aria-hidden>
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-sm:hidden">{user.name}</span>
            <form action={logout}>
              <button type="submit" className="text-foreground-muted hover:text-foreground">
                خروج
              </button>
            </form>
          </div>
        </header>
        <main className="px-5 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
