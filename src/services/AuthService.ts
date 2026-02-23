import { API_ENDPOINTS } from '@/stores/api-end-points'
import type { LoggedUser, UserAttributes } from '@/types/entities'
import { ApiClient } from './ApiClient'

class AuthService extends ApiClient {
  login(credentials: Pick<UserAttributes, 'email' | 'password'>): Promise<LoggedUser> {
    return this.post<LoggedUser>(API_ENDPOINTS.userLogin, credentials)
  }
}

export const authService = new AuthService()
