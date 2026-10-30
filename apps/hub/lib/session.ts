import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { brandIds, defaultBrand, type BrandId } from '@unipal/brand';

export const SESSION_COOKIE = 'unipal_hub_session';
export const COMPANY_COOKIE = 'unipal_hub_company';

export interface HubUser {
  name: string;
  email: string;
}

/**
 * The API (Laravel Sanctum) owns authentication. The hub keeps the API token in an httpOnly cookie
 * and reads the user from it. Before the API exists, local development signs in a demo user.
 */
export const demoLoginEnabled = () => !process.env.UNIPAL_API_URL && process.env.NODE_ENV !== 'production';

export async function currentUser(): Promise<HubUser | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const session = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as { user?: HubUser };
    return session.user ?? null;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<HubUser> {
  const user = await currentUser();
  if (!user) redirect('/login');
  return user;
}

/** The company whose data the hub shows; it also sets the accent color of the dashboard. */
export async function currentCompany(): Promise<BrandId> {
  const value = (await cookies()).get(COMPANY_COOKIE)?.value;
  return value && (brandIds as string[]).includes(value) ? (value as BrandId) : defaultBrand;
}
