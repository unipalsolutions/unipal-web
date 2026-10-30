import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { currentBrand } from '@/lib/brand';
import { content } from '@/lib/content';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const brand = await currentBrand();
  const page = content[brand.id];
  return {
    title: { default: `${brand.nameAr} | ${brand.name}`, template: `%s | ${brand.nameAr}` },
    description: page.lead,
    metadataBase: new URL(`https://${brand.domain}`),
    icons: { icon: `/brand/symbol-${brand.id}.svg` },
    robots: process.env.NEXT_PUBLIC_SITE_ENV === 'production' ? undefined : { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const brand = await currentBrand();
  return (
    <html lang="ar" dir="rtl" data-brand={brand.id}>
      <body>{children}</body>
    </html>
  );
}
