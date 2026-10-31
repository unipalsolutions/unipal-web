import type { ActivityType, LeadSource, LeadStage, LostReason, TaskPriority, TaskStatus } from '@unipal/api-client';

// Arabic labels for the API's enum values, in the order the UI lists them.

export const stageLabels: Record<LeadStage, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  meeting_scheduled: 'اجتماع مجدول',
  meeting_held: 'تم الاجتماع',
  proposal_sent: 'عرض مُرسل',
  negotiation: 'تفاوض',
  verbal_commit: 'موافقة مبدئية',
  won: 'تم الكسب',
  lost: 'خسارة',
  paused: 'متوقف',
};

export const sourceLabels: Record<LeadSource, string> = {
  referral: 'إحالة',
  website: 'الموقع',
  linkedin: 'LinkedIn',
  cold_call: 'اتصال مباشر',
  event: 'فعالية',
  existing_client: 'عميل حالي',
  partner: 'شريك',
  other: 'أخرى',
};

export const activityLabels: Record<ActivityType, string> = {
  call: 'مكالمة',
  email: 'بريد',
  meeting: 'اجتماع',
  proposal: 'عرض سعر',
  follow_up: 'متابعة',
  note: 'ملاحظة',
};

export const outcomeLabels: Record<string, string> = {
  positive: 'إيجابي',
  neutral: 'محايد',
  negative: 'سلبي',
  no_response: 'لا رد',
  won: 'كسب',
  lost: 'خسارة',
};

export const lostReasonLabels: Record<LostReason, string> = {
  price: 'السعر',
  no_response: 'لا رد',
  competitor: 'منافس',
  not_a_fit: 'غير مناسب',
  timing: 'التوقيت',
  cancelled: 'أُلغي',
  other: 'أخرى',
};

export const statusLabels: Record<TaskStatus, string> = {
  backlog: 'الأفكار',
  todo: 'للتنفيذ',
  doing: 'قيد العمل',
  review: 'مراجعة',
  done: 'مكتمل',
};

export const priorityLabels: Record<TaskPriority, string> = { high: 'عاجل', normal: 'عادي', low: 'منخفض' };

export const formatDate = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat('ar-AE', { day: 'numeric', month: 'long' }).format(new Date(iso)) : '—';

export const formatAed = (value: number | string | null | undefined) =>
  value === null || value === undefined ? '—' : `AED ${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
