import { injectable } from '@/shared/di';
import { isTauri } from '@/shared/isTauri';

import { tokenStore } from './tokenStore';
import { UnauthorizedError } from './UnauthorizedError';

@injectable()
export class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL;

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        ...headers,
        ...this.authHeaders(),
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    return this.handleResponse<T>(res);
  }

  get<T>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: formData,
      credentials: 'include',
    });

    return this.handleResponse<T>(res);
  }

  getAudioUrl(meetingId: string) {
    const url = `${this.baseUrl}/meetings/${meetingId}/audio`;

    const token = isTauri() ? tokenStore.accessToken : null;
    return token ? `${url}?token=${encodeURIComponent(token)}` : url;
  }

  private authHeaders(): Record<string, string> {
    const token = isTauri() ? tokenStore.accessToken : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    const text = await res.text();

    return (text ? JSON.parse(text) : undefined) as T;
  }
}
