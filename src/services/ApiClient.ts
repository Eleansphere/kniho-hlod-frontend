import { authorizationStore } from '@/stores/authorization-store'

export class ApiClient {
  private getHeaders(): HeadersInit {
    const token = authorizationStore().getToken()
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  protected async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`)
    return response.json()
  }

  protected async post<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`)
    return response.json()
  }

  protected async put<T>(url: string, body: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`PUT ${url} failed: ${response.status}`)
    return response.json()
  }

  protected async delete(url: string): Promise<void> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (!response.ok) throw new Error(`DELETE ${url} failed: ${response.status}`)
  }
}
