import { API_ENDPOINTS } from '@/stores/apiEndPoints';
import { defineEntityStore } from '@/stores/entityStore';
import type { Book, Loan, User } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/storeDefinition';
import { useBookStore } from './bookStore';
import { useUserStore } from './userStore';

type ExtendLoan = {
  userEntity: User | null;
  bookEntity: Book | null;
};

export type ExtendedLoan = CreateExtendedEntity<Loan, ExtendLoan>;

export const useLoanStore = defineEntityStore<Loan, ExtendLoan>(
  'loanStore',
  {
    userEntity(target) {
      const userStore = useUserStore();
      return userStore.getRawEntity(target.ownerId) ?? null;
    },
    bookEntity(target) {
      const bookStore = useBookStore();
      return bookStore.getRawEntity(target.bookId) ?? null;
    },
  },
  {
    apiUrl: API_ENDPOINTS.loans,
  }
);
