'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@unipal/ui';

export interface NavSection {
  title?: string;
  items: { href: string; label: string; soon?: boolean }[];
}

export function SidebarNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  return (
    <nav aria-label="أقسام اللوحة" className="grid gap-6">
      {sections.map((section, i) => (
        <div key={section.title ?? i} className="grid gap-0.5">
          {section.title && <p className="px-3 pb-1 text-xs font-semibold text-foreground-muted">{section.title}</p>}
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-[15px] transition-colors hover:bg-surface',
                isActive(item.href) && 'bg-accent-subtle font-semibold text-accent-text hover:bg-accent-subtle',
              )}
            >
              {item.label}
              {item.soon && <span className="text-[11px] text-foreground-muted">قريباً</span>}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
