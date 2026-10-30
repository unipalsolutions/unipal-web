// Thin client for the UniPal Laravel API (api.unipal.group/v1).
// Typed endpoints will be generated from the API's OpenAPI document once it exists;
// until then, call sites use `request` with their own types.

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  /** Bearer token for mobile/desktop or server-to-server calls. The hub uses Sanctum cookies instead. */
  token?: string;
  fetch?: typeof fetch;
}

export function createApiClient({ baseUrl, token, fetch: fetcher = fetch }: ApiClientOptions) {
  const root = baseUrl.replace(/\/+$/, '');

  async function request<T>(method: string, path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (body !== undefined) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const response = await fetcher(`${root}/v1${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (response.status === 204) return undefined as T;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Laravel validation errors: { message, errors: { field: [..] } }
      throw new ApiError(response.status, data.message ?? response.statusText, data.errors ?? {});
    }
    return data as T;
  }

  return {
    request,
    get: <T>(path: string, init?: RequestInit) => request<T>('GET', path, undefined, init),
    post: <T>(path: string, body?: unknown, init?: RequestInit) => request<T>('POST', path, body, init),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
