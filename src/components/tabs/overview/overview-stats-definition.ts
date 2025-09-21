import { authorizationStore } from '@/stores/authorization-store';
import { getAllBooks } from '@/stores/entities/book-store';
import {
  getActiveLoans,
  getAllLoans,
  getEarliestLoanReturn,
  getLatestLoan,
  type ExtendedLoan,
} from '@/stores/entities/loan-store';
import type { OverviewStatsTab } from '@/types/overview-stats';
import { computed } from 'vue';

const { loggedUser } = authorizationStore();

export const overviewStats = computed<Array<OverviewStatsTab>>(() => {
  return [
    {
      label: 'Aktivní výpůjčky',
      color: '#34d399',
      value: getActiveLoans(loggedUser!.id).length,
      icon: 'pi pi-calendar-clock',
    },
    {
      label: 'Celkem výpůjček',
      color: '#60a5fa',
      value: getAllLoans(loggedUser!.id).length,
      icon: 'pi pi-inbox',
    },
    {
      label: 'Počet knih',
      color: '#aaaf24',
      value: getAllBooks(loggedUser!.id).length,
      icon: 'pi pi-book',
    },
  ];
});

export const lastBorrowedBook = computed<ExtendedLoan>(() => {
  return getLatestLoan();
});

export const earliestLoanReturn = computed<ExtendedLoan>(() => {
  return getEarliestLoanReturn();
});
