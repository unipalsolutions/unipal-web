// Mirrors the API Resources in unipal-api (modules/*/Http/Resources). Keep both sides in step.

export type CompanySlug = 'group' | 'advisors' | 'tax' | 'solutions';
export type CompanyRole = 'owner' | 'admin' | 'manager' | 'member';
export type Ability = 'crm.view' | 'crm.manage' | 'projects.view' | 'projects.manage' | 'members.manage';

/** Laravel resource collections wrap lists in `data`; paginated ones add `meta`. */
export interface Collection<T> {
  data: T[];
}

export interface Paginated<T> extends Collection<T> {
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Company {
  id: string;
  slug: CompanySlug;
  name: string;
  name_ar: string;
  domain: string;
  is_parent: boolean;
  role?: CompanyRole;
  abilities?: Ability[];
}

export interface Me {
  user: User;
  companies: Company[];
}

export interface TokenResponse {
  token: string;
  user: User;
}

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'meeting_scheduled'
  | 'meeting_held'
  | 'proposal_sent'
  | 'negotiation'
  | 'verbal_commit'
  | 'won'
  | 'lost'
  | 'paused';

export type LeadSource = 'referral' | 'website' | 'linkedin' | 'cold_call' | 'event' | 'existing_client' | 'partner' | 'other';
export type ActivityType = 'call' | 'email' | 'meeting' | 'proposal' | 'follow_up' | 'note';
export type LostReason = 'price' | 'no_response' | 'competitor' | 'not_a_fit' | 'timing' | 'cancelled' | 'other';

export interface LeadActivity {
  id: string;
  type: ActivityType;
  outcome: string | null;
  notes: string | null;
  duration_minutes: number | null;
  next_follow_up_on: string | null;
  occurred_at: string;
  user?: User;
}

export interface Lead {
  id: string;
  reference: string;
  stage: LeadStage;
  source: LeadSource;
  owner?: User | null;
  organization_name: string | null;
  contact_name: string;
  email: string | null;
  phone: string | null;
  phone_alt: string | null;
  industry: string | null;
  services: string[];
  client_type: string | null;
  proposal_value: string | null;
  probability: number;
  weighted_value: string | null;
  currency: 'AED';
  expected_close_on: string | null;
  last_contact_at: string | null;
  days_since_last_contact: number | null;
  next_action: string | null;
  next_follow_up_on: string | null;
  lost_reason: LostReason | null;
  message: string | null;
  notes: string | null;
  stage_changed_at: string;
  days_in_stage: number;
  won_at: string | null;
  created_at: string;
  activities?: LeadActivity[];
}

export interface Pipeline {
  currency: 'AED';
  stages: { stage: LeadStage; leads: number; value: number; weighted_value: number }[];
  open_leads: number;
  weighted_forecast: number;
  follow_ups_due: number;
}

export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';
export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  owner?: User | null;
  starts_on: string | null;
  due_on: string | null;
  open_tasks?: number;
  created_at: string;
}

export interface Task {
  id: string;
  project?: { id: string; name: string };
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User | null;
  due_on: string | null;
  position: number;
  completed_at: string | null;
}
