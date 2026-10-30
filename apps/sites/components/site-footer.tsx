import { headers } from 'next/headers';
import { brands, type Brand } from '@unipal/brand';
import { Container, Mark } from '@unipal/ui';
import { siteUrl } from '@/lib/brand';

export async function SiteFooter({ brand }: { brand: Brand }) {
  const host = (await headers()).get('host');
  const family = Object.values(brands).filter((b) => b.id !== brand.id);
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.4fr_1fr]">
        <div className="flex items-start gap-4">
          <Mark className="size-12 text-foreground" />
          <div>
            <p className="font-semibold">{brand.nameAr}</p>
            <p className="mt-1 max-w-md text-sm text-foreground-muted">
              {brand.id === 'group' ? 'المظلة التي تجمع شركات UniPal المتخصصة.' : 'جزء من مجموعة UniPal Group.'}
            </p>
          </div>
        </div>
        <nav aria-label="شركات المجموعة" className="grid gap-2 text-sm">
          <p className="font-semibold text-foreground-muted">شركات المجموعة</p>
          {family.map((b) => (
            <a key={b.id} href={siteUrl(b, host)} className="hover:text-accent-text" data-brand={b.id}>
              <span className="me-2 inline-block size-2 rounded-full bg-accent align-middle" />
              {b.nameAr}
            </a>
          ))}
        </nav>
      </Container>
      <Container className="border-t border-border py-5 text-xs text-foreground-muted">
        © {new Date().getFullYear()} UniPal Group · <span dir="ltr">{brand.domain}</span>
      </Container>
    </footer>
  );
}
