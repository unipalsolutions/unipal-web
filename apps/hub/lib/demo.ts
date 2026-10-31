import type { CompanySlug, Lead, Project, Task } from '@unipal/api-client';

// Sample data in the API's shapes, used only when UNIPAL_API_URL is not set (local development).
// lib/data.ts picks between this and the API; screens never import this file directly.

type Scoped<T> = T & { company: CompanySlug };

const user = (name: string) => ({ id: name, name, email: `${name}@unipal.group` });

export const demoProjects: Scoped<Project>[] = [
  { company: 'tax', id: 'p1', name: 'ملفات ضريبة الشركات', description: null, status: 'active', starts_on: null, due_on: null, created_at: '2026-10-01T00:00:00Z' },
  { company: 'tax', id: 'p2', name: 'إقرارات VAT', description: null, status: 'active', starts_on: null, due_on: null, created_at: '2026-10-01T00:00:00Z' },
  { company: 'advisors', id: 'p3', name: 'دراسات الجدوى', description: null, status: 'active', starts_on: null, due_on: null, created_at: '2026-10-01T00:00:00Z' },
  { company: 'solutions', id: 'p4', name: 'منصة UniPal', description: null, status: 'active', starts_on: null, due_on: null, created_at: '2026-10-01T00:00:00Z' },
  { company: 'group', id: 'p5', name: 'الشراكات', description: null, status: 'active', starts_on: null, due_on: null, created_at: '2026-10-01T00:00:00Z' },
];

const task = (company: CompanySlug, id: string, title: string, project: string, assignee: string, status: Task['status'], priority: Task['priority'], due_on: string | null = null): Scoped<Task> => ({
  company,
  id,
  title,
  project: { id: demoProjects.find((p) => p.name === project)!.id, name: project },
  assignee: user(assignee),
  description: null,
  status,
  priority,
  due_on,
  position: 0,
  completed_at: null,
});

export const demoTasks: Scoped<Task>[] = [
  task('tax', 't1', 'تسجيل ضريبة الشركات لعميل الإمارات للتجارة', 'ملفات ضريبة الشركات', 'سارة', 'doing', 'high', '2026-11-04'),
  task('tax', 't2', 'إقرار القيمة المضافة للربع الثالث', 'إقرارات VAT', 'محمد', 'todo', 'high', '2026-11-28'),
  task('advisors', 't3', 'دراسة جدوى مطعم في دبي مارينا', 'دراسات الجدوى', 'ليلى', 'review', 'normal', '2026-11-12'),
  task('solutions', 't4', 'نموذج بيانات وحدة العملاء', 'منصة UniPal', 'أحمد', 'done', 'normal'),
  task('solutions', 't5', 'إطلاق المواقع الأربعة على staging', 'منصة UniPal', 'أحمد', 'todo', 'high', '2026-11-03'),
  task('solutions', 't6', 'ربط لوحة التحكم بالخادم', 'منصة UniPal', 'نور', 'doing', 'normal', '2026-11-06'),
  task('group', 't7', 'عقد شراكة مع مكتب محاسبة في الشارقة', 'الشراكات', 'خالد', 'backlog', 'low'),
];

const lead = (company: CompanySlug, n: number, contact: string, org: string | null, stage: Lead['stage'], probability: number, value: number | null, source: Lead['source'], follow: string | null): Scoped<Lead> => ({
  company,
  id: `l${company}${n}`,
  reference: `${company.toUpperCase()}-${String(n).padStart(4, '0')}`,
  stage,
  source,
  owner: user('سارة'),
  organization_name: org,
  contact_name: contact,
  email: null,
  phone: '+971500000000',
  phone_alt: null,
  industry: null,
  services: company === 'tax' ? ['vat'] : [],
  client_type: 'new',
  proposal_value: value === null ? null : value.toFixed(2),
  probability,
  weighted_value: value === null ? null : ((value * probability) / 100).toFixed(2),
  currency: 'AED',
  expected_close_on: null,
  last_contact_at: '2026-10-28T09:00:00Z',
  days_since_last_contact: 3,
  next_action: null,
  next_follow_up_on: follow,
  lost_reason: null,
  message: null,
  notes: null,
  stage_changed_at: '2026-10-25T09:00:00Z',
  days_in_stage: 6,
  won_at: null,
  created_at: '2026-10-20T09:00:00Z',
});

export const demoLeads: Scoped<Lead>[] = [
  lead('tax', 1, 'عمر حسن', 'الإمارات للتجارة', 'proposal_sent', 50, 18000, 'referral', '2026-11-02'),
  lead('tax', 2, 'سارة علي', null, 'new', 10, null, 'website', '2026-10-31'),
  lead('tax', 3, 'Dominic Lewis', 'DLC Holdings', 'negotiation', 65, 42000, 'partner', '2026-11-05'),
  lead('advisors', 1, 'ليلى أحمد', 'مطاعم المارينا', 'meeting_held', 40, 25000, 'linkedin', '2026-11-03'),
  lead('solutions', 1, 'خالد يوسف', 'شركة الخليج', 'contacted', 20, 60000, 'event', null),
];
