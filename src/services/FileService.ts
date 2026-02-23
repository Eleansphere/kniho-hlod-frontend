import { API_ENDPOINTS } from '@/stores/api-end-points'
import { authorizationStore } from '@/stores/authorization-store'
import type { ProfileImageAtributes } from '@/types/entities'
import { ApiClient } from './ApiClient'

class FileService extends ApiClient {
  getAll(): Promise<ProfileImageAtributes[]> {
    return this.get<ProfileImageAtributes[]>(API_ENDPOINTS.files)
  }

  getAvatar(imageId: string): Promise<string> {
    return this.get<string>(`${API_ENDPOINTS.files}/${imageId}/avatar`)
  }

  async upload(formData: FormData): Promise<ProfileImageAtributes> {
    const token = authorizationStore().getToken()
    const response = await fetch(API_ENDPOINTS.files, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    })
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`)
    return response.json()
  }
}

export const fileService = new FileService()
