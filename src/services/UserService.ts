import { API_ENDPOINTS } from '@/stores/api-end-points'
import type { UserAttributes } from '@/types/entities'
import { ApiClient } from './ApiClient'

class UserService extends ApiClient {
  getAll(): Promise<UserAttributes[]> {
    return this.get<UserAttributes[]>(API_ENDPOINTS.users)
  }

  getById(id: string): Promise<UserAttributes> {
    return this.get<UserAttributes>(`${API_ENDPOINTS.users}/${id}`)
  }

  create(data: Partial<UserAttributes>): Promise<UserAttributes> {
    return this.post<UserAttributes>(API_ENDPOINTS.users, data)
  }

  update(id: string, data: Partial<UserAttributes>): Promise<UserAttributes> {
    return this.put<UserAttributes>(`${API_ENDPOINTS.users}/${id}`, data)
  }

  deleteUser(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.users}/${id}`)
  }
}

export const userService = new UserService()
