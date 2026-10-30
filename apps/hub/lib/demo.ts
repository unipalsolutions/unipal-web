import type { BrandId } from '@unipal/brand';

// Sample data so the screens can be reviewed before the API exists.
// Replace each export with an API call as its Laravel module lands; nothing else imports these shapes.

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;
  title: string;
  project: string;
  company: BrandId;
  assignee: string;
  due?: string;
  priority: Priority;
  status: TaskStatus;
}

export const statuses: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'الأفكار' },
  { id: 'todo', title: 'للتنفيذ' },
  { id: 'doing', title: 'قيد العمل' },
  { id: 'review', title: 'مراجعة' },
  { id: 'done', title: 'مكتمل' },
];

export const tasks: Task[] = [
  { id: 't1', title: 'تسجيل ضريبة الشركات لعميل الإمارات للتجارة', project: 'ملفات ضريبة الشركات', company: 'tax', assignee: 'سارة', due: '2026-11-04', priority: 'high', status: 'doing' },
  { id: 't2', title: 'إقرار القيمة المضافة للربع الثالث', project: 'إقرارات VAT', company: 'tax', assignee: 'محمد', due: '2026-11-28', priority: 'high', status: 'todo' },
  { id: 't3', title: 'دراسة جدوى مطعم في دبي مارينا', project: 'دراسات الجدوى', company: 'advisors', assignee: 'ليلى', due: '2026-11-12', priority: 'normal', status: 'review' },
  { id: 't4', title: 'نموذج بيانات وحدة العملاء', project: 'منصة UniPal', company: 'solutions', assignee: 'أحمد', priority: 'normal', status: 'doing' },
  { id: 't5', title: 'إطلاق المواقع الأربعة على staging', project: 'منصة UniPal', company: 'solutions', assignee: 'أحمد', due: '2026-11-03', priority: 'high', status: 'todo' },
  { id: 't6', title: 'هوية المجموعة البصرية', project: 'منصة UniPal', company: 'group', assignee: 'نور', priority: 'normal', status: 'done' },
  { id: 't7', title: 'عقد شراكة مع مكتب محاسبة في الشارقة', project: 'الشراكات', company: 'group', assignee: 'خالد', priority: 'low', status: 'backlog' },
  { id: 't8', title: 'تأسيس رخصة منطقة حرة لعميل جديد', project: 'تأسيس الشركات', company: 'advisors', assignee: 'ليلى', due: '2026-11-20', priority: 'normal', status: 'todo' },
  { id: 't9', title: 'استيراد ورقة العملاء المحتملين', project: 'منصة UniPal', company: 'solutions', assignee: 'نور', priority: 'normal', status: 'backlog' },
];

export const stats = [
  { label: 'مشاريع نشطة', value: '12', note: '+3 هذا الشهر' },
  { label: 'عملاء محتملون جدد', value: '27', note: 'من المواقع ونماذج التواصل' },
  { label: 'مواعيد ضريبية خلال 30 يوماً', value: '8', note: '2 خلال هذا الأسبوع' },
  { label: 'اشتراكات فعّالة', value: '41', note: 'AED 38,200 شهرياً' },
];
