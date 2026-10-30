import type { Metadata } from 'next';
import { Container } from '@unipal/ui';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { currentBrand } from '@/lib/brand';
import { content } from '@/lib/content';
import { ContactForm } from './contact-form';

export const metadata: Metadata = { title: 'تواصل معنا' };

export default async function ContactPage() {
  const brand = await currentBrand();
  const page = content[brand.id];
  return (
    <>
      <SiteHeader brand={brand} cta={page.primaryCta} />
      <main>
        <Container className="grid gap-12 py-16 md:grid-cols-[1fr_1.4fr] md:py-24">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">تواصل معنا</h1>
            <p className="mt-4 max-w-[40ch] text-foreground-muted">
              أخبرنا عن عملك وما تحتاجه، وسيرد عليك فريق {brand.nameAr} خلال يوم عمل.
            </p>
          </div>
          <ContactForm />
        </Container>
      </main>
      <SiteFooter brand={brand} />
    </>
  );
}
