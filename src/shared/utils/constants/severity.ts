export type Severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

import type { LoanStatus } from '@/features/loans/constants';
import type { UserRole } from '@/features/users/constants';

export const LOAN_STATUS_SEVERITY: Record<LoanStatus, Severity> = {
  active: 'success',
  overdue: 'danger',
  returned: 'secondary',
};

export const USER_ROLE_SEVERITY: Record<UserRole, Severity> = {
  admin: 'info',
  user: 'secondary',
};

export const BOOK_AVAILABILITY_SEVERITY: Record<'available' | 'lent' | 'overdue', Severity> = {
  available: 'success',
  lent: 'info',
  overdue: 'danger',
};
