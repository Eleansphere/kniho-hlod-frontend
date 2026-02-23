import { API_ENDPOINTS } from '@/stores/api-end-points'
import type { BookAttributes } from '@/types/entities'
import { ApiClient } from './ApiClient'

class BookService extends ApiClient {
  getAll(): Promise<BookAttributes[]> {
    return this.get<BookAttributes[]>(API_ENDPOINTS.books)
  }

  getById(id: string): Promise<BookAttributes> {
    return this.get<BookAttributes>(`${API_ENDPOINTS.books}/${id}`)
  }

  create(data: Partial<BookAttributes>): Promise<BookAttributes> {
    return this.post<BookAttributes>(API_ENDPOINTS.books, data)
  }

  update(id: string, data: Partial<BookAttributes>): Promise<BookAttributes> {
    return this.put<BookAttributes>(`${API_ENDPOINTS.books}/${id}`, data)
  }

  deleteBook(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.books}/${id}`)
  }
}

export const bookService = new BookService()
