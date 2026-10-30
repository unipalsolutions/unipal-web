'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { brandIds } from '@unipal/brand';
import { ApiError, createApiClient } from '@unipal/api-client';
import { COMPANY_COOKIE, SESSION_COOKIE, demoLoginEnabled } from './session';

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
      session = await createApiClient({ baseUrl }).post('/auth/token', { email, password, device_name: 'hub' });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 422)) {
        return { error: 'البريد أو كلمة المرور غير صحيحة.', email };
      }
      return { error: 'تعذّر الاتصال بالخادم. حاول بعد قليل.', email };
    }
  } else if (demoLoginEnabled()) {
    session = { user: { name: email.split('@')[0] ?? 'مستخدم', email } };
  } else {
    return { error: 'تسجيل الدخول غير متاح: الخادم غير مُعدّ.', email };
  }

  (await cookies()).set(SESSION_COOKIE, Buffer.from(JSON.stringify(session)).toString('base64url'), cookieOptions);
  redirect('/');
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}

export async function switchCompany(form: FormData) {
  const company = String(form.get('company'));
  if ((brandIds as string[]).includes(company)) {
    (await cookies()).set(COMPANY_COOKIE, company, { ...cookieOptions, maxAge: 60 * 60 * 24 * 365 });
  }
}
