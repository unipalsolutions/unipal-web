import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { brands, type BrandId } from '@unipal/brand';
import { ApiError, createApiClient, type ApiClient, type Company, type Me } from '@unipal/api-client';

export const SESSION_COOKIE = 'unipal_hub_session';
export const COMPANY_COOKIE = 'unipal_hub_company';

export interface HubUser {
  name: string;
  email: string;
}

interface Session {
  user: HubUser;
  /** Sanctum token from POST /v1/auth/token. Absent only for the local demo sign-in. */
  token?: string;
}

/**
 * The API (Laravel Sanctum) owns authentication. The hub keeps the API token in an httpOnly cookie;
 * the cookie's user is for display only, and all data comes from the API with the token.
 * Without UNIPAL_API_URL, local development signs in a demo user and shows sample data.
 */
export const apiConfigured = () => !!process.env.UNIPAL_API_URL;
export const demoLoginEnabled = () => !apiConfigured() && process.env.NODE_ENV !== 'production';

async function readSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const session = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as Session;
    return session.user ? session : null;
  } catch {
    return null;
  }
}

export const encodeSession = (session: Session) => Buffer.from(JSON.stringify(session)).toString('base64url');

export async function currentUser(): Promise<HubUser | null> {
  return (await readSession())?.user ?? null;
}

export async function requireUser(): Promise<HubUser> {
  const user = await currentUser();
  if (!user) redirect('/login');
  return user;
}

/** API client authenticated as the signed-in user, or null in demo mode. */
export async function hubApi(): Promise<ApiClient | null> {
  if (!apiConfigured()) return null;
  const session = await readSession();
  if (!session?.token) redirect('/logout');
  return createApiClient({ baseUrl: process.env.UNIPAL_API_URL!, token: session.token });
}

/** Runs an API call; an expired or revoked token sends the user back to sign in. */
export async function fromApi<T>(call: (api: ApiClient) => Promise<T>): Promise<T> {
  const api = await hubApi();
  if (!api) throw new Error('fromApi() needs UNIPAL_API_URL; check apiConfigured() first.');
  try {
    return await call(api);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/logout');
    throw error;
  }
}

/** Companies the user can open, with their role. In demo mode, all four as owner. */
export const accessibleCompanies = cache(async (): Promise<Company[]> => {
  if (!apiConfigured()) {
    return Object.values(brands).map((b) => ({
      id: b.id,
      slug: b.id,
      name: b.name,
      name_ar: b.nameAr,
      domain: b.domain,
      is_parent: b.id === 'group',
      role: 'owner',
      abilities: ['crm.view', 'crm.manage', 'projects.view', 'projects.manage', 'members.manage'],
    }));
  }
  if (!(await readSession())) return [];
  return (await fromApi((api) => api.get<Me>('/me'))).companies;
});

/** The company whose data the hub shows; it also sets the accent color of the dashboard. */
export const currentCompany = cache(async (): Promise<Company | null> => {
  const companies = await accessibleCompanies();
  const chosen = (await cookies()).get(COMPANY_COOKIE)?.value;
  return companies.find((c) => c.slug === chosen) ?? companies[0] ?? null;
});

export async function currentBrandId(): Promise<BrandId> {
  return (await currentCompany())?.slug ?? 'group';
}

export async function can(ability: NonNullable<Company['abilities']>[number]): Promise<boolean> {
  return !!(await currentCompany())?.abilities?.includes(ability);
}
