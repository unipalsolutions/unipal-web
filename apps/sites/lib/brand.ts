import { headers } from 'next/headers';
import { brands, brandIds, defaultBrand, type Brand, type BrandId } from '@unipal/brand';

const isBrandId = (value: string | undefined): value is BrandId => !!value && (brandIds as string[]).includes(value);

/**
 * Maps a request host to a brand. The first DNS label decides:
 * tax.unipal.group, staging-tax.unipal.group and tax.localhost:3000 all map to "tax";
 * the apex domain, www, staging and anything unknown map to the group.
 */
export function resolveBrand(host: string | null | undefined): Brand {
  const label = String(host ?? '').toLowerCase().split(':')[0]?.split('.')[0]?.replace(/^staging-/, '');
  return brands[isBrandId(label) ? label : defaultBrand];
}

export async function currentBrand(): Promise<Brand> {
  const h = await headers();
  return resolveBrand(h.get('x-forwarded-host') ?? h.get('host'));
}

/** Public URL of another brand's site, keeping the current environment (production, staging or local). */
export function siteUrl(target: Brand, currentHost: string | null | undefined): string {
  const host = String(currentHost ?? '').toLowerCase();
  if (host.includes('localhost')) {
    const port = host.split(':')[1] ?? '3000';
    return target.id === defaultBrand ? `http://localhost:${port}` : `http://${target.id}.localhost:${port}`;
  }
  const staging = host.startsWith('staging');
  if (target.id === defaultBrand) return staging ? 'https://staging.unipal.group' : 'https://unipal.group';
  return `https://${staging ? `staging-${target.id}` : target.id}.unipal.group`;
}
