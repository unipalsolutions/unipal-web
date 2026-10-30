import Link from 'next/link';
import type { Brand } from '@unipal/brand';
import { Container, Logo, buttonClasses } from '@unipal/ui';

const nav = [
  { href: '/#services', label: 'خدماتنا' },
  { href: '/#why', label: 'لماذا نحن' },
  { href: '/#about', label: 'من نحن' },
];

export function SiteHeader({ brand, cta }: { brand: Brand; cta: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label={brand.nameAr}>
          <Logo label={brand.labelAr} />
        </Link>
        <nav aria-label="القائمة الرئيسية" className="hidden items-center gap-8 text-[15px] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-foreground hover:text-accent-text">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className={buttonClasses({ size: 'sm' })}>
          {cta}
        </Link>
      </Container>
    </header>
  );
}
