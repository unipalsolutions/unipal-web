import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { currentBrandId } from '@/lib/session';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'لوحة يونيبال', template: '%s | لوحة يونيبال' },
  icons: { icon: '/brand/symbol-group.svg' },
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-brand={await currentBrandId()}>
      <body>{children}</body>
    </html>
  );
}
