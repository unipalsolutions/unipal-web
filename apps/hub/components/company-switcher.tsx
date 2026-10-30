'use client';

import { useRef } from 'react';
import { brands, type BrandId } from '@unipal/brand';
import { switchCompany } from '@/lib/actions';

export function CompanySwitcher({ value }: { value: BrandId }) {
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
        {Object.values(brands).map((b) => (
          <option key={b.id} value={b.id}>
            {b.nameAr}
          </option>
        ))}
      </select>
    </form>
  );
}
