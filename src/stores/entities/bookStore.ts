import { API_ENDPOINTS } from '@/stores/apiEndPoints';
import { defineEntityStore } from '@/stores/entityStore';
import type { Book } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/storeDefinition';

type ExtendBook = {};

export type ExtendedBook = CreateExtendedEntity<Book, ExtendBook>;

export const useBookStore = defineEntityStore<Book, ExtendBook>(
  'bookStore',
  {},
  { apiUrl: API_ENDPOINTS.books }
);
