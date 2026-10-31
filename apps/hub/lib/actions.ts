'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError, createApiClient, type TokenResponse } from '@unipal/api-client';
import { COMPANY_COOKIE, SESSION_COOKIE, accessibleCompanies, demoLoginEnabled, encodeSession, hubApi } from './session';

export interface LoginState {
  error?: string;
  email?: string;
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 12,
};

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return { error: 'اكتب البريد وكلمة المرور.', email };

  let session: { user: { name: string; email: string }; token?: string };
  const baseUrl = process.env.UNIPAL_API_URL;
  if (baseUrl) {
    try {
      const { token, user } = await createApiClient({ baseUrl }).post<TokenResponse>('/auth/token', { email, password, device_name: 'hub' });
      session = { user: { name: user.name, email: user.email }, token };
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) return { error: 'البريد أو كلمة المرور غير صحيحة.', email };
      if (error instanceof ApiError && error.status === 429) return { error: 'محاولات كثيرة. انتظر دقيقة ثم حاول.', email };
      return { error: 'تعذّر الاتصال بالخادم. حاول بعد قليل.', email };
    }
  } else if (demoLoginEnabled()) {
    session = { user: { name: email.split('@')[0] ?? 'مستخدم', email } };
  } else {
    return { error: 'تسجيل الدخول غير متاح: الخادم غير مُعدّ.', email };
  }

  (await cookies()).set(SESSION_COOKIE, encodeSession(session), cookieOptions);
  redirect('/');
}

export async function logout() {
  // Revoke the token on the API too; signing out still works if the API is unreachable.
  await (await hubApi().catch(() => null))?.post('/auth/logout').catch(() => undefined);
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}

export async function switchCompany(form: FormData) {
  const slug = String(form.get('company'));
  if ((await accessibleCompanies()).some((c) => c.slug === slug)) {
    (await cookies()).set(COMPANY_COOKIE, slug, { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
  }
}
