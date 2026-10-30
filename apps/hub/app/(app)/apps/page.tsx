import type { Metadata } from 'next';
import { Badge, Card, CardTitle } from '@unipal/ui';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = { title: 'التطبيقات' };

// Internal builds of unipal-apps. Links come from the release workflow once the first build is published.
const platforms = [
  { name: 'Android', detail: 'ملف APK موقّع للأجهزة الداخلية', href: process.env.NEXT_PUBLIC_DOWNLOAD_ANDROID },
  { name: 'iPhone', detail: 'عبر TestFlight بدعوة من الإدارة', href: process.env.NEXT_PUBLIC_DOWNLOAD_IOS },
  { name: 'Windows', detail: 'مثبّت MSIX لنظام Windows 10 فأحدث', href: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS },
  { name: 'macOS', detail: 'ملف DMG موقّع لأجهزة Apple Silicon وIntel', href: process.env.NEXT_PUBLIC_DOWNLOAD_MACOS },
];

export default function AppsPage() {
  return (
    <>
      <PageHeader title="تطبيقات الجوال وسطح المكتب" description="تطبيقات داخلية لموظفي المجموعة، تستخدم نفس حسابك في اللوحة." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {platforms.map((p) => (
          <Card key={p.name} className="flex flex-col">
            <CardTitle>{p.name}</CardTitle>
            <p className="mt-1 flex-1 text-sm text-foreground-muted">{p.detail}</p>
            <div className="mt-5">
              {p.href ? (
                <a href={p.href} className="text-sm font-semibold text-accent-text hover:underline">
                  تنزيل
                </a>
              ) : (
                <Badge tone="neutral">قريباً</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
