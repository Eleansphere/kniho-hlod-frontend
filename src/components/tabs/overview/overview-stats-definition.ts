import { authorizationStore } from '@/stores/authorizationStore';
import { getAllBooks } from '@/stores/entities/bookStore';
import {
  getActiveLoans,
  getAllLoans,
  getEarliestLoanReturn,
  getLatestLoan,
  type ExtendedLoan,
} from '@/stores/entities/loanStore';
import type { OverviewStatsTab } from '@/types/overview-stats';
import { computed } from 'vue';

const { loggedUser } = authorizationStore();

export const overviewStats = computed<Array<OverviewStatsTab>>(() => {
  return [
    {
      label: 'Aktivní výpůjčky',
      color: '#34d399',
      value: getActiveLoans(loggedUser!.id).length,
      icon: 'pi pi-table',
    },
    {
      label: 'Celkem výpůjček',
      color: '#60a5fa',
      value: getAllLoans(loggedUser!.id).length,
      icon: 'pi pi-image',
    },
    {
      label: 'Počet knih',
      color: '#fbbf24',
      value: getAllBooks(loggedUser!.id).length,
      icon: 'pi pi-inbox',
    },
  ];
});

export const lastBorrowedBook = computed<ExtendedLoan>(() => {
  return getLatestLoan();
});

export const earliestLoanReturn = computed<ExtendedLoan>(() => {
  return getEarliestLoanReturn();
});
