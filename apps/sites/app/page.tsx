import Link from 'next/link';
import { headers } from 'next/headers';
import { brands } from '@unipal/brand';
import { Badge, Card, CardTitle, Container, Mark, buttonClasses } from '@unipal/ui';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { currentBrand, siteUrl } from '@/lib/brand';
import { content } from '@/lib/content';

export default async function HomePage() {
  const brand = await currentBrand();
  const host = (await headers()).get('host');
  const page = content[brand.id];
  const companies = Object.values(brands).filter((b) => b.id !== 'group');

  return (
    <>
      <SiteHeader brand={brand} cta={page.primaryCta} />
      <main>
        <section className="relative overflow-hidden">
          <Mark className="pointer-events-none absolute -bottom-24 -left-16 size-[420px] text-border opacity-80 max-md:opacity-40" />
          <Container className="relative py-20 md:py-28">
            <Badge className="mb-5">{page.eyebrow}</Badge>
            <h1 className="max-w-[14ch] text-4xl leading-tight font-bold md:text-[56px]">{page.title}</h1>
            <p className="mt-5 max-w-[48ch] text-lg text-foreground-muted">{page.lead}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/contact" className={buttonClasses({ size: 'lg' })}>
                {page.primaryCta}
              </Link>
              <Link href="#services" className={buttonClasses({ variant: 'outline', size: 'lg' })}>
                خدماتنا
              </Link>
              {brand.id !== 'group' && (
                <a href={siteUrl(brands.group, host)} className="text-sm text-foreground-muted hover:text-foreground">
                  جزء من مجموعة UniPal Group ←
                </a>
              )}
            </div>
          </Container>
        </section>

        {brand.id === 'group' && (
          <section aria-labelledby="companies" className="border-t border-border bg-surface py-16">
            <Container>
              <h2 id="companies" className="text-2xl font-bold">شركات المجموعة</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {companies.map((b) => (
                  <a key={b.id} href={siteUrl(b, host)} data-brand={b.id} className="group rounded-lg border border-border bg-surface-raised p-6 transition-shadow hover:shadow-md">
                    <Mark className="size-12 text-foreground" />
                    <p className="mt-4 text-lg font-semibold">{b.nameAr}</p>
                    <p className="mt-1 text-sm text-foreground-muted">{content[b.id].lead}</p>
                    <p className="mt-4 text-sm font-semibold text-accent-text">زيارة الموقع ←</p>
                  </a>
                ))}
              </div>
            </Container>
          </section>
        )}

        <section id="services" aria-labelledby="services-title" className="border-t border-border py-16 md:py-20">
          <Container>
            <h2 id="services-title" className="text-2xl font-bold md:text-3xl">خدماتنا</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.services.map((s) => (
                <Card key={s.title} className="flex flex-col gap-2">
                  <span className="h-1 w-10 rounded-full bg-accent" aria-hidden />
                  <CardTitle>{s.title}</CardTitle>
                  <p className="text-sm text-foreground-muted">{s.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section id="why" aria-labelledby="why-title" className="border-t border-border bg-surface py-16 md:py-20">
          <Container className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <h2 id="why-title" className="text-2xl font-bold md:text-3xl">لماذا {brand.nameAr}؟</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {page.why.map((w) => (
                <div key={w.title}>
                  <p className="font-semibold">{w.title}</p>
                  <p className="mt-2 text-sm text-foreground-muted">{w.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="about" aria-labelledby="about-title" className="border-t border-border py-16 md:py-20">
          <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="about-title" className="text-2xl font-bold">من نحن</h2>
              <p className="mt-3 max-w-[60ch] text-foreground-muted">{page.about}</p>
            </div>
            <Link href="/contact" className={buttonClasses({ variant: 'primary', size: 'lg' })}>
              {page.primaryCta}
            </Link>
          </Container>
        </section>
      </main>
      <SiteFooter brand={brand} />
    </>
  );
}
