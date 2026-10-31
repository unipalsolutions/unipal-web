import { isLive } from '@/lib/data';

export function DemoNotice() {
  if (isLive()) return null;
  return <p className="-mt-5 mb-6 text-xs text-foreground-muted">بيانات تجريبية: اضبط UNIPAL_API_URL لعرض بيانات الخادم.</p>;
}
