import 'server-only';
import type { Collection, Lead, LeadStage, Paginated, Pipeline, Project, Task } from '@unipal/api-client';
import { demoLeads, demoProjects, demoTasks } from './demo';
import { apiConfigured, currentBrandId, fromApi } from './session';

// One place that reads hub data: from the API when it is configured, otherwise from the demo set.
// Every read is scoped to the company chosen in the header.

const companyPath = async (path: string) => `/companies/${await currentBrandId()}${path}`;
const demoFor = async <T extends { company: string }>(rows: T[]) => {
  const slug = await currentBrandId();
  return rows.filter((r) => slug === 'group' || r.company === slug);
};

export const isLive = apiConfigured;

export async function getProjects(): Promise<Project[]> {
  if (!isLive()) return demoFor(demoProjects);
  const path = await companyPath('/projects');
  return (await fromApi((api) => api.get<Collection<Project>>(path))).data;
}

export async function getTasks(query = ''): Promise<Task[]> {
  if (!isLive()) return demoFor(demoTasks);
  const path = await companyPath(`/tasks${query}`);
  return (await fromApi((api) => api.get<Collection<Task>>(path))).data;
}

export async function getLeads(filters: { stage?: LeadStage; search?: string; follow_up_due?: '1' } = {}): Promise<Lead[]> {
  if (!isLive()) {
    const today = new Date().toISOString().slice(0, 10);
    return (await demoFor(demoLeads)).filter(
      (l) =>
        (!filters.stage || l.stage === filters.stage) &&
        (!filters.search || `${l.contact_name} ${l.organization_name}`.includes(filters.search)) &&
        (!filters.follow_up_due || (!!l.next_follow_up_on && l.next_follow_up_on <= today)),
    );
  }
  const params = new URLSearchParams(Object.entries(filters).filter((e): e is [string, string] => !!e[1]));
  const path = await companyPath(`/leads?${params}`);
  return (await fromApi((api) => api.get<Paginated<Lead>>(path))).data;
}

export async function getLead(id: string): Promise<Lead | null> {
  if (!isLive()) return (await demoFor(demoLeads)).find((l) => l.id === id) ?? null;
  const path = await companyPath(`/leads/${encodeURIComponent(id)}`);
  try {
    return (await fromApi((api) => api.get<{ data: Lead }>(path))).data;
  } catch {
    return null;
  }
}

export async function getPipeline(): Promise<Pipeline> {
  if (!isLive()) {
    const leads = await demoFor(demoLeads);
    const stages = (['new', 'contacted', 'meeting_scheduled', 'meeting_held', 'proposal_sent', 'negotiation', 'verbal_commit', 'won', 'lost', 'paused'] as LeadStage[]).map((stage) => {
      const rows = leads.filter((l) => l.stage === stage);
      return {
        stage,
        leads: rows.length,
        value: rows.reduce((s, l) => s + Number(l.proposal_value ?? 0), 0),
        weighted_value: rows.reduce((s, l) => s + Number(l.weighted_value ?? 0), 0),
      };
    });
    const open = stages.filter((s) => s.stage !== 'won' && s.stage !== 'lost');
    return {
      currency: 'AED',
      stages,
      open_leads: open.reduce((s, x) => s + x.leads, 0),
      weighted_forecast: open.reduce((s, x) => s + x.weighted_value, 0),
      follow_ups_due: leads.filter((l) => l.next_follow_up_on && l.next_follow_up_on <= new Date().toISOString().slice(0, 10)).length,
    };
  }
  const path = await companyPath('/pipeline');
  return fromApi((api) => api.get<Pipeline>(path));
}
