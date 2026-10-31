'use client';

import { useRef } from 'react';
import type { Company } from '@unipal/api-client';
import { switchCompany } from '@/lib/actions';

export function CompanySwitcher({ value, companies }: { value: string; companies: Company[] }) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={switchCompany}>
      <label className="sr-only" htmlFor="company">
        الشركة
      </label>
      <select
        id="company"
        name="company"
        defaultValue={value}
        onChange={() => form.current?.requestSubmit()}
        className="h-9 rounded-md border border-border-strong bg-background px-2 text-sm"
      >
        {companies.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name_ar}
          </option>
        ))}
      </select>
    </form>
  );
}
