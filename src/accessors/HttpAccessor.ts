export class HttpAccessor {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
    const data = await this.request<T>('GET', path, undefined, headers);
    if (data === null) {
      throw new Error(`GET ${path} returned an empty body`);
    }
    return data;
  }

  async getOrNull<T>(path: string, headers: Record<string, string> = {}): Promise<T | null> {
    return this.request<T>('GET', path, undefined, headers);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    headers: Record<string, string> = {},
  ): Promise<T | null> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`${method} ${path} failed with status ${res.status}`);
    }
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  }
}
