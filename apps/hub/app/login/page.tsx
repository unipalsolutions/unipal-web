import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Mark } from '@unipal/ui';
import { currentUser, demoLoginEnabled } from '@/lib/session';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'تسجيل الدخول' };

export default async function LoginPage() {
  if (await currentUser()) redirect('/');
  return (
    <main className="grid min-h-dvh md:grid-cols-[1fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Mark className="size-12 text-foreground" />
          <h1 className="mt-6 text-2xl font-bold">لوحة يونيبال</h1>
          <p className="mt-2 text-foreground-muted">سجّل الدخول بحساب الشركة.</p>
          <LoginForm demo={demoLoginEnabled()} />
        </div>
      </section>
      <section aria-hidden className="relative hidden overflow-hidden bg-primary text-primary-foreground md:block">
        <Mark className="absolute -bottom-20 -left-20 size-[560px] text-primary-foreground/15" />
        <div className="relative p-14">
          <p className="max-w-[18ch] text-4xl leading-tight font-bold">كل أعمال المجموعة في مكان واحد</p>
          <p className="mt-4 max-w-[36ch] text-primary-foreground/75">المشاريع، العملاء، الموظفون، والملفات للشركات الأربع.</p>
        </div>
      </section>
    </main>
  );
}
