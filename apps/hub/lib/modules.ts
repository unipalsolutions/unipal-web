// Every module of the company system. Each one maps to a Laravel module in unipal-api;
// `ready` modules have screens in this phase, the rest show their plan until they ship.
export interface HubModule {
  slug: string;
  title: string;
  description: string;
  group: 'work' | 'people' | 'business' | 'system';
  ready?: boolean;
  plan?: string[];
}

export const modules: HubModule[] = [
  { slug: 'projects', title: 'المشاريع', description: 'لوحات المهام، المراحل، والمسؤوليات.', group: 'work', ready: true },
  {
    slug: 'follow-ups',
    title: 'المتابعات',
    description: 'متابعة الأعمال والمواعيد النهائية لكل ملف.',
    group: 'work',
    plan: ['تذكيرات مرتبطة بالعميل أو المشروع', 'متابعة المواعيد الضريبية تلقائياً', 'تقويم موحّد للفريق'],
  },
  {
    slug: 'files',
    title: 'الملفات',
    description: 'مستندات العملاء والشركة بصلاحيات دقيقة.',
    group: 'work',
    plan: ['مجلدات لكل عميل ومشروع', 'رفع آمن على التخزين السحابي مع نسخ', 'روابط مشاركة مؤقتة'],
  },
  {
    slug: 'archive',
    title: 'الأرشيف',
    description: 'حفظ المستندات المنتهية مع سجل كامل.',
    group: 'work',
    plan: ['أرشفة تلقائية حسب سياسة الاحتفاظ', 'بحث في النصوص', 'سجل من اطّلع ومن عدّل'],
  },
  {
    slug: 'crm',
    title: 'العملاء',
    description: 'العملاء المحتملون، الصفقات، ومصادرها.',
    group: 'business',
    plan: ['استيراد ورقة العملاء المحتملين الحالية', 'مراحل الصفقة كما في Tax CRM', 'نماذج المواقع تصل هنا مباشرة'],
  },
  {
    slug: 'services',
    title: 'الخدمات والاشتراكات',
    description: 'الخدمات المدفوعة والمجانية وباقات الاشتراك.',
    group: 'business',
    plan: ['كتالوج خدمات لكل شركة', 'اشتراكات شهرية وسنوية بالدرهم', 'فواتير وتجديد تلقائي'],
  },
  {
    slug: 'partnerships',
    title: 'الشراكات',
    description: 'الشركاء، الاتفاقيات، والعمولات.',
    group: 'business',
    plan: ['ملف لكل شريك واتفاقيته', 'إحالات وعمولات', 'تواريخ تجديد الاتفاقيات'],
  },
  {
    slug: 'employees',
    title: 'الموظفون',
    description: 'ملفات الموظفين، الأقسام، والإجازات.',
    group: 'people',
    plan: ['ملف موظف ووثائقه وتواريخ انتهائها', 'الهيكل التنظيمي لكل شركة', 'طلبات الإجازة والموافقات'],
  },
  {
    slug: 'payroll',
    title: 'الرواتب',
    description: 'مسيّرات الرواتب والبدلات والخصومات.',
    group: 'people',
    plan: ['مسيّر شهري لكل شركة', 'ملف WPS للبنك', 'قسائم رواتب للموظفين'],
  },
  {
    slug: 'settings',
    title: 'الإعدادات',
    description: 'المستخدمون، الأدوار، والصلاحيات.',
    group: 'system',
    plan: ['أدوار وصلاحيات لكل شركة', 'المصادقة الثنائية', 'سجل التدقيق'],
  },
];

export const moduleGroups: Record<HubModule['group'], string> = {
  work: 'العمل',
  business: 'الأعمال',
  people: 'الموارد البشرية',
  system: 'النظام',
};

export const findModule = (slug: string) => modules.find((m) => m.slug === slug);
