import { API_ENDPOINTS } from '@/stores/api-end-points';
import { defineEntityStore } from '@/stores/entity-store';
import type { Book } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendBook = {};

export type ExtendedBook = CreateExtendedEntity<Book, ExtendBook>;

export const useBookStore = defineEntityStore<Book, ExtendBook>(
  'bookStore',
  {},
  { apiUrl: API_ENDPOINTS.books }
);

export function getAllBooks(userId: string): Array<ExtendedBook> {
  return useBookStore().entities.filter((book) => book.ownerId === userId);
}
