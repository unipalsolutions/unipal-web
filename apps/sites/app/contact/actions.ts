'use server';

import { createApiClient, ApiError } from '@unipal/api-client';
import { currentBrand } from '@/lib/brand';

export interface ContactState {
  status: 'idle' | 'sent' | 'error';
  message?: string;
  errors?: Partial<Record<'name' | 'email' | 'phone' | 'message', string>>;
  values?: Record<string, string>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the form and sends it to the API as a CRM lead tagged with the brand it came from.
 * Until UNIPAL_API_URL is set (the API is not deployed yet) the lead is only logged on the server.
 */
export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const values = {
    name: String(form.get('name') ?? '').trim(),
    email: String(form.get('email') ?? '').trim(),
    phone: String(form.get('phone') ?? '').trim(),
    message: String(form.get('message') ?? '').trim(),
  };
  // Honeypot: real people leave it empty.
  if (form.get('company_website')) return { status: 'sent' };

  const errors: ContactState['errors'] = {};
  if (values.name.length < 2) errors.name = 'اكتب اسمك.';
  if (!EMAIL.test(values.email)) errors.email = 'اكتب بريداً إلكترونياً صحيحاً.';
  if (values.phone && !/^[+\d][\d\s-]{6,}$/.test(values.phone)) errors.phone = 'رقم الهاتف غير صحيح.';
  if (values.message.length < 10) errors.message = 'اكتب رسالة من 10 أحرف على الأقل.';
  if (Object.keys(errors).length) return { status: 'error', errors, values };

  const brand = await currentBrand();
  const lead = { ...values, brand: brand.id, source: 'website' };

  const baseUrl = process.env.UNIPAL_API_URL;
  if (!baseUrl) {
    console.info('[contact] UNIPAL_API_URL is not set; lead not sent', lead);
    return { status: 'sent' };
  }
  try {
    await createApiClient({ baseUrl }).post('/public/leads', lead);
    return { status: 'sent' };
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      return { status: 'error', message: 'تحقق من الحقول وحاول مرة أخرى.', values };
    }
    console.error('[contact] failed to send lead', error);
    return { status: 'error', message: 'تعذّر الإرسال الآن. حاول بعد قليل أو راسلنا مباشرة.', values };
  }
}
