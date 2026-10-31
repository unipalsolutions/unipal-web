'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError, type ApiClient, type Lead, type TaskStatus } from '@unipal/api-client';
import { apiConfigured, currentBrandId, fromApi } from './session';

// Writes go to the API only. In demo mode (no UNIPAL_API_URL) they explain that instead of pretending to save.

export interface FormState {
  error?: string;
  errors?: Record<string, string[]>;
  ok?: boolean;
}

const DEMO: FormState = { error: 'وضع التجربة: الحفظ يعمل بعد ربط الخادم.' };

async function write(call: (api: ApiClient, base: string) => Promise<unknown>, revalidate: string): Promise<FormState> {
  if (!apiConfigured()) return DEMO;
  const base = `/companies/${await currentBrandId()}`;
  try {
    await fromApi((api) => call(api, base));
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) return { error: 'تحقق من الحقول.', errors: error.errors };
    if (error instanceof ApiError && error.status === 403) return { error: 'ليست لديك صلاحية لهذا الإجراء.' };
    // redirect() from fromApi throws a special error that must keep propagating.
    if (!(error instanceof ApiError)) throw error;
    return { error: 'تعذّر الحفظ. حاول مرة أخرى.' };
  }
  revalidatePath(revalidate);
  return { ok: true };
}

const field = (form: FormData, name: string) => {
  const value = String(form.get(name) ?? '').trim();
  return value === '' ? undefined : value;
};

export async function moveTask(id: string, status: TaskStatus, position: number): Promise<FormState> {
  return write((api, base) => api.patch(`${base}/tasks/${encodeURIComponent(id)}`, { status, position }), '/projects');
}

export async function createTask(_prev: FormState, form: FormData): Promise<FormState> {
  const project = field(form, 'project_id') ?? '';
  return write(
    (api, base) =>
      api.post(`${base}/projects/${encodeURIComponent(project)}/tasks`, {
        title: field(form, 'title'),
        priority: field(form, 'priority'),
        due_on: field(form, 'due_on'),
        status: field(form, 'status'),
      }),
    '/projects',
  );
}

export async function createProject(_prev: FormState, form: FormData): Promise<FormState> {
  return write((api, base) => api.post(`${base}/projects`, { name: field(form, 'name'), due_on: field(form, 'due_on') }), '/projects');
}

export async function createLead(_prev: FormState, form: FormData): Promise<FormState> {
  if (!apiConfigured()) return DEMO;
  let created: Lead | undefined;
  const state = await write(async (api, base) => {
    created = (
      await api.post<{ data: Lead }>(`${base}/leads`, {
        contact_name: field(form, 'contact_name'),
        organization_name: field(form, 'organization_name'),
        email: field(form, 'email'),
        phone: field(form, 'phone'),
        source: field(form, 'source'),
        proposal_value: field(form, 'proposal_value'),
        next_follow_up_on: field(form, 'next_follow_up_on'),
        notes: field(form, 'notes'),
      })
    ).data;
  }, '/crm');
  if (created) redirect(`/crm/${created.id}`);
  return state;
}

export async function updateLead(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  return write(
    (api, base) =>
      api.patch(`${base}/leads/${encodeURIComponent(id)}`, {
        stage: field(form, 'stage'),
        lost_reason: field(form, 'lost_reason'),
        proposal_value: field(form, 'proposal_value'),
        next_action: field(form, 'next_action') ?? null,
        next_follow_up_on: field(form, 'next_follow_up_on') ?? null,
      }),
    `/crm/${id}`,
  );
}

export async function addActivity(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  return write(
    (api, base) =>
      api.post(`${base}/leads/${encodeURIComponent(id)}/activities`, {
        type: field(form, 'type'),
        outcome: field(form, 'outcome'),
        notes: field(form, 'notes'),
        next_follow_up_on: field(form, 'next_follow_up_on'),
      }),
    `/crm/${id}`,
  );
}
