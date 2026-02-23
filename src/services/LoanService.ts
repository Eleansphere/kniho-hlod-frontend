import { API_ENDPOINTS } from '@/stores/api-end-points'
import type { LoanAttributes } from '@/types/entities'
import { ApiClient } from './ApiClient'

class LoanService extends ApiClient {
  getAll(): Promise<LoanAttributes[]> {
    return this.get<LoanAttributes[]>(API_ENDPOINTS.loans)
  }

  getById(id: string): Promise<LoanAttributes> {
    return this.get<LoanAttributes>(`${API_ENDPOINTS.loans}/${id}`)
  }

  create(data: Partial<LoanAttributes>): Promise<LoanAttributes> {
    return this.post<LoanAttributes>(API_ENDPOINTS.loans, data)
  }

  update(id: string, data: Partial<LoanAttributes>): Promise<LoanAttributes> {
    return this.put<LoanAttributes>(`${API_ENDPOINTS.loans}/${id}`, data)
  }

  deleteLoan(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.loans}/${id}`)
  }

  getByBook(bookId: string): Promise<LoanAttributes[]> {
    return this.get<LoanAttributes[]>(`${API_ENDPOINTS.loans}?bookId=${bookId}`)
  }
}

export const loanService = new LoanService()
